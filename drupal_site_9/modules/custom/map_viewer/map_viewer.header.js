/******************************

	launch of document ready

*******************************/
aegaron.init = function() {

/******************************

	Read URL parameters (if they exist)
	and customize the view

*******************************/

	// set a default map id if not provided
	if(aegaron.getUrlVar('zoom') !== '') { aegaron.zoomLevel = aegaron.getUrlVar('zoom')};

	if(aegaron.getUrlVar('mapid1') !== '') { aegaron.mapid1 = aegaron.getUrlVar('mapid1')};

	if(aegaron.getUrlVar('toggleGeo') !== '') 
	{ 
		if(aegaron.getUrlVar('toggleGeo')=='false')
		{
			console.log('toggling geo from url call...')
			aegaron.toggleGeo() 
		}
	};

	if(aegaron.getUrlVar('mapid2') !== '') {
		// if url call includes a second map, popup a message window
		aegaron.mapid2 = aegaron.getUrlVar('mapid2');
		$('#loading').modal('show');
		setTimeout(function(){aegaron.toggleLayout(1);$('#loading').modal('hide');},1500);
	};

	// if this is a section, toggle to nongeo viewer
	var thisview = aegaron.getDrawingByPlanID(aegaron.mapid1).view.toLowerCase();
	if(thisview.search('section')>-1||thisview.search('elevation')>-1||thisview.search('detail')>-1)
	{
		if(aegaron.geo)
		{
			console.log('this is a section, therefore toggling to nongeo...')
			aegaron.toggleGeo();
		}
	}

	// initialize the map
	aegaron.initializeMaps();

	// get mosaic data
    aegaron.getAllPlansFromMosaic();

	// resize (maximize) the window
	aegaron.resize();

	// enable geo toggle
	$('#geo-toggle').change(function() {
		console.log('toggling geo from dropdown...')
		aegaron.toggleGeo(true);
	})
}

/****************************************

	detect when window has been resized

*****************************************/
$( window ).resize(function() {
	aegaron.resize();
});

/****************************************

	resize the map when window size changes

*****************************************/
aegaron.resize = function()
{
	var height = $(window).height()-100;
	$('#mapcontainer1-map').css('height',height);
	$('#mapcontainer2-map1').css('height',height);
	$('#mapcontainer2-map2').css('height',height);
	$('#map1').css('height',height);
	$('#map2').css('height',height);
	$('#map3').css('height',height);
	$('.dd-options').css('height','400px');

	if(aegaron.map1){aegaron.map1.updateSize();};
	if(aegaron.map2){aegaron.map2.updateSize();};
	if(aegaron.map3){aegaron.map3.updateSize();};
}

/****************************************

	Initialize the 3 openlayer maps

*****************************************/
aegaron.initializeMaps = function()
{
	// create map1 (single view)
	aegaron.map1 = new ol.Map({
		target: 'map1',
		view: new ol.View({
			center: aegaron.mapCenter, 
			zoom: aegaron.zoomLevel
		})
	});

	// create map2 (left map for dual view)
	aegaron.map2 = new ol.Map({
		target: 'map2',
		view: new ol.View({
			center: aegaron.map1.getView().getCenter(),
			zoom: aegaron.zoomLevel
		})
	});

	// create map3 (right map for dual view)
	aegaron.map3 = new ol.Map({
		target: 'map3',
		view: new ol.View({
			center: aegaron.mapCenter, 
			zoom: aegaron.zoomLevel
		})
	});

	// bind/sync the maps in dual view
	aegaron.map2.bindTo('layergroup',aegaron.map1);
	aegaron.map2.bindTo('view',aegaron.map1);
	aegaron.map3.bindTo('view',aegaron.map2);

	// ask for image to be redrawn every time map view changes
	aegaron.map1.on('moveend', function(){aegaron.setUrlVars()});
	aegaron.map2.on('moveend', function(){aegaron.setUrlVars();aegaron.redrawOnMoveend()});
	aegaron.map3.on('moveend', function(){aegaron.setUrlVars();aegaron.redrawOnMoveend()});

}

