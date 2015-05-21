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

  $service = wsclient_service_load('dev_aegaron_soap_service');
  $params = array();
  $op = 'listall';

  if (isset($_GET['keys'])) {
    $keyword = $_GET['keys'];
    $params['keyword'] = $keyword;
    $op = 'search';
  }

  if ($op == 'search') {
    $result = $service->searchDrawing($params);
  } else {
    $result = $service->listAllDrawings();
  }

  if (isset($result->return)) {
    $drawings = $result->return;
  } else {
    $drawings = array();
  }

//  $places = array();

//  foreach ($drawings as $drawing) {
//    if (!array_key_exists($drawing->place,$places)) {
//      $places[$drawing->place] = 1;
//    } else {
//      $places[$drawing->place] = $places[$drawing->place] + 1;
//    }
//  }
//  uksort($places, "strnatcasecmp");

//kpr($drawings);
//kpr($places);
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

  <ul id="searchdrawings">
    <?php if(!empty($drawings)): ?>
      <?php foreach ($drawings as $drawing): ?>
        <li><a href="/drawing/<?php print str_replace('/','_',$drawing->id) ?>">
          <figure>
            <span class="image">
              <img src="<?php print $drawing->thumbnailUrl ?>" alt="">
            </span>
            <figcaption>
              <span class="plantitle"><?php print $drawing->place ?>, <?php print $drawing->planTitle ?></span>
              <span class="state"><?php print $drawing->state ?></span>
            </figcaption>
          </figure>
        </a></li>
      <?php endforeach; ?>
    <?php else: ?>
      <li>No Results Found</li>
    <?php endif; ?>
  </ul>

</div><?php /* class view */ ?>
