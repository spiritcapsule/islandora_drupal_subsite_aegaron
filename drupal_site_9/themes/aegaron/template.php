<?php

/**
 * Here we override the default HTML output of drupal.
 * refer to http://drupal.org/node/550722
 */

// Auto-rebuild the theme registry during theme development.
if (theme_get_setting('clear_registry')) {
  // Rebuild .info data.
  system_rebuild_theme_data();
  // Rebuild theme registry.
  drupal_theme_rebuild();
}

define('THEME_DIR', dirname(__FILE__));
define('THEME_LIB_DIR', THEME_DIR.'/lib');

foreach(scandir(THEME_LIB_DIR) as $file){
    
    if(substr($file, 0, 1) == '.')
        continue;
    
    include_once(THEME_LIB_DIR.'/'.$file);
    
}
