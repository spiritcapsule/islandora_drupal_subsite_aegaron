<?php
/**
 * @file
 * Utility functions for running the tester UI for web services.
 */


/**
 * FAPI form used to display the options and the results of calling a web
 * service.
 */
function wsclient_tester_operation_test($form, $form_state, $service, $operation) {
  $strings = array(
    '!service_label' => $service->label,
    '!operation_label' => $operation['label'],
  );
  drupal_set_title(t("Testing Web Service : !service_label : !operation_label()", $strings));
  $form  = array();

  $form['uri'] = array(
    '#title' => 'Service URI',
    '#type' => 'textfield',
    '#disabled' => TRUE,
    '#value' => $service->url,
  );
  $form['parameters'] = array(
    '#title' => 'parameters',
    '#type' => 'container',
    '#tree' => TRUE,
    '#value' => t("Enter the parameters to the !operation_label service here. It's up to you to get the data types right. No type validation is done at this end, as it's a debugger to let you throw various errors at the web service and see how it responds.", $strings),
  );

  // Deal with complex types.
  // Each complex type may require its own mini-form for data entry,
  // and these may be nested.
  $datatypes = $service->datatypes;
  foreach ($operation['parameter'] as $param => $info) {
    $form['parameters'][$param] = wsclient_tester_data_entry_form($param, $info['type'], @$info['description'], @$form_state['values']['parameters'], $datatypes);
  }
  $form['execute'] = array(
    '#type' => 'submit',
    '#value' => 'Execute request',
    '#ajax' => array(
      'event' => 'click',
      'callback' => 'wsclient_tester_prepare_request_callback',
      'wrapper' => 'edit-transaction',
      'method' => 'replace',
      'effect' => 'fade',
    ),
  );

  // Set up result panes. Content for these usually gets filled in via ajax.

  $form['transaction'] = array(
    '#type' => 'fieldset',
    '#title' => 'Transaction',
    '#attributes' => array('id' => 'edit-transaction'),
  );

  $form['transaction']['request'] = array(
    '#type' => 'fieldset',
    '#title' => 'Request',
  );

  $form['transaction']['request']['header'] = array(
    '#markup' => 'Headers go here',
    '#prefix' => '<pre>',
    '#suffix' => '</pre>',
  );

  $form['transaction']['request']['packet'] = array(
    '#markup' => 'Packet goes here',
    '#prefix' => '<pre>',
    '#suffix' => '</pre>',
  );

  $form['transaction']['request']['data'] = array();

  $form['transaction']['response'] = array(
    '#type' => 'fieldset',
    '#title' => 'Response',
  );
  $form['transaction']['response']['header'] = array(
    '#markup' => 'ResponseHeaders go here',
    '#prefix' => '<pre>',
    '#suffix' => '</pre>',
  );

  $form['transaction']['response']['packet'] = array(
    '#markup' => 'ResponsePayload goes here',
    '#prefix' => '<pre>',
    '#suffix' => '</pre>',
  );

  $form['transaction']['response']['data'] = array();

  return $form;
}

/**
 * Callback for the test from 'prepare' button.
 */
