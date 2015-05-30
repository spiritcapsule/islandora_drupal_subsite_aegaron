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

$term_lookup = array(
array('ambulatory temple','21198-zz002hvpv3'),
array('pillar','21198-zz002hw4b2'),
array('polygonal pillar','21198-zz002hwb8x'),
array('shaft','21198-zz002hw020'),
array('abacus','21198-zz002hvpzn'),
array('architrave','21198-zz002hvqbt'),
array('torus','21198-zz002hw9k3'),
array('cavetto cornice','21198-zz002hvz85'),
array('temple','21198-zz002hw9h2'),
array('Tempel, der (m.)','21198-zz002hw9h2'),
array('support','21198-zz002hw8vr'),
array('Stütze, die (f.)','21198-zz002hw8vr'),
array('column','21198-zz002hw12g'),
array('Säule, die (f.)','21198-zz002hw12g'),
array('Pfeiler, der (m.)','21198-zz002hw4b2'),
array('capital','21198-zz002hvrgc'),
array('Kapitell, das (n.)','21198-zz002hvrgc'),
array('stone masonry','21198-zz002hw8r6'),
array('entablature','21198-zz002hw0qt'),
array('Gebälk, das (n.)','21198-zz002hw0qt'),
);

  // load the service
  $service = wsclient_service_load('aegaron_soap_service');
  $queryarkid = str_replace('-','/',arg(1));
  $params = array('arkid' => $queryarkid);
  $result = $service->getTerm($params);
  $xmlstr = "<<<XML\n" . stripslashes($result->return) . "XML;";
  $xml = new SimpleXMLElement($result->return);

  // push all terms into an array
  $terms = array(
    'preferred-en' => array(),
    'preferred-de' => array(),
    'preferred-ar' => array(),
    'alternate-en' => array(),
    'alternate-de' => array(),
    'alternate-ar' => array(),
  );

  foreach ($xml->title as $term) {
    $lang = 'lang';
    $language = (string)$term->attributes()->$lang;
    array_push($terms['preferred-'.$language],(string)$term);
    $language = '';
  }

  foreach ($xml->alttitle as $term) {
    $lang = 'lang';
    $pref = 'preferred';
    $term_status = 'alternate';
    $language = (string)$term->attributes()->$lang;
    $term_status = (((string)$term->attributes()->$pref == 'true')? 'preferred' : 'alternate');
    array_push($terms[$term_status.'-'.$language],(string)$term);
    $language = '';
  }

  $i = 1;
  $relations = array();

  foreach ($xml->relationships->relationship as $key => $relationship) {
    $rel = (string)$relationship;
    $attr = 'type';
    $type = (string)$relationship->attributes()->$attr;
    $attr = 'lang';
    $lang = (string)$relationship->attributes()->$attr;
    $attr = 'arkid';
    $arkid = (string)$relationship->attributes()->$attr;
    $order = '';
    // TODO: remove condition when soap fixed
//    if ($type == 'parent' || $type == 'child') {
//      $arkid = ''; // soap returning wrong arkid
//    }
    if (isset($arkid)) {
      $parts = explode(':',$arkid);
      if (count($parts) > 1) {
        $order = $parts[0];
        $arkid = $parts[1];
      }
    } 
    $local = searchForId($rel,$term_lookup);
    if ($local) {
      $arkid = $local;
      $order = '';
    }
    if (isset($arkid)) {
      $link = '/terms/'.str_replace('/','-',$arkid);
    }
    $relations[$i] = array(
      'type' => $type,
      'lang' => $lang,
      'arkid' => $arkid,
      'link' => $link,
      'rel' => $rel,
      'order' => $order,
    );
    $i++;
  }

  // push images into an array
  $images = array();

  $i = 1;
  foreach ($xml->images->image as $image) {
    $imageurl = (string)$image;
    $linkurl = '';
    foreach ($relations as $rel) {
      if ($rel['type'] == 'plan' && $rel['order'] == $i) {
        $arkid = $rel['arkid'];
        $linkurl = '/drawing/'.trim(str_replace('/','_',$arkid));
      }
    }
    $images[$i] = array(
      'imageurl' => $imageurl,
      'linkurl' => $linkurl,
    );
    $i++;
  }

//  foreach ($terms as $term) {
//    if ($term) {
//      $extraimg = searchForISTthumb($term[0],$term_lookup);
//      if ($extraimg) {
//        foreach ($extraimg as $plannum) {
//          $imageurl = 'http://digital2.library.ucla.edu/dlcontent/aegaron/nails/'.$plannum.'.jpg';
//          array_push($images,$imageurl);
//        }
//      }
//    }
//  }