/****************************************

	Call ArcServer and get all the 
	layers from the Mosaic Database

*****************************************/
aegaron.getAllPlansFromMosaic = function()
{
	// clear elements
	aegaron.planIDforDDindexLookup.length = 0;

	$("#changecompare1").msDropdown().data("dd").destroy()
	$("#changecompare2").msDropdown().data("dd").destroy()
	$("#changecompare3").msDropdown().data("dd").destroy()

	$("#changecompare1").empty();
	$("#changecompare2").empty();
	$("#changecompare3").empty();

	// get the appropriate mosaic dataset -- geo vs nongeo
	if(aegaron.geo)
	{
		console.log('getting URL for geo plans on marinus...')
		var pretitle = 'geo '
		var url = aegaron.arcgisserver_rest_url+'/ImageServer/query?where=1=1&outFields=*&orderByFields=Name&returnGeometry=true&outSR=102100&f=pjson';
	}
	else
	{
		console.log('getting URL for nongeo plans on marinus...')
		var pretitle = 'nongeo '
		var url = aegaron.arcgisserver_nongeo_rest_url+'/ImageServer/query?where=1=1&outFields=*&orderByFields=Name&returnGeometry=true&outSR=102100&f=pjson';	
	}

	// ajax call
	$.getJSON(url,function(data){
		aegaron.mosaicData = data.features;

		console.log('getting JSON data from Marinus.....')

		// generate the first dropdown option
		$("#changecompare1").append('<option selected value="--" data-imagecss="dd-image" data-image="" data-description="If you are in synced layout mode, choose a plan that is in the same location.">Select a plan to compare</option>');
		$("#changecompare2").append('<option selected value="--" data-imagecss="dd-image" data-image="" data-description="If you are in synced layout mode, choose a plan that is in the same location.">Select a plan to compare</option>');
		$("#changecompare3").append('<option selected value="--" data-imagecss="dd-image" data-image="" data-description="If you are in synced layout mode, choose a plan that is in the same location.">Select a plan to compare</option>');

		var index = 0;
		$.each(data.features,function(i,item){

			// name is the Plan ID (eg: 0001, 0012, etc)
			var name = item.attributes.Name;
			aegaron.planIDforDDindexLookup.push(name);
			var title = aegaron.getDrawingByPlanID(name).place + ' ' + name;
			var thumb = aegaron.getDrawingByPlanID(name).thumbnailUrl;
			var text = aegaron.getDrawingByPlanID(name).drawing+ ' ' +aegaron.getDrawingByPlanID(name).planTitle+ '<br>' + aegaron.getDrawingByPlanID(name).state;
			var OBJECTID = item.attributes.OBJECTID;

			map1selected = '';
			map3selected = '';
			if(name == aegaron.mapid1){map1selected = 'selected'}
			if(name == aegaron.mapid2){map3selected = 'selected'}

			// add to the drop down choices for all 3 map divs
			$("#changecompare1").append('<option '+map1selected+' value='+name+' data-imagecss="dd-image" data-image="'+thumb+'" data-description="'+text+'">'+title+'</option>');
			$("#changecompare2").append('<option '+map1selected+' value='+name+' data-imagecss="dd-image" data-image="'+thumb+'" data-description="'+text+'">'+title+'</option>');
			$("#changecompare3").append('<option '+map3selected+' value='+name+' data-imagecss="dd-image" data-image="'+thumb+'" data-description="'+text+'">'+title+'</option>');

		});
		 
		// Sort dropdowns alphabetically
		aegaron.sortDropdown("#changecompare1");
		aegaron.sortDropdown("#changecompare2");
		aegaron.sortDropdown("#changecompare3");

		// Add images to the dropdown	
		if(aegaron.viewState == 0)
		{
			$("#changecompare1").msDropdown({visibleRows:6});
			$('#changecompare1').on('change', function() {
				aegaron.switchCompareMapDD(aegaron.map1,this.value);
			});

			$('#changecompare1').val(aegaron.mapid1).trigger('change')
		}
		else
		{
			$("#changecompare2").msDropdown({visibleRows:6});
			$('#changecompare2').on('change', function() {
				aegaron.switchCompareMapDD(aegaron.map2,this.value);
			});
			$('#changecompare2').val(aegaron.mapid1).trigger('change')

			$("#changecompare3").msDropdown({visibleRows:6});
			$('#changecompare3').on('change', function() {
				aegaron.switchCompareMapDD(aegaron.map3,this.value);
			});
			// $('#changecompare3').val(aegaron.mapid2).trigger('change')
		}

		aegaron.resize();
		// add alt tags to the image
		$(".dd-image").attr('alt','')
	})
}