function wsclient_tester_prepare_request_callback($form, $form_state) {
  $service = $form_state['build_info']['args'][0];
  $operation = $form_state['build_info']['args'][1];

  // Convert the form values into a data structure suitable for making the query.
  // Magic?
  // service::invoke will cast this array into the correct paramaterized objects
  // According to the $operation['parameter'] schema. Nifty.
  $args = array();
  if (!empty($form_state['values']['parameters'])) {
    $args = $form_state['values']['parameters'];
  }

  if ($service->type == 'soap') {
    // The service will have an endpoint that will have a SOAPClient.
    // Settings on the service->options may be passed to the SOAPClient.
    // @see WSClientSOAPEndpoint::client()
    // @see http://www.php.net/manual/en/soapclient.soapclient.php
    $service->settings['options']['trace'] = TRUE;
    // disable cache when testing!
    $service->settings['options']['cache_wsdl'] = WSDL_CACHE_NONE;
  }

  // Ready to actually invoke the call
  $timer_before = microtime();
  try {
    $response = $service->invoke($operation['name'], $args);
  }
  catch (Exception $e) {
    $response = $e->getMessage();
  }
  $timer_duration = $timer_before - microtime();

  $element = $form['transaction'];

  // Place the trace data into the display.
  if ($service->type == 'rest') {
    $operation = $service->operations[$operation['name']];
    $parameters = '';
    foreach ($args as $para_name => $para_value) {
      $parameters .= $para_name . '=' . $para_value . '<br>';
    }
    $reqInfo = 'Uri:' . $service->url . $operation['url'] . '<br>' .
      'Method:' . (isset($operation['type']) ? $operation['type'] : 'GET') . '<br>' .
      'Parameter:' . $parameters;
    $element['request']['packet']['#markup'] = $reqInfo;
    $element['response']['header']['#markup'] = $service->endpoint()->client()->lastResponse->headers;
    $element['response']['packet']['#markup'] = $service->endpoint()->client()->lastResponse->body;
  }
  elseif ($service->type == 'soap') {
    $element['request']['header']['#markup'] = $service->endpoint()->client()->__getLastRequestHeaders();
    $element['request']['packet']['#markup'] = htmlspecialchars(wsclient_tester_prettify_xml($service->endpoint()->client()->__getLastRequest()));
    $element['response']['header']['#markup'] = $service->endpoint()->client()->__getLastResponseHeaders();
    $element['response']['packet']['#markup'] = htmlspecialchars(wsclient_tester_prettify_xml($service->endpoint()->client()->__getLastResponse()));
  }

  if (module_exists('devel')) {
    $element['request']['data']['#markup'] = kpr($args, 1);
    $element['response']['data']['#markup'] = kpr($response, 1);
   }

  $element['#value'] = t("Ran at %time, took %duration to execute", array(
    '%time' => time(),
    '%duration' => $timer_duration,
  ));

  return $element;
}

/**
 * Indent and format XML for display.
 */
function wsclient_tester_prettify_xml($xml) {
  $dom = new DOMDocument;
  $dom->preserveWhiteSpace = FALSE;
  $dom->loadXML($xml);
  $dom->formatOutput = TRUE;
  return $dom->saveXml();
}


/**
 * A mini form element representing the given data type.
 * textfield for most things, but nested fieldsets for complex types.
 *
 * This recurses through complex types until it hits core types.
 *
 * @return a FAPI form fragment.
 */
function wsclient_tester_data_entry_form($label, $type, $description, $data, $datatypes) {
  if (isset($datatypes[$type])) {
    // Build a complex type.
    $datatype = $datatypes[$type];
    $element = array(
      '#type' => 'fieldset',
      '#title' => check_plain("$label ({$datatype['label']})"),
      '#collapsible' => TRUE,
    );
    foreach ($datatype['property info'] as $field_id => $field_info) {
      // Recurse and get each bit to render its own input element.
      $element[$field_id] = wsclient_tester_data_entry_form($field_id, $field_info['type'], @$field_info['description'], $data[$field_id], $datatypes);
    }
    return $element;
  }
  elseif (preg_match('/^list\<(.*)\>$/', $type, $matches)) {
    // Strange notation, type="list<MyType>" means a list of those things.
    // @see wsclient_soap_type_mapper()
    // This becomes a numerically indexed array.
    // Present it in the form as a nested list.
    $actual_type = $matches[1];
    $element = array(
      '#type' => 'fieldset',
      '#title' => t("List of %label (%type)", array('%label' => $label, '%type' => $type)),
      '#collapsible' => TRUE,
    );
    for ($field_id = 0; $field_id < 3; $field_id++) {
      // Recurse and get each bit to render its own input element
      $element[$field_id] = wsclient_tester_data_entry_form($field_id, $actual_type, NULL, $data[$field_id], $datatypes);
      $element[$field_id]['#collapsed'] = TRUE;
    }
    return $element;
  }
  elseif ($type == 'text_formatted') {
    return array(
      '#type' => 'textarea',
      '#title' => t("%label (%type)", array('%label' => $label, '%type' => $type)),
      '#default_value' => $data,
      '#description' => $description,
    );
  }
  elseif ($type == 'boolean') {
    return array(
      '#type' => 'select',
      '#title' => t("%label (%type)", array('%label' => $label, '%type' => $type)),
      '#default_value' => $data,
      // Defining false first so it's the default when setting up a form.
      '#options' => array('false' => 'false', 'true' => 'true'),
      '#description' => $description,
    );
  }
  else {
    // A textfield will normally do for any other primitives.
    return array(
      '#type' => 'textfield',
      '#title' => t("%label (%type)", array('%label' => $label, '%type' => $type)),
      '#default_value' => $data,
      '#size' => 20,
      '#description' => $description,
    );
  }
}
