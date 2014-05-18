<?php

/**
 * @file
 * Main view template.
 *
 * Variables available:
 * - $classes_array: An array of classes determined in
 *   template_preprocess_views_view(). Default classes are:
 *     .view
 *     .view-[css_name]
 *     .view-id-[view_name]
 *     .view-display-id-[display_name]
 *     .view-dom-id-[dom_id]
 * - $classes: A string version of $classes_array for use in the class attribute
 * - $css_name: A css-safe version of the view name.
 * - $css_class: The user-specified classes names, if any
 * - $header: The view header
 * - $footer: The view footer
 * - $rows: The results of the view query, if any
 * - $empty: The empty text to display if the view is empty
 * - $pager: The pager next/prev links to display, if any
 * - $exposed: Exposed widget form/info to display
 * - $feed_icon: Feed icon to display, if any
 * - $more: A link to view more, if any
 *
 * @ingroup views_templates
 */
  $service = wsclient_service_load('aegaron_dev_soap_service');
  $result = $service->listAllGermanTerms();
  $xmlstr = "<<<XML\n" . stripslashes($result->return) . "XML;";
  $xml = new SimpleXMLElement($result->return);
?>
<div class="<?php print $classes; ?>">
  <?php print render($title_prefix); ?>
  <?php if ($title): ?>
    <?php print $title; ?>
  <?php endif; ?>
  <?php print render($title_suffix); ?>
  <?php if ($header): ?>
    <div class="view-header">
      <?php print $header; ?>
    </div>
  <?php endif; ?>

  <?php if ($exposed): ?>
    <div class="view-filters">
      <?php print $exposed; ?>
    </div>
  <?php endif; ?>

  <div data-effect="accordion">

  <?php foreach ($xml->category as $i => $category ): ?>
    <?php
      $cat = 'classification';
      $classification = (string)$category->attributes()->$cat;
      $id = 'id-'.strtolower(preg_replace('/[^a-zA-Z0-9-]+/', '-', $classification));
    ?>
    <div id="<?php print($id); ?>">
      <?php print($classification); ?>
      <ul>
      <?php foreach ($category->term->preferred as $j => $term): ?>
        <?php
          $id = 'arkid';
          $arkid = str_replace('/','-',(string)$term->attributes()->$id);
          $link = '/terms/'.$arkid;
        ?>
        <li>
          <a href="<?php print($link); ?>"><?php print((string)$term); ?></a>
        </li>
      <?php endforeach; ?>
      </ul>
    </div>
  <?php endforeach; ?>

  </div> <!-- /data-effect=accordion -->

</div><?php /* class view */ ?>
