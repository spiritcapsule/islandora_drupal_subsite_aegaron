
// namespace and application settings
var aegaron = 
{
	viewState: 			0, 		// 0 = single; 1 = dual
	geo:  				true,
	zoomLevel: 			19,
	mapid1: 			'0011', // default mapid
	mapid2: 			'', 	//empty by default 
	mapCenter: 			[3660710.823399583, 2756502.4598684157], 
	current_opacity: 	1,	// 0 is fully transparent
	syncmaps: 			true,
	mosaicData: 		'',
	mosaicData_nongeo: 		'',
	layer1: 			'',
	apollo_mosaic:		'',
	map1: 				'',
	map2: 				'',
	map3: 				'',
	mapViewerHTMLFile: 	location.protocol + '//' + location.host + location.pathname,
	// arcgisserverurl: 	'http://marinus.library.ucla.edu:6080/arcgis/rest/services/AEGARON/Georeferenced',
	// http://marinus.library.ucla.edu:6080/arcgis/services/AEGARON/Aegaron_Georeference_4
	arcgisserver_wms_url: 			'http://marinus.library.ucla.edu:6080/arcgis/services/AEGARON/Aegaron_Georeference_6/ImageServer/WMSServer',
	arcgisserver_nongeo_wms_url: 	'http://marinus.library.ucla.edu:6080/arcgis/services/AEGARON/nongeo/ImageServer/WMSServer',
	arcgisserver_rest_url: 			'http://marinus.library.ucla.edu:6080/arcgis/rest/services/AEGARON/Aegaron_Georeference_6',
	arcgisserver_nongeo_rest_url: 	'http://marinus.library.ucla.edu:6080/arcgis/rest/services/AEGARON/nongeo',
	arcgisserver_apollo_url: 		'http://marinus.library.ucla.edu:6080/arcgis/rest/services/AEGARON/apollo',

	/* 
		satellite images as layers
		could potentially do this with an ajax call, but 
		since satellites unlikely to change, hard coded for now
	*/
	apollo:   			
	{
		philae: 
		{
			layer: 	new ol.layer.Tile({
						mapid: 1,
						source: new ol.source.XYZ({
							url: 'http://whippet.ats.ucla.edu/arcgis/rest/services/aegaron_satellite/Philae/ImageServer/tile/{z}/{y}/{x}',
							maxZoom: 23
						}),
						visible: true
					}),
			extent: {
						xmin: 3658330.0695730043,
						ymin: 2754515.624864164,
						xmax: 3663210.147980874,
						ymax: 2765907.1119138952
					},
		},
		amarna: 
		{
			layer: 	new ol.layer.Tile({
						mapid: 1,
						source: new ol.source.XYZ({
							url: 'http://marinus.library.ucla.edu:6080/arcgis/rest/services/Apollo/Amarna/ImageServer/tile/{z}/{y}/{x}',
							maxZoom: 23
						}),
						visible: true
					}),
			extent: {
						xmin: 3437267.0469278307,
						ymin: 3200064.187354515,
						xmax: 3445520.8846547855,
						ymax: 3208673.196566174
					},

		},
		BentPyramid: {
			layer: new ol.layer.Tile({
				mapid: 1,
				source: new ol.source.XYZ({
					url: 'http://marinus.library.ucla.edu:6080/arcgis/rest/services/Apollo/BentPyramid/ImageServer/tile/{z}/{y}/{x}',
					maxZoom: 23
				}),
				visible: true
			}),
			extent:{
				xmin: 3471919.1192442696,
				ymin: 3473878.8581638006,
				xmax: 3477528.6565922936,
				ymax: 3479982.215290852
			},

		},
		KaHouseofPepil: {
			layer: new ol.layer.Tile({
				mapid: 1,
				source: new ol.source.XYZ({
					url: 'http://marinus.library.ucla.edu:6080/arcgis/rest/services/Apollo/KaHouseofPepil/ImageServer/tile/{z}/{y}/{x}',
					maxZoom: 23
				}),
				visible: true
			}),
			extent:{
				xmin: 354611,
				ymin: 3380777,
				xmax: 359582,
				ymax: 3385956
			},

		},
		MastabaMereruka: {
			layer: new ol.layer.Tile({
				mapid: 1,
				source: new ol.source.XYZ({
					url: 'http://marinus.library.ucla.edu:6080/arcgis/rest/services/Apollo/MastabaMereruka/ImageServer/tile/{z}/{y}/{x}',
					maxZoom: 23
				}),
				visible: true
			}),
			extent:{
				xmin: 325763.5,
				ymin: 3303907,
				xmax: 330719,
				ymax: 3308959
			},

		},
		MedinetMadi: {
			layer: new ol.layer.Tile({
				mapid: 1,
				source: new ol.source.XYZ({
					url: 'http://marinus.library.ucla.edu:6080/arcgis/rest/services/Apollo/MedinetMadi/ImageServer/tile/{z}/{y}/{x}',
					maxZoom: 23
				}),
				visible: true
			}),
			extent:{
				xmin: 268096.5,
				ymin: 3229302,
				xmax: 273170,
				ymax: 3234344.5
			},

		},
		RoyalNecropolis: {
			layer: new ol.layer.Tile({
				mapid: 1,
				source: new ol.source.XYZ({
					url: 'http://marinus.library.ucla.edu:6080/arcgis/rest/services/Apollo/RoyalNecropolis/ImageServer/tile/{z}/{y}/{x}',
					maxZoom: 23
				}),
				visible: true
			}),
			extent:{
				xmin: 3545769.7617167784,
				ymin: 3626844.7306822035,
				xmax: 3551717.6164066037,
				ymax: 3632831.9065948054
			},

		},
		Sety: {
			layer: new ol.layer.Tile({
				mapid: 1,
				source: new ol.source.XYZ({
					url: 'http://marinus.library.ucla.edu:6080/arcgis/rest/services/Apollo/Sety/ImageServer/tile/{z}/{y}/{x}',
					maxZoom: 23
				}),
				visible: true
			}),
			extent:{
				xmin: 3628768.946338864,
				ymin: 2959802.4519159338,
				xmax: 3634668.367990726,
				ymax: 2968407.069404106
			},

		},
		TempleofQasr: {
			layer: new ol.layer.Tile({
				mapid: 1,
				source: new ol.source.XYZ({
					url: 'http://marinus.library.ucla.edu:6080/arcgis/rest/services/Apollo/TempleofQasr/ImageServer/tile/{z}/{y}/{x}',
					maxZoom: 23
				}),
				visible: true
			}),
			extent:{
				xmin: 3412077.424953103,
				ymin: 3448663.93559936,
				xmax: 3417900.833754562,
				ymax: 3454796.4599660435
			},

		},
		TombIII: {
			layer: new ol.layer.Tile({
				mapid: 1,
				source: new ol.source.XYZ({
					url: 'http://marinus.library.ucla.edu:6080/arcgis/rest/services/Apollo/TombIII/ImageServer/tile/{z}/{y}/{x}',
					maxZoom: 23
				}),
				visible: true
			}),
			extent:{
				xmin: 3467375.0672043315,
				ymin: 3140267.533184527,
				xmax: 3473030.9181418247,
				ymax: 3146041.4513935703
			},

		},
		Uronart: {
			layer: new ol.layer.Tile({
				mapid: 1,
				source: new ol.source.XYZ({
					url: 'http://marinus.library.ucla.edu:6080/arcgis/rest/services/Apollo/Uronart/ImageServer/tile/{z}/{y}/{x}',
					maxZoom: 23
				}),
				visible: true
			}),
			extent:{
				xmin: 3447024.5386851165,
				ymin: 2452124.1125620706,
				xmax: 3452548.3630670113,
				ymax: 2457642.819629533
			},

		},
	},

};
