<div id="master-map-container">	
	<!-- map navigation bar -->
	<div id="map-nav" class="">
		<span class="btn btn-info btn-small" onclick="aegaron.dualView(0)"><span class="glyphicon glyphicon-stop"></span> Single View</span>
		<span class="btn btn-info btn-small" onclick="aegaron.dualView(1)"><span class="glyphicon glyphicon-stop"></span><span class="glyphicon glyphicon-stop"></span> Dual View</span>
		
		<!-- sync map button -->
		<span id="sync-nav" style="display:none;">
			|
			<span class="btn btn-info btn-small" onclick="aegaron.toggleSyncMaps()"><span class="glyphicon glyphicon-link"></span><span id="sync-button-text">Unsync Maps</span></span>
		</span>

		<!-- transparency slider -->
		&nbsp; | &nbsp; 
		<span id='control-container2'>
			<span onclick="aegaron.setOpacityFromSliderButtons(.1)" class="btn btn-info time-control left-border-radius" style=""><span class="glyphicon glyphicon-minus-sign"></span></span>
			<div id='control2'>
				<span style="color: #aaa;padding-top:15px;line-height: 34px;">transparency</span>
				<span id='handle2'></span>
			</div>
			<span onclick="aegaron.setOpacityFromSliderButtons(-.1)" class="btn btn-info time-control right-border-radius" style=""><span class="glyphicon glyphicon-plus-sign"></span></span>
		</span>

		<!-- 
			rotate instructions
			
			THIS IS NOT WORKING... 
			in the new version of Open Layers + Mosaic database combination
			NEED TO REVISIT
		 -->
		<!-- <p>Use <code>Alt</code>+<code>Shift</code>+drag to rotate the map.</p> -->
		<br><br>
	</div>

	<!-- map container for single map view -->
	<div id="mapcontainer1">
		<div class="mapcontainer-nav-left">
			<div class="form-inline">
				<div class="form-group">
					<button class="btn btn-mini btn-info" onclick="map1.getView().setZoom(map1.getView().getZoom()+1)"><span class="glyphicon glyphicon-zoom-in"></button>
					<button class="btn btn-mini btn-info" onclick="map1.getView().setZoom(map1.getView().getZoom()-1)"><span class="glyphicon glyphicon-zoom-out"></button>
				</div>
				<div class="form-group">
					<select class="form-control" style="margin-bottom:0px;" onChange="aegaron.switchCompareMap('map1')" id="changecompare1">
						<option value=1>-- choose a main plan --</option> 
					</select>
				</div>
			</div>
		</div>
		<div style="clear: both;"></div>
		<div id="mapcontainer1-map"><div id="map1"></div></div>		
	</div>
	
	<!-- map container for dual map view -->
	<div id="mapcontainer2">
		<div class="mapcontainer-nav-left">
			<div class="form-inline">
				<div class="form-group">
					<button class="btn btn-mini btn-info" onclick="map2.getView().setZoom(map2.getView().getZoom()+1)"><span class="glyphicon glyphicon-zoom-in"></span></button>
					<button class="btn btn-mini btn-info" onclick="map2.getView().setZoom(map2.getView().getZoom()-1)"><span class="glyphicon glyphicon-zoom-out"></span></button>
				</div>
				<div class="form-group">
					<select class="form-control" style="margin-bottom:0px;" onChange="aegaron.switchCompareMap('map2')" id="changecompare2">
						<option value=1>-- choose a main plan --</option> 
					</select>
				</div>
			</div>
		</div>
		<div class="mapcontainer-nav-right">
			<div class="form-inline">
				<div class="form-group">
					<select class="form-control" style="margin-bottom:0px;" onChange="aegaron.switchCompareMap('map3')" id="changecompare3">
						<option value=1>-- choose a second plan --</option> 
					</select>
				</div>
				<div class="form-group">
					<button class="btn btn-mini btn-info" onclick="map3.getView().setZoom(map3.getView().getZoom()+1)"><span class="glyphicon glyphicon-zoom-in"></span></button>
					<button class="btn btn-mini btn-info" onclick="map3.getView().setZoom(map3.getView().getZoom()-1)"><span class="glyphicon glyphicon-zoom-out"></span></button>
				</div>
			</div>
		</div>
		<div style="clear: both;"></div>
		<div id="mapcontainer2-map1"><div id="map2"></div></div>
    		<div id="mapcontainer2-map2"><div id="map3"></div></div>
	</div>

	<!-- modal window with popup message for dual view -->
	<div class="modal fade" id="loading">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
					<h4 class="modal-title">Loading dual view...</h4>
				</div>
				<div class="modal-body">
					<div class="progress">
						<div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%;">
							<span class="sr-only">60% Complete</span>
						</div>
					</div>
				</div>
			</div><!-- /.modal-content -->
		</div><!-- /.modal-dialog -->
	</div><!-- /.modal -->

</div>
