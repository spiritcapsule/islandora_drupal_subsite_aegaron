<?php

/**
 * @file
 */
  $service = wsclient_service_load('aegaron_soap_service');
  $result = $service->listAllArabicTerms();
  $xmlstr = "<<<XML\n" . stripslashes($result->return) . "XML;";
  $xml = new SimpleXMLElement($result->return);
?>
<div class="<?php print $classes; ?>">

  <div data-effect="accordion">

  <?php foreach ($xml->category as $i => $category ): ?>
    <?php
      $cat = 'classification';
      $classification = (string)$category->attributes()->$cat;
      $catid = 'id-'.strtolower(preg_replace('/[^a-zA-Z0-9-]+/', '-', $classification));
    ?>
    <div dir="rtl" class="category" id="<?php print($catid); ?>">
      <?php print aegaron_soap_translate_cat($classification,'ar'); ?>
      <ul dir="rtl" lang="ar" class="term-list arabic">
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