/****************************************

	Sort drop downs

*****************************************/
aegaron.sortDropdown = function(selectID)
{
	var sel = $(selectID);
	var opts_list = sel.find('option');
	opts_list.sort(function(a, b) { return $(a).text().toLowerCase() > $(b).text().toLowerCase() ? 1 : -1; });
	sel.html('').append(opts_list);
}

/****************************************

	Match drawing plans from DL with 
	what we have in ArcGIS Server
		*If no match is found
		 Display as "--"

*****************************************/
aegaron.getDrawingByPlanID = function(planID)
{
	// var drawing = $.grep(aegaron.drawings, function(e){ return e.drawing == planID; });	
	var drawing;

	$.each(aegaron.drawings,function(i,val){
		if(aegaron.drawings[i].drawing === planID)
		{
			drawing = aegaron.drawings[i];
		}
	})

	if(drawing)
	{
		return drawing;
	}
	else
	{
		var noPlan = {"drawing":planID,"place":"--","planTitle":"--"}
		return noPlan;
	}
}

aegaron.redrawOnMoveend = function()
{
	redrawLayer(aegaron.map1);
	redrawLayer(aegaron.map2);
	redrawLayer(aegaron.map3);
}

// convert mapid's (ex '0011') to OJBECTID which is what arc needs to identify mosaic layer
aegaron.mapid2objectid = function(mapid)
{
	for (var i=0; i < aegaron.mosaicData.length; i++) 
	{
		if (aegaron.mosaicData[i].attributes.Name === mapid)
		{
			return aegaron.mosaicData[i].attributes.OBJECTID;
		}
	}
}

aegaron.getInfoByMapID = function(mapid)
{
	for (var i=0; i < aegaron.mosaicData.length; i++) 
	{
		if (aegaron.mosaicData[i].attributes.Name === mapid)
		{
			return aegaron.mosaicData[i];
		}
	}
}

// get bounding box for given mapid
aegaron.getExtentByMapID = function(mapid)
{
	for (var i=0; i < aegaron.mosaicData.length; i++) 
	{
		if (aegaron.mosaicData[i].attributes.Name === mapid)
		{
			return new ol.extent.boundingExtent(aegaron.mosaicData[i].geometry.rings[0]);
		}
	}
}

