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

$service = wsclient_service_load('aegaron_soap_service');
$params = array();

if (isset($view->args[0])) {
  $arkid = str_replace('_','/',$view->args[0]);
} else {
  $arkid = '21198/zz002c3kjg';
}

$params['ark'] = $arkid;
$result = $service->getItem($params);

if (isset($result->return)) {
  $drawing = $result->return;
  $metadata = new SimpleXMLElement($drawing->xmlMetadata);
  $itemdata = $metadata->metadata->dc;

  foreach($itemdata->altIdentifier as $tempid) {
    if (isset($tempid->drawing)) {
      $drawingid = (string)$tempid->drawing;
    }
  }

  foreach($itemdata->subject as $tempdata) {
    if (isset($tempdata->place)) {
      $place = (string)$tempdata->place;
    } else {
      $place = '';
    }
  }

  foreach($itemdata->altTitle as $tempdata) {
    if (isset($tempdata->planTitle)) {
      $titletext = $place.', '.(string)$tempdata->planTitle;
      $title = '<h1>'.$titletext.'</h1>';
    }
  }

  foreach($itemdata->description as $tempdata) {
    if (isset($tempdata->temporalNote)) {
      $description_temporalNote = (string)$tempdata->temporalNote;
    } else {
      $description_temporalNote = '';
    }

    if (isset($tempdata->view)) {
      $description_view = (string)$tempdata->view;
    } else {
      $description_view = '';
    }
  }

  foreach($itemdata->type as $tempdata) {
    if (isset($tempdata->featureType)) {
      $type_featureType = (string)$tempdata->featureType;
    } else {
      $type_featureType = '';
    }

    if (isset($tempdata->state)) {
      $type_state = (string)$tempdata->state;
    } else {
      $type_state = '';
    }
  }

  $drawinglog = $drawing->pdfDrawingLogUrl;
  $thumb = $drawing->thumbnailUrl;
  $caddrawingurl = $drawing->cadDrawingUrl;
  $a0url = $drawing->pdfPrintSizeA0Url;
  $a1url = $drawing->pdfPrintSizeA1Url;
  $a3url = $drawing->pdfPrintSizeA3Url;
  $a4url = $drawing->pdfPrintSizeA4LetterUrl;

  // A0 Print Size
  if ($drawing->xmlPrintSizeA0MD) {
    $a0metadata = new SimpleXMLElement($drawing->xmlPrintSizeA0MD);
    $a0itemdata = $a0metadata->metadata->dc;

    foreach($a0itemdata->altIdentifier as $a0tempid) {
      if (isset($a0tempid->drawing)) {
        $a0drawingid = (string)$a0tempid->drawing;
      } else {
        $a0drawingid = '';
      }
    }

    foreach($a0itemdata->type as $a0tempdata) {
      if (isset($a0tempdata->ideal)) {
        $a0ideal = (string)$a0tempdata->ideal;
      } else {
        $a0ideal = '';
      }

      if (isset($a0tempdata->printSize)) {
        $a0printsize = (string)$a0tempdata->printSize;
      } else {
        $a0printsize = '';
      }
    }

    foreach($a0itemdata->coverage as $a0tempdata) {
      if (isset($a0tempdata->geoscale)) {
        $a0geoscale = (string)$a0tempdata->geoscale;
      } else {
        $a0geoscale = '';
      }
    }
  }

  // A1 Print Size
  if ($drawing->xmlPrintSizeA1MD) {
    $a1metadata = new SimpleXMLElement($drawing->xmlPrintSizeA1MD);
    $a1itemdata = $a1metadata->metadata->dc;

    foreach($a1itemdata->altIdentifier as $a1tempid) {
      if (isset($a1tempid->drawing)) {
        $a1drawingid = (string)$a1tempid->drawing;
      } else {
        $a1drawingid = '';
      }
    }

    foreach($a1itemdata->type as $a1tempdata) {
      if (isset($a1tempdata->ideal)) {
        $a1ideal = (string)$a1tempdata->ideal;
      } else {
        $a1ideal = '';
      }

      if (isset($a1tempdata->printSize)) {
        $a1printsize = (string)$a1tempdata->printSize;
      } else {
        $a1printsize = '';
      }
    }

    foreach($a1itemdata->coverage as $a1tempdata) {
      if (isset($a1tempdata->geoscale)) {
        $a1geoscale = (string)$a1tempdata->geoscale;
      } else {
        $a1geoscale = '';
      }
    }
  }

  // A3 Print Size
  if ($drawing->xmlPrintSizeA3MD) {
    $a3metadata = new SimpleXMLElement($drawing->xmlPrintSizeA3MD);
    $a3itemdata = $a3metadata->metadata->dc;

    foreach($a3itemdata->altIdentifier as $a3tempid) {
      if (isset($a3tempid->drawing)) {
        $a3drawingid = (string)$a3tempid->drawing;
      } else {
        $a3drawingid = '';
      }
    }

    foreach($a3itemdata->type as $a3tempdata) {
      if (isset($a3tempdata->ideal)) {
        $a3ideal = (string)$a3tempdata->ideal;
      } else {
        $a3ideal = '';
      }

      if (isset($a3tempdata->printSize)) {
        $a3printsize = (string)$a3tempdata->printSize;
      } else {
        $a3printsize = '';
      }
    }

    foreach($a3itemdata->coverage as $a3tempdata) {
      if (isset($a3tempdata->geoscale)) {
        $a3geoscale = (string)$a3tempdata->geoscale;
      } else {
        $a3geoscale = '';
      }
    }
  }

  // A4 Letter Print Size
  if ($drawing->xmlPrintSizeA4LetterMD) {
    $a4metadata = new SimpleXMLElement($drawing->xmlPrintSizeA4LetterMD);
    $a4itemdata = $a4metadata->metadata->dc;

    foreach($a4itemdata->altIdentifier as $a4tempid) {
      if (isset($a4tempid->drawing)) {
        $a4drawingid = (string)$a4tempid->drawing;
      } else {
        $a4drawingid = '';
      }
    }

    foreach($a4itemdata->type as $a4tempdata) {
      if (isset($a4tempdata->ideal)) {
        $a4ideal = (string)$a4tempdata->ideal;
      } else {
        $a4ideal = '';
      }

      if (isset($a4tempdata->printSize)) {
        $a4printsize = (string)$a4tempdata->printSize;
      } else {
        $a4printsize = '';
      }
    }

    foreach($a4itemdata->coverage as $a4tempdata) {
      if (isset($a4tempdata->geoscale)) {
        $a4geoscale = (string)$a4tempdata->geoscale;
      } else {
        $a4geoscale = '';
      }
    }
  }

} else {
    $drawing = array();
}

