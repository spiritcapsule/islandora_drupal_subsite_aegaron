<?php

function aegaron_page_alter($page) {
// <meta name=”viewport” content=”width=device-width, initial-scale=1”/>

$viewport = array(
'#type' => 'html_tag',
'#tag' => 'meta',
'#attributes' => array(

// Uncomment following line to add settings to viewport
'content' =>  'width=device-width, initial-scale=1',
'name' =>  'viewport')
);

drupal_add_html_head($viewport, 'viewport');
}
