
// namespace and application settings
var aegaron = 
{
	viewState: 			0, 		// 0 = single; 1 = dual
	geo:  				true,
	zoomLevel: 			18,
	mapid1: 			'0011', // default mapid
	mapid2: 			'', 	//empty by default 
	mapCenter: 			[3660710.823399583, 2756502.4598684157], 
	current_opacity: 	1,	// 0 is fully transparent
	syncmaps: 			true,
	rotation: 			0,
	mosaicData: 		'',
	mosaicData_nongeo: 		'',
	layer1: 			'',
	planIDforDDindexLookup: [], // puts planID's in an array for DD lookup
	apollo_mosaic:		'',
	map1: 				'',
	map2: 				'',
	map3: 				'',
	mapViewerHTMLFile: 	location.protocol + '//' + location.host + location.pathname,
	arcgisserver_wms_url: 			'http://marinus.library.ucla.edu:6080/arcgis/services/AEGARON/Aegaron_Georeference_13/ImageServer/WMSServer',
	// arcgisserver_wms_url_16bit: 	'http://marinus.library.ucla.edu:6080/arcgis/services/AEGARON/Aegaron_Georeference_16bit/ImageServer/WMSServer',
	arcgisserver_nongeo_wms_url: 	'http://marinus.library.ucla.edu:6080/arcgis/services/AEGARON/nongeo6/ImageServer/WMSServer',
	arcgisserver_rest_url: 			'http://marinus.library.ucla.edu:6080/arcgis/rest/services/AEGARON/Aegaron_Georeference_13',
	// arcgisserver_rest_url: 			'http://marinus.library.ucla.edu:6080/arcgis/rest/services/AEGARON/Aegaron_Georeference_16bit',
	arcgisserver_nongeo_rest_url: 	'http://marinus.library.ucla.edu:6080/arcgis/rest/services/AEGARON/nongeo6',
	arcgisserver_apollo_url: 		'http://marinus.library.ucla.edu:6080/arcgis/rest/services/AEGARON/apollo',
	satellite_list: 				['Abydos','Amarna','Assuit','Beni_Hassan','BentPyramid','Deir_el_Bersheh','KaHouseofPepil','MastabaMereruka','MedinetMadi','Meir','Philae','Qasr_el_Sagha','Qaw_el_Kebir','Qubbet_el_Hawa','RoyalNecropolis','Sety','TempleofQasr','TombIII','Uronart'],
	/* 
		satellite images as layers
		could potentially do this with an ajax call, but 
		since satellites unlikely to change, hard coded for now
	*/
	apollo:   			
	{
		Abydos: 
		{
			layer: 	new ol.layer.Tile({
						mapid: 1,
						source: new ol.source.XYZ({
							url: 'http://marinus.library.ucla.edu:6080/arcgis/rest/services/Apollo/Abydos/ImageServer/tile/{z}/{y}/{x}',
							maxZoom: 23
						}),
						visible: true
					}),
			extent: {
						XMin: 3549150.768288675,
						YMin: 3018067.7937676054,
						XMax: 3553797.268288675,
						YMax: 3024330.2937676054
					},
		},
		Amarna: 
		{
			layer: 	new ol.layer.Tile({
						mapid: 1,
						source: new ol.source.XYZ({
							url: 'http://marinus.library.ucla.edu:6080/arcgis/rest/services/Apollo/Amarna2/ImageServer/tile/{z}/{y}/{x}',
							maxZoom: 23
						}),
						visible: true
					}),
			extent: {
						XMin: 3437267.0469278307,
						YMin: 3200064.187354515,
						XMax: 3445520.8846547855,
						YMax: 3208673.196566174
					},
		},
		Assuit: 
		{
			layer: 	new ol.layer.Tile({
						mapid: 1,
						source: new ol.source.XYZ({
							url: 'http://marinus.library.ucla.edu:6080/arcgis/rest/services/Apollo/Assuit/ImageServer/tile/{z}/{y}/{x}',
							maxZoom: 23
						}),
						visible: true
					}),
			extent: {
						XMin: 3465772.42768397,
						YMin: 3141167.6263523977,
						XMax: 3473123.62768397,
						YMax: 3148292.026352398
					},
		},
		Beni_Hassan: 
		{
			layer: 	new ol.layer.Tile({
						mapid: 1,
						source: new ol.source.XYZ({
							url: 'http://marinus.library.ucla.edu:6080/arcgis/rest/services/Apollo/Beni_Hassan2/ImageServer/tile/{z}/{y}/{x}',
							maxZoom: 23
						}),
						visible: true
					}),
			extent: {
						XMin: 3434309.8988564485,
						YMin: 3235823.73994852,
						XMax: 3439215.1988564483,
						YMax: 3242952.9399485197
					},
		},
		BentPyramid: {
			layer: new ol.layer.Tile({
				mapid: 1,
				source: new ol.source.XYZ({
					url: 'http://marinus.library.ucla.edu:6080/arcgis/rest/services/Apollo/BentPyramid2/ImageServer/tile/{z}/{y}/{x}',
					maxZoom: 23
				}),
				visible: true
			}),
			extent:{
				XMin: 3471919.1192442696,
				YMin: 3473878.8581638006,
				XMax: 3477528.6565922936,
				YMax: 3479982.215290852
			},
		},
		Deir_el_Bersheh: {
			layer: new ol.layer.Tile({
				mapid: 1,
				source: new ol.source.XYZ({
					url: 'http://marinus.library.ucla.edu:6080/arcgis/rest/services/Apollo/Deir_el_Bersheh2/ImageServer/tile/{z}/{y}/{x}',
					maxZoom: 23
				}),
				visible: true
			}),
			extent:{
				XMin: 3438962.8325051265,
				YMin: 3214744.1091649546,
				XMax: 3444522.1325051263,
				YMax: 3220911.8091649543
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
				XMin: 3504725.2064376324,
				YMin: 3574522.736804245,
				XMax: 3510574.2064376324,
				YMax: 3580640.236804245
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

				XMin: 3472662.9154930054,
				YMin: 3484732.307331472,
				XMax: 3478463.1634985423,
				YMax: 3490642.6501977933
			},
		},
		MedinetMadi: {
			layer: new ol.layer.Tile({
				mapid: 1,
				source: new ol.source.XYZ({
					url: 'http://marinus.library.ucla.edu:6080/arcgis/rest/services/Apollo/MedinetMadi2/ImageServer/tile/{z}/{y}/{x}',
					maxZoom: 23
				}),
				visible: true
			}),
			extent:{

				XMin: 3407982.818594572,
				YMin: 3397448.987852402,
				XMax: 3413903.318594572,
				YMax: 3403364.987852402
			},
		},
		Meir: {
			layer: new ol.layer.Tile({
				mapid: 1,
				source: new ol.source.XYZ({
					url: 'http://marinus.library.ucla.edu:6080/arcgis/rest/services/Apollo/Meir/ImageServer/tile/{z}/{y}/{x}',
					maxZoom: 23
				}),
				visible: true
			}),
			extent:{

				XMin: 3415542.791697063,
				YMin: 3170561.8556119907,
				XMax: 3422422.391697063,
				YMax: 3178940.8556119907
			},
		},
		Philae: 
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
						XMin: 3658330.0695730043,
						YMin: 2754515.624864164,
						XMax: 3663210.147980874,
						YMax: 2765907.1119138952
					},
		},
		Qasr_el_Sagha: 
		{
			layer: 	new ol.layer.Tile({
						mapid: 1,
						source: new ol.source.XYZ({
							url: 'http://whippet.ats.ucla.edu/arcgis/rest/services/aegaron_satellite/Qasr_el_Sagha/ImageServer/tile/{z}/{y}/{x}',
							maxZoom: 23
						}),
						visible: true
					}),
			extent: {
						XMin: 3412225.593212202,
						YMin: 3448614.3862699713,
						XMax: 3417966.6932122023,
						YMax: 3454656.9862699714
					},
		},
		Qaw_el_Kebir: 
		{
			layer: 	new ol.layer.Tile({
						mapid: 1,
						source: new ol.source.XYZ({
							url: 'http://whippet.ats.ucla.edu/arcgis/rest/services/aegaron_satellite/Qaw_el_Kebir/ImageServer/tile/{z}/{y}/{x}',
							maxZoom: 23
						}),
						visible: true
					}),
			extent: {
						XMin: 3502289.828440334,
						YMin: 3109930.6753261015,
						XMax: 3509992.828440334,
						YMax: 3117688.1753261015
					},
		},
		Qubbet_el_Hawa: 
		{
			layer: 	new ol.layer.Tile({
						mapid: 1,
						source: new ol.source.XYZ({
							url: 'http://whippet.ats.ucla.edu/arcgis/rest/services/aegaron_satellite/Qubbet_el_Hawa/ImageServer/tile/{z}/{y}/{x}',
							maxZoom: 23
						}),
						visible: true
					}),
			extent: {
						XMin: 3658490.4385469505,
						YMin: 2763457.807786861,
						XMax: 3663868.4385469505,
						YMax: 2768865.307786861
					},
		},
		RoyalNecropolis: {
			layer: new ol.layer.Tile({
				mapid: 1,
				source: new ol.source.XYZ({
					url: 'http://marinus.library.ucla.edu:6080/arcgis/rest/services/Apollo/RoyalNecropolis22/ImageServer/tile/{z}/{y}/{x}',
					maxZoom: 23
				}),
				visible: true
			}),
			extent:{
				XMin: 3545769.7617167784,
				YMin: 3626844.7306822035,
				XMax: 3551717.6164066037,
				YMax: 3632831.9065948054
			},

		},
		Sety: {
			layer: new ol.layer.Tile({
				mapid: 1,
				source: new ol.source.XYZ({
					url: 'http://marinus.library.ucla.edu:6080/arcgis/rest/services/Apollo/Sety2/ImageServer/tile/{z}/{y}/{x}',
					maxZoom: 23
				}),
				visible: true
			}),
			extent:{
				XMin: 3628768.946338864,
				YMin: 2959802.4519159338,
				XMax: 3634668.367990726,
				YMax: 2968407.069404106
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
				XMin: 3412077.424953103,
				YMin: 3448663.93559936,
				XMax: 3417900.833754562,
				YMax: 3454796.4599660435
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
				XMin: 3467375.0672043315,
				YMin: 3140267.533184527,
				XMax: 3473030.9181418247,
				YMax: 3146041.4513935703
			},

		},
		Uronart: {
			layer: new ol.layer.Tile({
				mapid: 1,
				source: new ol.source.XYZ({
					url: 'http://marinus.library.ucla.edu:6080/arcgis/rest/services/Apollo/Uronart3/ImageServer/tile/{z}/{y}/{x}',
					maxZoom: 23
				}),
				visible: true
			}),
			extent:{
				XMin: 3447024.5386851165,
				YMin: 2452124.1125620706,
				XMax: 3452548.3630670113,
				YMax: 2457642.819629533
			},
		},
	},
};