?>

<?php if (isset($drawingid)): ?>
  <script type="text/javascript">
  aegaron.mapid1 = '<?php print $drawingid; ?>';
  console.log(aegaron.mapid1);
  </script>
<?php else: ?>
  <?php drupal_set_message(t('No drawing with the arkid of '.$arkid),'warning'); ?>
<?php endif; ?>

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

  <?php if ($attachment_before): ?>
    <div class="attachment attachment-before">
      <?php print $attachment_before; ?>
    </div>
  <?php endif; ?>

<!-- content -->
    <div id="metadata" data-effect="accordion">
      <h2><a href="#" data-target="bldginfo">Building Info</a></h2>
      <div id="bldginfo" data-accordion="show">
        <p><img src="<?php print $thumb; ?>" alt="" /></p>
        <p><strong><?php print $titletext; ?></strong></p>
        <p><?php print $description_view; ?>, <?php print $type_state; ?></p>
        <p><?php print $type_featureType; ?></p>
        <p><?php print $description_temporalNote; ?></p>
        <p>Drawing Number: <?php print $drawingid; ?></p>
        <p>ID: <?php print $arkid; ?></p>
      </div>
      <h2><a href="#" data-target="drawinglog">Drawing Log</a></h2>
      <div id="drawinglog" data-accordion="show">
        <?php if ($drawinglog): ?>
          <p><a href="<?php print $drawinglog; ?>">Drawing Log (PDF)</a></p>
        <?php endif; ?>
      </div>
      <h2><a href="#" data-target="drawingfiles">Drawings</a></h2>
      <div id="drawingfiles" data-accordion="show">
        <ul>
          <?php if ($a0url): ?>
            <li><a href="<?php print $a0url; ?>"><?php print $a0drawingid.' - '.$a0printsize.' '.$a0ideal.' ['.$a0geoscale.'] PDF'; ?></a></li>
          <?php endif; ?>
          <?php if ($a1url): ?>
            <li><a href="<?php print $a1url; ?>"><?php print $a1drawingid.' - '.$a1printsize.' '.$a1ideal.' ['.$a1geoscale.'] PDF'; ?></a></li>
          <?php endif; ?>
          <?php if ($a3url): ?>
            <li><a href="<?php print $a3url; ?>"><?php print $a3drawingid.' - '.$a3printsize.' '.$a3ideal.' ['.$a3geoscale.'] PDF'; ?></a></li>
          <?php endif; ?>
          <?php if ($a4url): ?>
            <li><a href="<?php print $a4url; ?>"><?php print $a4drawingid.' - '.$a4printsize.' '.$a4ideal.' ['.$a4geoscale.'] PDF'; ?></a></li>
          <?php endif; ?>
          <?php if ($caddrawingurl): ?>
            <li><a href="<?php print $caddrawingurl; ?>">CAD Drawing</a></li>
          <?php endif; ?>
        </ul>
      </div>
    </div>
<!--
  <?php if ($rows): ?>
    <div class="view-content">
      <?php print $rows; ?>
    </div>
  <?php elseif ($empty): ?>
    <div class="view-empty">
      <?php print $empty; ?>
    </div>
  <?php endif; ?>
-->
<!-- end -->

  <?php if ($pager): ?>
    <?php print $pager; ?>
  <?php endif; ?>

  <?php if ($attachment_after): ?>
    <div class="attachment attachment-after">
      <?php print $attachment_after; ?>
    </div>
  <?php endif; ?>

  <?php if ($more): ?>
    <?php print $more; ?>
  <?php endif; ?>

  <?php if ($footer): ?>
    <div class="view-footer">
      <?php print $footer; ?>
    </div>
  <?php endif; ?>

  <?php if ($feed_icon): ?>
    <div class="feed-icon">
      <?php print $feed_icon; ?>
    </div>
  <?php endif; ?>

</div><?php /* class view */ ?>
