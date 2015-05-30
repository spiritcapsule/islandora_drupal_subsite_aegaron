/******************************

	launch of document ready

*******************************/
$( document ).ready(function() {

	// set a default map id if not provided
	if(aegaron.getUrlVar('mapid1') !== '') { aegaron.mapid1 = aegaron.getUrlVar('mapid1')};
	if(aegaron.getUrlVar('mapid2') !== '') {
		// if url call includes a second map, popup a message window
		aegaron.mapid2 = aegaron.getUrlVar('mapid2');
		$('#loading').modal('show');
		setTimeout(function(){aegaron.dualView(1);$('#loading').modal('hide');},1500);
	};

	// initialize the map
	aegaron.initializeMaps();

	// get mosaic data
    aegaron.getAllPlansFromMosaic();

    // add the transparency slider
	aegaron.transparencySlider();

	// resize (maximize) the window
	aegaron.resize();

	// enable geo toggle
	$('#geo-toggle').change(function() {
		aegaron.toggleGeo();
	})
});

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
	var height = $(window).height()-80;
	$('#mapcontainer1-map').css('height',height);
	$('#mapcontainer2-map1').css('height',height);
	$('#mapcontainer2-map2').css('height',height);
	$('#map1').css('height',height);
	$('#map2').css('height',height);
	$('#map3').css('height',height);
	// map1.updateSize();

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
		// layers: aegaron.alllayers_map1,
		view: new ol.View({
			center: aegaron.mapCenter, 
			zoom: aegaron.zoomLevel
		})
	});

	// create map2 (left map for dual view)
	aegaron.map2 = new ol.Map({
		target: 'map2',
		// layers: aegaron.alllayers_map2,
		view: new ol.View({
			center: aegaron.map1.getView().getCenter(),
			zoom: aegaron.zoomLevel
		})
	});

	// create map3 (right map for dual view)
	aegaron.map3 = new ol.Map({
		target: 'map3',
		// layers: aegaron.alllayers_map3,
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
	// aegaron.map1.on('moveend', function(){aegaron.redrawOnMoveend()});
	aegaron.map2.on('moveend', function(){aegaron.redrawOnMoveend()});
	aegaron.map3.on('moveend', function(){aegaron.redrawOnMoveend()});

}

/****************************************

	Call ArcServer and get all the 
	layers from the Mosaic Database

*****************************************/
aegaron.getAllPlansFromMosaic = function()
{
	$("#changecompare1").empty();
	$("#changecompare2").empty();
	$("#changecompare3").empty();

	if(aegaron.geo)
	{
		// url to arc server
		var url = aegaron.arcgisserver_rest_url+'/ImageServer/query?where=1=1&outFields=*&orderByFields=Name&returnGeometry=true&outSR=102100&f=pjson';
	}
	else
	{
		// url to arc server
		var url = aegaron.arcgisserver_nongeo_rest_url+'/ImageServer/query?where=1=1&outFields=*&orderByFields=Name&returnGeometry=true&outSR=102100&f=pjson';		
	}

	// ajax call
	$.getJSON(url,function(data){
		aegaron.mosaicData = data.features;

		// loop through each mosaic
		$.each(data.features,function(i,item){
			// name is the Plan ID (eg: 0001, 0012, etc)
			var name = item.attributes.Name;
			var text = aegaron.getDrawingByPlanID(name).place + ': ' + aegaron.getDrawingByPlanID(name).planTitle + ', ' + aegaron.getDrawingByPlanID(name).view + ', ' + aegaron.getDrawingByPlanID(name).state  + ' (' + aegaron.getDrawingByPlanID(name).drawing + ')';

			// add to the drop down choices for all 3 map divs
			$("#changecompare1").append('<option value='+name+'>'+text+'</option>');
			$("#changecompare2").append('<option value='+name+'>'+text+'</option>');
			$("#changecompare3").append('<option value='+name+'>'+text+'</option>');
		});

		// set the drop down values
		$('#changecompare1').val(aegaron.mapid1);
		$('#changecompare2').val(aegaron.mapid1);
		$('#changecompare3').val(aegaron.mapid2);

		// initiate the default map
		aegaron.switchCompareMap(aegaron.map1);
	})
}

/****************************************

	Populate drop downs

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
		// todo: redo this to loop through array count!!
		mapdivid.removeLayer(mapdivid.getLayers().getArray()[0]);
		mapdivid.removeLayer(mapdivid.getLayers().getArray()[0]);
		mapdivid.removeLayer(mapdivid.getLayers().getArray()[0]);
		mapdivid.removeLayer(mapdivid.getLayers().getArray()[0]);
	}

	// get the bounding box of current map
	var thisbbox = mapdivid.getView().calculateExtent(mapdivid.getSize());

	var polygon = [
		[
			[thisbbox[0],thisbbox[1]],
			[thisbbox[2],thisbbox[1]],
			[thisbbox[2],thisbbox[3]],
			[thisbbox[0],thisbbox[3]],
			[thisbbox[0],thisbbox[1]]
		]
	];

	// get the pixel size of the div
	// make sure to compensate for retina displays (window.devicePixelRatio)
	var windowsize = [mapdivid.getSize()[0]*window.devicePixelRatio,mapdivid.getSize()[1]*window.devicePixelRatio];

	// set which map to get
	if(mapdivid == aegaron.map1 || mapdivid == aegaron.map2)
	{
		// get the objectID for this mapid
		var objectID = aegaron.mapid2objectid(aegaron.mapid1);
	}
	else
	{
		// get the objectID for this mapid
		var objectID = aegaron.mapid2objectid(aegaron.mapid2);
	}

	if(objectID!==undefined)
	{
		// geo or nongeo?
		if(aegaron.geo)
		{
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

/****************************************

	Satellite basemap selection function

*****************************************/
aegaron.getApolloSatelliteByCenterLatLng = function(center)
{
	if(	center[0]>aegaron.apollo.philae.extent.xmin && 
		center[0]<aegaron.apollo.philae.extent.xmax && 
		center[1]>aegaron.apollo.philae.extent.ymin && 
		center[1]<aegaron.apollo.philae.extent.ymax)
	{
		return aegaron.apollo.philae.layer;
	}
	else if(
		center[0]>aegaron.apollo.amarna.extent.xmin && 
		center[0]<aegaron.apollo.amarna.extent.xmax && 
		center[1]>aegaron.apollo.amarna.extent.ymin && 
		center[1]<aegaron.apollo.amarna.extent.ymax)
	{
		return aegaron.apollo.amarna.layer;
	}
	else if
	(
		center[0]>aegaron.apollo.BentPyramid.extent.xmin && 
		center[0]<aegaron.apollo.BentPyramid.extent.xmax && 
		center[1]>aegaron.apollo.BentPyramid.extent.ymin && 
		center[1]<aegaron.apollo.BentPyramid.extent.ymax)
	{
		return aegaron.apollo.BentPyramid.layer;
	}
	else if
	(
		center[0]>aegaron.apollo.KaHouseofPepil.extent.xmin && 
		center[0]<aegaron.apollo.KaHouseofPepil.extent.xmax && 
		center[1]>aegaron.apollo.KaHouseofPepil.extent.ymin && 
		center[1]<aegaron.apollo.KaHouseofPepil.extent.ymax)
	{
		return aegaron.apollo.KaHouseofPepil.layer;
	}
	else if
	(
		center[0]>aegaron.apollo.MastabaMereruka.extent.xmin && 
		center[0]<aegaron.apollo.MastabaMereruka.extent.xmax && 
		center[1]>aegaron.apollo.MastabaMereruka.extent.ymin && 
		center[1]<aegaron.apollo.MastabaMereruka.extent.ymax)
	{
		return aegaron.apollo.MastabaMereruka.layer;
	}
	else if
	(
		center[0]>aegaron.apollo.MedinetMadi.extent.xmin && 
		center[0]<aegaron.apollo.MedinetMadi.extent.xmax && 
		center[1]>aegaron.apollo.MedinetMadi.extent.ymin && 
		center[1]<aegaron.apollo.MedinetMadi.extent.ymax)
	{
		return aegaron.apollo.MedinetMadi.layer;
	}
	else if
	(
		center[0]>aegaron.apollo.RoyalNecropolis.extent.xmin && 
		center[0]<aegaron.apollo.RoyalNecropolis.extent.xmax && 
		center[1]>aegaron.apollo.RoyalNecropolis.extent.ymin && 
		center[1]<aegaron.apollo.RoyalNecropolis.extent.ymax)
	{
		return aegaron.apollo.RoyalNecropolis.layer;
	}
	else if
	(
		center[0]>aegaron.apollo.Sety.extent.xmin && 
		center[0]<aegaron.apollo.Sety.extent.xmax && 
		center[1]>aegaron.apollo.Sety.extent.ymin && 
		center[1]<aegaron.apollo.Sety.extent.ymax)
	{
		return aegaron.apollo.Sety.layer;
	}
	else if
	(
		center[0]>aegaron.apollo.TempleofQasr.extent.xmin && 
		center[0]<aegaron.apollo.TempleofQasr.extent.xmax && 
		center[1]>aegaron.apollo.TempleofQasr.extent.ymin && 
		center[1]<aegaron.apollo.TempleofQasr.extent.ymax)
	{
		return aegaron.apollo.TempleofQasr.layer;
	}
	else if
	(
		center[0]>aegaron.apollo.TombIII.extent.xmin && 
		center[0]<aegaron.apollo.TombIII.extent.xmax && 
		center[1]>aegaron.apollo.TombIII.extent.ymin && 
		center[1]<aegaron.apollo.TombIII.extent.ymax)
	{
		return aegaron.apollo.TombIII.layer;
	}
	else if
	(
		center[0]>aegaron.apollo.Uronart.extent.xmin && 
		center[0]<aegaron.apollo.Uronart.extent.xmax && 
		center[1]>aegaron.apollo.Uronart.extent.ymin && 
		center[1]<aegaron.apollo.Uronart.extent.ymax)
	{
		return aegaron.apollo.Uronart.layer;
	}
}

/****************************************

	View mode functions

*****************************************/
aegaron.toggleGeo = function()
{
	if(aegaron.geo)
	{
		aegaron.geo = false;
	}
	else
	{
		aegaron.geo = true;
	}
	aegaron.getAllPlansFromMosaic();
}

// toggle view modes (single/dual)
aegaron.dualView = function(view)
{
	if (view == 0)
	{
		$('#mapcontainer2').hide();
		$('#mapcontainer1').show();
		$('#sync-nav').hide();
		// $('#map-nav').show();
		aegaron.map1.updateSize();
		aegaron.viewState = 0;

	}
	else if (view == 1)
	{
		$('#mapcontainer1').hide();
		$('#mapcontainer2').show();
		$('#changecompare2').val(aegaron.mapid1);
		$('#sync-nav').show();
		aegaron.map2.updateSize();
		aegaron.map3.updateSize();
		aegaron.resize();
		aegaron.viewState = 1;
	}
}

// toggle syncing of dual maps
aegaron.toggleSyncMaps = function()
{
	if(aegaron.syncmaps)
	{
		aegaron.map3.unbindAll();
		var oldView = aegaron.map3.getView();
		aegaron.map3.setView(new ol.View({
			center: oldView.getCenter().slice(),
			resolution: oldView.getResolution(),
			rotation: oldView.getRotation()
		}));
		$('#sync-button-text').html('Sync maps')
		aegaron.syncmaps = false;
	}
	else
	{
		aegaron.map3.bindTo('view',aegaron.map2);
		$('#sync-button-text').html('Unsync maps')
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
	var urlvars = aegaron.mapViewerHTMLFile+'?mapid1='+aegaron.mapid1+'&mapid2='+aegaron.mapid2+'&center='+aegaron.map1.getView().getCenter()+'&zoom='+aegaron.map1.getView().getZoom();
	history.pushState(null, "A new title!", urlvars);
}

/****************************************

	switch maps when new dropdown 
	map chosen

*****************************************/ 
aegaron.switchCompareMap=function(map)
{
console.log(map);
console.log(aegaron.map1);
console.log(aegaron.map2);
console.log(aegaron.map3);

	if(map === aegaron.map1)
	{
		var compareID = $('#changecompare1').val();
		aegaron.mapid1 = compareID;
		aegaron.setUrlVars();
		$('#changecompare2').val(compareID);

		// zoom to extent of new map
		var thisExtent = aegaron.getExtentByMapID(aegaron.mapid1);

		aegaron.map1.getView().fitExtent(thisExtent,aegaron.map1.getSize());

		redrawLayer(aegaron.map1);

	}
	else if (map === aegaron.map2)
	{
		var compareID = $('#changecompare2').val();
		aegaron.mapid1 = compareID;
		aegaron.setUrlVars();
		$('#changecompare1').val(compareID);

		// zoom to extent of new map
		var thisExtent = aegaron.getExtentByMapID(aegaron.mapid1);
		aegaron.map1.getView().fitExtent(thisExtent,aegaron.map1.getSize());
		aegaron.map2.getView().fitExtent(thisExtent,aegaron.map2.getSize());

		redrawLayer(aegaron.map2);
	}
	else if (map === aegaron.map3)
	{
		var compareID = $('#changecompare3').val();
		aegaron.mapid2 = compareID;
		aegaron.setUrlVars();
		// // zoom to extent of new map
		// var thisExtent = aegaron.getExtentByMapID(mapid1);
		// map1.getView().fitExtent(thisExtent,map1.getSize());

		redrawLayer(aegaron.map3);
	}
}

/****************************************

	Transparency functions for overlay

*****************************************/
// transparency slider for overlay
aegaron.transparencySlider = function()
{
	var handle = document.getElementById('handle2'),
		start,
		startLeft;

	document.onmousemove = function(e) {

		if (!start) return;
		// Adjust control
		handle.style.left = Math.max(0, Math.min(190, startLeft + parseInt(e.clientX, 10) - start)) + 40 + 'px';
		// Adjust opacity
		var opacity = 1 - ((handle.offsetLeft-40) / 190);

		aegaron.current_opacity = opacity;

		aegaron.map1.getLayers().getArray()[1].setOpacity(opacity)
		aegaron.map2.getLayers().getArray()[1].setOpacity(opacity)
		aegaron.map3.getLayers().getArray()[1].setOpacity(opacity)
	}

	handle.onmousedown = function(e) {
		// Record initial positions
		start = parseInt(e.clientX, 0);
		startLeft = handle.offsetLeft - 40;
		return false;
	}

	document.onmouseup = function(e) {
		start = null;
	}
}

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
	var handleposition = 190-(this_opacity*190)+40+'px';

	handle2.style.left=handleposition;

	aegaron.map1.getLayers().getArray()[1].setOpacity(this_opacity)
	aegaron.map2.getLayers().getArray()[1].setOpacity(this_opacity)
	aegaron.map3.getLayers().getArray()[1].setOpacity(this_opacity)
}