/****************************************

	For every map redraw, redraw each
	layer accordingly

*****************************************/
// function to draw and redraw map(s) on request
function redrawLayer(mapdivid)
{
	// only redraw map2 and map3 if viewState = 1
	if(aegaron.viewState == 0 && mapdivid == 'map2') { return false; };
	if(aegaron.viewState == 0 && mapdivid == 'map3') { return false; };

	// putting mapdivid in a window[] array allows you to use a variable to call a global object
	// remove any existing overlays
	if(mapdivid.getLayers().getArray().length > 1)
	{
		$.each(mapdivid.getLayers().getArray(),function(i,val){
			mapdivid.removeLayer(mapdivid.getLayers().getArray()[0]);
		})
	}

	// get the bounding box of current map
	var thisbbox = mapdivid.getView().calculateExtent(mapdivid.getSize());

	// get the pixel size of the div
	// make sure to compensate for retina displays (window.devicePixelRatio)
	var windowsize = [mapdivid.getSize()[0]*window.devicePixelRatio,mapdivid.getSize()[1]*window.devicePixelRatio];

	// set which map to get
	if(mapdivid == aegaron.map1 || mapdivid == aegaron.map2)
	{
		// get the objectID for this mapid
		var objectID = aegaron.mapid2objectid(aegaron.mapid1);
		// 8 or 16 bit?
		var PlanIDasNum = Number(aegaron.mapid1);
	}
	else
	{
		// get the objectID for this mapid
		var objectID = aegaron.mapid2objectid(aegaron.mapid2);
		// 8 or 16 bit?
		var PlanIDasNum = Number(aegaron.mapid1);
	}

	if(objectID!==undefined)
	{
		// geo or nongeo?
		if(aegaron.geo)
		{
			// add satellite base
			aegaron.addSatelliteBaseMap(mapdivid);
			var url = aegaron.arcgisserver_wms_url;
		}
		else
		{
			var url = aegaron.arcgisserver_nongeo_wms_url;
		}

		// create the plan overlay from the WMS map service
		aegaron.layer1 = new ol.layer.Image({
			extent: aegaron.getRotationSafeImage(thisbbox),
			source: new ol.source.ImageWMS({
				
				url: url,
				params: {
							'LAYERS': 0,
							'images': objectID
						}
			})
		})

		// get the center of the current map
		var center = mapdivid.getView().getCenter();

		// based on the center, add the correct satellite basemap
		if(aegaron.getApolloSatelliteByCenterLatLng(center))
		{
			mapdivid.addLayer(aegaron.getApolloSatelliteByCenterLatLng(center));
		}

		// add the plan overlay
		mapdivid.addLayer(aegaron.layer1);

		// set the opacity
		aegaron.layer1.setOpacity(aegaron.current_opacity);
	}
}

aegaron.addSatelliteBaseMap = function(mapdivid)
{
	aegaron.satellite = new ol.layer.Tile({
		visible: true,
		preload: Infinity,
		source: new ol.source.BingMaps({
			key: 'Al3miDEvqOTQBtMvkY3vShhB3v1SDO3189Ni6RPF5NAraYTTKiLpmMjXgPqITabO',
			imagerySet: 'Aerial',
			// use maxZoom 19 to see stretched tiles instead of the BingMaps
			// "no photos at this zoom level" tiles
			maxZoom: 19
		})
	});
	// add the plan overlay
	mapdivid.getLayers().setAt(0, aegaron.satellite);
}

/****************************************

	Pad the bounding box to allow for
	seamless rotation of plan overlays

*****************************************/
aegaron.getRotationSafeWindowSize = function(windowsize)
{
	x1 = 0;
	y1 = 0;
	x2 = windowsize[0];
	y2 = windowsize[1];

	centerx = (x2-x1)/2+x1;
	centery = (y2-y1)/2+y1;

	// distance from center to bottom edge
	height = (y2-y1)/2;
	base = (x2-x1)/2;
	// distance of hypotenuse
	hypotenuse = Math.sqrt(height*height + base*base);
	

	return [Math.round(hypotenuse*2),Math.round(hypotenuse*2)]
}

aegaron.getRotationSafeImage = function(bbox)
{
	x1 = bbox[0];
	y1 = bbox[1];
	x2 = bbox[2];
	y2 = bbox[3];

	centerx = (x2-x1)/2+x1;
	centery = (y2-y1)/2+y1;

	// distance from center to bottom edge
	height = (y2-y1)/2;
	base = (x2-x1)/2;
	// distance of hypotenuse
	hypotenuse = Math.sqrt(height*height + base*base);
	// new x's and y's
	newx1 = centerx-hypotenuse;
	newy1 = centery-hypotenuse;
	newx2 = centerx+hypotenuse;
	newy2 = centery+hypotenuse;
	return [newx1,newy1,newx2,newy2]
}