?>
<div class="<?php print $classes; ?>">
  <?php if ($header): ?>
    <div class="view-header">
      <?php print $header; ?>
    </div>
  <?php endif; ?>

  <h1 class="hide-accessible"><?php print((string)$terms['preferred-en'][0]); ?></h1>

  <div class="container">
    <div class="row medium-collapse">
      <div class="panel-6">
        <div class="main-image">
          <?php if (isset($images[1])): ?>
              <img src="<?php print($images[1]['imageurl']); ?>" alt="illustration of the term" />
            <?php if (isset($images[1]['linkurl']) && $images[1]['linkurl'] != ''): ?>
              <br /><a href="<?php print($images[1]['linkurl']); ?>" class="">View Context <span class="hide-accessible">for image #1</span></a>
            <?php endif; ?>
          <?php else : ?>
            <div class="missing-image">No Image Available</div>
          <?php endif; ?>
        </div> <!-- /.main-image -->
      </div> <!-- /.panel-6 -->
      <div class="panel-6 term-chart">
        <table>
        <tr class="head">
          <th scope="col">
            TERM
          </th>
          <th scope="col">
            SYNONYMS
          </th>
        </tr>
        <tr>
          <td>
            <?php foreach ($terms['preferred-en'] as $key => $term): ?>
              <?php echo ($key != 0 ? '<br/>' : ''); ?>
              <?php print($term); ?>
            <?php endforeach; ?>
          </td>
          <td>
            <?php foreach ($terms['alternate-en'] as $key => $term): ?>
              <?php echo ($key != 0 ? '<br/>' : ''); ?>
              <?php print($term); ?>
            <?php endforeach; ?>
          </td>
        </tr>
        <tr>
          <td>
            <?php foreach ($terms['preferred-de'] as $key => $term): ?>
              <?php echo ($key != 0 ? '<br/>' : ''); ?>
              <?php print($term); ?>
            <?php endforeach; ?>
          </td>
          <td>
            <?php foreach ($terms['alternate-de'] as $key => $term): ?>
              <?php echo ($key != 0 ? '<br/>' : ''); ?>
              <?php print($term); ?>
            <?php endforeach; ?>
          </td>
        </tr>
        <tr>
          <td lang="ar" dir="rtl">
            <?php foreach ($terms['preferred-ar'] as $key => $term): ?>
              <?php echo ($key != 0 ? '<br/>' : ''); ?>
              <?php print($term); ?>
            <?php endforeach; ?>
          </td>
          <td lang="ar" dir="rtl">
            <?php foreach ($terms['alternate-ar'] as $key => $term): ?>
              <?php echo ($key != 0 ? '<br/>' : ''); ?>
              <?php print($term); ?>
            <?php endforeach; ?>
          </td>
        </tr>
        </table>
      </div> <!-- /.panel-6 -->
    </div> <!-- /.row -->
    <div class="supplement-images">
      <?php foreach ($images as $key => $image): ?>
        <?php if ($key > 1): ?>
          <div class="image">
            <img src="<?php print($image['imageurl']); ?>" alt="illustration of term" />
          <?php if (isset($image['linkurl']) && $image['linkurl'] != ''): ?>
            <br /><a href="<?php print($image['linkurl']); ?>" class="">View Context <span class="hide-accessible">for image #<?php print($key); ?></span></a>
          <?php endif; ?>
          </div>
        <?php endif; ?>       
      <?php endforeach; ?>
    </div>
    <div class="see-also">
      <h2>See Also:</h2>
      <dl>
        <dt>Broader Terms</dt>
          <dd>
            <?php
              // display broader terms
              $i = 1;
              $count_of_terms = 0;
              foreach ($relations as $key => $relationship) {
                if (isset($relationship['type']) && $relationship['type'] == 'parent') {
                  if ($i > 1) {
                    echo (', ');
                  }
                  if (isset($relationship['link']) && $relationship['link'] != '') {
                    echo ('<a href="'.$relationship['link'].'">'.$relationship['rel'].'</a>');
                  } else {
                    echo ($relationship['rel']);
                  }
                  $count_of_terms++;
                  $i++;
                }
              }
              if ($count_of_terms < 1) {
                echo ('(None)');
              }              
            ?>
          </dd>
        <dt>Narrower Terms</dt>
          <dd>
            <?php
              // display narrower terms
              $i = 1;
              $count_of_terms = 0;
              foreach ($relations as $key => $relationship) {
                if (isset($relationship['type']) && $relationship['type'] == 'child') {
                  if ($i > 1) {
                    echo (', ');
                  }
                  if (isset($relationship['link']) && $relationship['link'] != '') {
                    echo ('<a href="'.$relationship['link'].'">'.$relationship['rel'].'</a>');
                  } else {
                    echo ($relationship['rel']);
                  }
                  $count_of_terms++;
                  $i++;
                }
              }
              if ($count_of_terms < 1) {
                echo ('(None)');
              }
            ?>
          </dd>
        <dt>Getty Thesaurus of Art &amp; Architecture<br/>
            Related Links</dt>
          <?php
            $attr = 'url';
            $aaturl = (string)$xml->aat->attributes()->$attr;
          ?>
          <dd>
            <?php if (isset($aaturl)): ?>
              <a href="<?php print($aaturl); ?>" target="_blank"><?php print((string)$xml->aat); ?><span class="hide-accessible"> opens in new window</span></a>
            <?php else: ?>
              <?php print((string)$xml->aat); ?>
            <?php endif; ?>
          </dd>
      </dl>
    </div>
  </div> <!-- /.container -->

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
          $arkid = (string)$term->attributes()->$id;
          $link = 'http://digital2.library.ucla.edu/viewItem.do?ark='.$arkid;
        ?>
        <li>
          <a href="<?php print($link); ?>"><?php print((string)$term); ?></a>
        </li>
      <?php endforeach; ?>
      </ul>
    </div>
  <?php endforeach; ?> 

  </div> <!-- /#term-detail -->

</div><?php /* class view */ ?>

<?php
function searchForId($str,$term_lookup) {
   foreach ($term_lookup as $key => $val) {
       if ($val[0] === $str) {
           return $val[1];
       }
   }
   return null;
}

function searchForISTthumb($str,$term_lookup) {
   $imgs = array();
   foreach ($term_lookup as $key => $val) {
       if ($val[0] === $str) {
           foreach ($val as $key2 => $val2) {
               if ($key2 > 1) {
                   array_push($imgs,$val[$key2]);
               }
           }
       }
   }
   if ($imgs) {
       return $imgs;
   } else {
       return null;
   }
}

?>
