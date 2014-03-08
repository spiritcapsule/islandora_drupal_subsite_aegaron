require 'pathname'
rootdir = File.dirname(Pathname.new(__FILE__).realpath)

# The directory into which WebBlocks is built
WebBlocks.config[:build][:dir] = "#{rootdir}/assets"

# The directory where sources for the build are located
WebBlocks.config[:src][:dir] = "#{rootdir}/src"

# Location of WebBlocks core components (config.rb, definitions, core adapter)
WebBlocks.config[:src][:core][:dir] = "#{rootdir}/package/WebBlocks/src/core"

# Location of WebBlocks adapters
WebBlocks.config[:src][:adapters][:dir] = "#{rootdir}/package/WebBlocks/src/adapter"

# Adapter packaged with WebBlocks
WebBlocks.config[:src][:adapter] = ['bootstrap']

WebBlocks.config[:src][:extensions] = ["#{rootdir}/src/extension"]

# Packages compiled into WebBlocks
WebBlocks.config[:src][:packages]  = []
# WebBlocks.config[:src][:packages] << :jquery # already included by Drupal
WebBlocks.config[:src][:packages] << :modernizr
WebBlocks.config[:src][:packages] << :respond
WebBlocks.config[:src][:packages] << :selectivizr
WebBlocks.config[:src][:packages] << :efx