aegaron.setRotation = function(direction)
{
	if(direction === 'left')
	{
		aegaron.rotation = aegaron.rotation-5;
		aegaron.rotation_radians = aegaron.rotation*(Math.PI/180)
		aegaron.map1.getView().setRotation(aegaron.rotation_radians);
	}
	else if (direction === 'right')
	{
		aegaron.rotation = aegaron.rotation+5;
		aegaron.rotation_radians = aegaron.rotation*(Math.PI/180)
		aegaron.map1.getView().setRotation(aegaron.rotation_radians);
	}
	else
	{
		aegaron.rotation = 0;
		aegaron.map1.getView().setRotation(aegaron.rotation);
	}
}

/****************************************

	Satellite basemap selection function

*****************************************/
aegaron.getApolloSatelliteByCenterLatLng = function(center)
{
	var rastertouse;
	$.each(aegaron.satellite_list,function(i,val){
		if(	center[0]>aegaron.apollo[val].extent.XMin && 
			center[0]<aegaron.apollo[val].extent.XMax && 
			center[1]>aegaron.apollo[val].extent.YMin && 
			center[1]<aegaron.apollo[val].extent.YMax)
		{
			rastertouse = val;
		}

	})
	
	if(rastertouse)
	{
		return aegaron.apollo[rastertouse].layer;
	}
}

/****************************************

	View mode functions

*****************************************/
// switch between geo and nongeo
aegaron.toggleGeo = function(reset)
{
	console.log('toggling geo...')
	if(aegaron.geo)
	{
		console.log('switching to no satellite')
		aegaron.geo = false;
		$('#view-mode-nosatellite').addClass('disabled');
		$('#view-mode-satellite').removeClass('disabled');
		$('#view-mode-button').html('view mode: no satellite');
	}
	else
	{
		console.log('switching to satellite')
		aegaron.geo = true;
		$('#view-mode-satellite').addClass('disabled');
		$('#view-mode-nosatellite').removeClass('disabled');
		$('#view-mode-button').html('view mode: satellite');
	}
	if(reset)
	{
		console.log('resetting all plans...')
		aegaron.getAllPlansFromMosaic();
	}
}

