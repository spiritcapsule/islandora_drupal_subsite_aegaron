<?php

/**
 * @file
 */

  $service = wsclient_service_load('aegaron_soap_service');
  $result = $service->listAllDrawings();
  $drawings = $result->return;
  $places = array();

  foreach ($drawings as $drawing) {
    if (!array_key_exists($drawing->place,$places)) {
      $places[$drawing->place] = 1;
    } else {
      $places[$drawing->place] = $places[$drawing->place] + 1;
    }
  }
  uksort($places, "strnatcasecmp");

//kpr($drawings);
//kpr($places);
?>
<div class="<?php print $classes; ?>">

  <ul data-effect="accordion">
    <?php foreach ($places as $place => $drawingCount): ?>
      <li>
<a href="#" data-target="<?php print 'id-p-'.str_replace(' ','-',$place) ?>"><?php print($place) ?> (<?php print($drawingCount) ?>)</a>
        <ul id="<?php print 'id-p-'.str_replace(' ','-',$place) ?>">
          <?php foreach ($drawings as $drawing): ?>
            <?php if($drawing->place == $place): ?>
              <li><a href="/drawing/<?php print str_replace('/','_',$drawing->id) ?>"><?php print $drawing->place ?>, <?php print $drawing->planTitle ?>, <?php print $drawing->view ?>, <?php print $drawing->state ?>, <?php print $drawing->drawing ?></a></li>
            <?php endif; ?>
          <?php endforeach; ?>
        </ul>
      </li>
    <?php endforeach; ?>
  </ul>

</div><?php /* class view */ ?>