// toggle view modes (single/dual)
aegaron.toggleLayout = function(view)
{
	console.log('toggling layout...')
	if (view == 0) //single map
	{
		$('#mapcontainer2').hide();
		$('#mapcontainer1').show();
		$('#sync-nav').hide();
		
		// update the map to mirror map2
		$('#changecompare1').val(aegaron.mapid1).trigger('change')

		$('#layout-mode-single').addClass('disabled');
		$('#layout-mode-dual').removeClass('disabled');
		$('#layout-mode-dual-unsynced').removeClass('disabled');
		$('#layout-mode-button').html('layout mode: single map');

		aegaron.map1.updateSize();
		aegaron.viewState = 0;

	}
	else if (view == 1) //synced dual map
	{
		console.log('switching to synced dual map...')
		// update the map to mirror map2
		$('#changecompare2').val(aegaron.mapid1).trigger('change')
		$('#changecompare3').val(aegaron.mapid2).trigger('change')

		$('#mapcontainer1').hide();
		$('#mapcontainer2').show();
		$('#changecompare2').val(aegaron.mapid1);

		$("#changecompare2").msDropdown({visibleRows:6});
		$('#changecompare2').on('change', function() {
			aegaron.switchCompareMapDD(aegaron.map2,this.value);
		});

		$("#changecompare3").msDropdown({visibleRows:6});
		$('#changecompare3').on('change', function() {
			aegaron.switchCompareMapDD(aegaron.map3,this.value);
		});

		$('#layout-mode-single').removeClass('disabled');
		$('#layout-mode-dual').addClass('disabled');
		$('#layout-mode-dual-unsynced').removeClass('disabled');
		$('#layout-mode-button').html('layout mode: synced dual maps');
		aegaron.map2.updateSize();
		aegaron.map3.updateSize();
		aegaron.resize();
		aegaron.viewState = 1;
		aegaron.toggleSyncMaps(1);
	}
	else if (view == 2) //unsynced dual map
	{
		// update the map to mirror map2
		$('#changecompare2').val(aegaron.mapid1).trigger('change')
		$('#changecompare3').val(aegaron.mapid2).trigger('change')

		$('#mapcontainer1').hide();
		$('#mapcontainer2').show();
		$('#changecompare2').val(aegaron.mapid1);
		
		$("#changecompare2").msDropdown({visibleRows:4});
		$('#changecompare2').on('change', function() {
			aegaron.switchCompareMapDD(aegaron.map2,this.value);
		});

		$("#changecompare3").msDropdown({visibleRows:4});
		$('#changecompare3').on('change', function() {
			aegaron.switchCompareMapDD(aegaron.map3,this.value);
		});

		$('#layout-mode-dual').removeClass('disabled');
		$('#layout-mode-single').removeClass('disabled');
		$('#layout-mode-dual-unsynced').addClass('disabled');
		$('#layout-mode-button').html('layout mode: unsynced dual maps');
		aegaron.map2.updateSize();
		aegaron.map3.updateSize();
		aegaron.resize();
		aegaron.viewState = 2;
		aegaron.toggleSyncMaps(0);
	}
	// add alt tags to the image
	$(".dd-image").attr('alt','')
}

// toggle syncing of dual maps
aegaron.toggleSyncMaps = function(syncmode)
{
	if(syncmode == 0)
	{
		aegaron.map3.unbindAll();
		var oldView = aegaron.map3.getView();
		aegaron.map3.setView(new ol.View({
			center: oldView.getCenter().slice(),
			resolution: oldView.getResolution(),
			rotation: oldView.getRotation()
		}));
		$('#sync-button-text').html('Sync maps')

		$('#sync-mode-unsynced').addClass('disabled');
		$('#sync-mode-synced').removeClass('disabled');
		$('#sync-mode-button').html('sync mode: unsynced');


		aegaron.syncmaps = false;
	}
	else if (syncmode == 1)
	{
		aegaron.map3.bindTo('view',aegaron.map2);
		$('#sync-button-text').html('Unsync maps')

		$('#sync-mode-synced').addClass('disabled');
		$('#sync-mode-unsynced').removeClass('disabled');
		$('#sync-mode-button').html('sync mode: synced');

		aegaron.syncmaps = true;
	}

}

/****************************************

	Dynamic URL functions

*****************************************/
// get URL parameters
aegaron.getUrlVar = function(key)
{
	var result = new RegExp(key + "=([^&]*)", "i").exec(window.location.search); 
	return result && unescape(result[1]) || ""; 
}

// set URL parameters
aegaron.setUrlVars=function(evt)
{
	var urlvars = aegaron.mapViewerHTMLFile+'?mapid1='+aegaron.mapid1+'&mapid2='+aegaron.mapid2+'&center='+aegaron.map1.getView().getCenter()+'&zoom='+aegaron.map1.getView().getZoom()+'&toggleGeo='+aegaron.geo;
	history.pushState(null, "A new title!", urlvars);
}

/****************************************

	switch maps when new dropdown 
	map chosen

*****************************************/ 
aegaron.switchCompareMapDD=function(map,data)
{
	console.log('switching map from dropdown...')
	if(map === aegaron.map1)
	{
		var compareID = data;
		aegaron.mapid1 = compareID;
		aegaron.setUrlVars();

		var index = $.inArray(compareID,aegaron.planIDforDDindexLookup);
		// console.log('switched index: ' +index)

		// if requested map does not exist (maybe it is section that has not been georeferenced)
		if(index < 0)
		{
			alert('The plan you selected is not available in satellite mode. Choose "view mode: no satellite" or select a different plan to view in Satellite mode')
		}
		// zoom to extent of new map
		// only if dual view
		if(aegaron.viewState == 0)
		{
			var thisExtent = aegaron.getExtentByMapID(aegaron.mapid1);
			aegaron.map1.getView().fitExtent(thisExtent,aegaron.map1.getSize());

			redrawLayer(aegaron.map1);
		}
	}
	else if (map === aegaron.map2)
	{
		var compareID = data;
		aegaron.mapid1 = compareID;
		aegaron.setUrlVars();

		var index = $.inArray(compareID,aegaron.planIDforDDindexLookup);

		// zoom to extent of new map
		// only if dual view
		if(aegaron.viewState >= 1)
		{
			var thisExtent = aegaron.getExtentByMapID(aegaron.mapid1);
			aegaron.map1.getView().fitExtent(thisExtent,aegaron.map1.getSize());
			aegaron.map2.getView().fitExtent(thisExtent,aegaron.map2.getSize());

			redrawLayer(aegaron.map2);
		}
	}
	else if (map === aegaron.map3)
	{
		var compareID = data;
		aegaron.mapid2 = compareID;

		// // zoom to extent of new map
		if(aegaron.viewState >= 1)
		{
			aegaron.setUrlVars();
			var thisExtent = aegaron.getExtentByMapID(aegaron.mapid2);
			aegaron.map3.getView().fitExtent(thisExtent,aegaron.map3.getSize());

			redrawLayer(aegaron.map3);
		}
	}
}

/****************************************

	Transparency functions for overlay

*****************************************/
aegaron.setOpacityFromSliderButtons = function(val)
{
	var this_opacity = aegaron.current_opacity + val;
	aegaron.setOpacity(this_opacity);	
}

aegaron.setOpacity = function(val) 
{
	var this_opacity = val;
	if(this_opacity>=1){ this_opacity = 1};
	if(this_opacity<0){ this_opacity = 0};

	aegaron.current_opacity = this_opacity;
	// set the slider postion too
	var handleposition = 156-(this_opacity*190)+40+'px';

	// different layer needs to be made opaque depending on satellite mode
	if(aegaron.geo) { layertomakeopaque = 2} else { layertomakeopaque = 0};

	if(aegaron.map1.getLayers().getArray().length>0)
		aegaron.map1.getLayers().getArray()[layertomakeopaque].setOpacity(this_opacity)
	if(aegaron.map2.getLayers().getArray().length>0)
		aegaron.map2.getLayers().getArray()[layertomakeopaque].setOpacity(this_opacity)
	if(aegaron.map3.getLayers().getArray().length>0)
		aegaron.map3.getLayers().getArray()[layertomakeopaque].setOpacity(this_opacity)
}

aegaron.compareArc2DLCSFeed = function()
{
	var drawingsarray = [];
	var counter = 1;
	$.each(aegaron.drawings,function(i,val){

		drawingsarray.push(val.drawing)
		if($.inArray(val.drawing,aegaron.planIDforDDindexLookup)==-1)
		{
			// are you a section?
			var thisview = aegaron.getDrawingByPlanID(val.drawing).view.toLowerCase();
			if(thisview.search('section')>-1||thisview.search('elevation')>-1||thisview.search('detail')>-1)
			{
				// console.log(counter+'. '+val.drawing + ' exists in DLCS but not in arc SECTION')
			}
			else
			{
				console.log(counter+'. '+val.drawing + ' exists in DLCS but not in arc (' + thisview + ')')
				counter++;
			}
		}
	})
	$.each(aegaron.planIDforDDindexLookup,function(i,val){
		// console.log(val.drawing)
		if($.inArray(val,drawingsarray)==-1)
		{
			console.log(val + ' exists in ARC but not in DLCS')
		}
	})
}
