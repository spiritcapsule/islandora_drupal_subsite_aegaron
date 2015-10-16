<div class="row medium-collapse">
<div id="metadata-container" class="panel-3">
</div>
<div id="master-map-container" class="panel-9">	
	<!-- map navigation bar -->
	<div id="map-nav" class="">
		
            <div style="width:100%;">

		<!-- satellite toggle-->
		<div id="satellite-toggle" nowrap style="float:left;vertical-align: middle;padding: 10px;">
			<div class="dropdown">
				<button type="button" data-toggle="dropdown" class="btn btn-default dropdown-toggle"><span id="view-mode-button">view mode: satellite</span>
					<span class="caret"></span>
				</button>
				<ul class="dropdown-menu" role="menu">
					<li id="view-mode-satellite" class="disabled"><a href="#" onclick="aegaron.toggleGeo(true)"> with satellite</a></li>
					<li id="view-mode-nosatellite"><a href="#" onclick="aegaron.toggleGeo(true)"> no satellite</a></li>
				</ul>
			</div>
		</div>

		<!-- layout mode -->
		<div id="layout-mode" style="float:left;vertical-align: middle;padding: 10px;">
			<div class="dropdown">
				<button type="button" data-toggle="dropdown" class="btn btn-default dropdown-toggle"><span id="layout-mode-button">layout mode: single map</span>
					<span class="caret"></span>
				</button>
				<ul class="dropdown-menu" role="menu">
					<li id="layout-mode-single" class="disabled"><a href="#" onclick="aegaron.toggleLayout(0)"> single map</a></li>
					<li id="layout-mode-dual"><a href="#" onclick="aegaron.toggleLayout(1)"> synced dual maps</a></li>
					<li id="layout-mode-dual-unsynced"><a href="#" onclick="aegaron.toggleLayout(2)"> unsynced dual maps</a></li>
				</ul>
			</div>
		</div>

		<!-- sync maps -->
		<div nowrap id="sync-nav" style="float:left;display:none;vertical-align: middle;padding: 10px;">
			<div class="dropdown">
				<button type="button" data-toggle="dropdown" class="btn btn-default dropdown-toggle"><span id="sync-mode-button">sync mode: synced</span>
					<span class="caret"></span>
				</button>
				<ul class="dropdown-menu" role="menu">
					<li id="sync-mode-synced" class="disabled"><a href="#" onclick="aegaron.toggleSyncMaps()"> sync maps</a></li>
					<li id="sync-mode-unsynced"><a href="#" onclick="aegaron.toggleSyncMaps()"> unsync maps</a></li>
				</ul>
			</div>
		</div>

		<!-- rotation -->
		<div id="rotation" nowrap style="float:left;vertical-align: middle;padding: 10px;">
			<!-- <span class="input-group" style="width:200px;"> -->
				<button class="btn btn-sm" onclick="aegaron.setRotation('left')" alt="rotate left"><span class="glyphicon glyphicon-minus"><span class="hide-accessible">rotate left</span></button>
				<input type="button" class="btn btn-default" value="rotate" onclick="aegaron.setRotation(0)">
				<button class="btn btn-sm" onclick="aegaron.setRotation('right')"><span class="glyphicon glyphicon-plus"><span class="hide-accessible">rotate right</span></span></button>
			<!-- </span> -->
		</div>

		<!-- transparency -->
		<div id="transparency" nowrap style="float:left;vertical-align: middle;padding: 10px;">
			<!-- <span class="input-group" style="width:200px;"> -->
				<button class="btn btn-sm" onclick="aegaron.setOpacityFromSliderButtons(.1)"><span class="glyphicon glyphicon-minus"><span class="hide-accessible">less transparent</span></span></button>
				<input type="button" class="btn btn-default" value="transparency" onclick="aegaron.setOpacityFromSliderButtons(0)">
				<button class="btn btn-sm" onclick="aegaron.setOpacityFromSliderButtons(-.1)"><span class="glyphicon glyphicon-plus"><span class="hide-accessible">more transparent</span></span></button>
			<!-- </span> -->
		</div>
            </div> <!-- /.width=100% -->

<!-- todo above this line  -->

		<!-- 
			rotate instructions
		 -->
		<p style="clear: both;">Use <code>Alt</code>+<code>Shift</code>+drag to rotate the map.</p>
                <!-- <br><br> -->
	<!-- </div> -->

        </div> <!-- /#map-nav -->

	<!-- map container for single map view -->
	<div id="mapcontainer1">
		<div class="mapcontainer-nav-left">
			<div class="form-inline">
				<div class="form-group">
					<button class="btn btn-mini btn-info" onclick="aegaron.map1.getView().setZoom(aegaron.map1.getView().getZoom()+1)"><span class="glyphicon glyphicon-zoom-in"><span class="hide-accessible">zoom in</span></span></button>
					<button class="btn btn-mini btn-info" onclick="aegaron.map1.getView().setZoom(aegaron.map1.getView().getZoom()-1)"><span class="glyphicon glyphicon-zoom-out"><span class="hide-accessible">zoom out</span></span></button>
				</div>
				<div class="form-group">
					<select class="form-control changecompare" style="margin-bottom:0px; width: 280px;" id="changecompare1">
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
					<button class="btn btn-mini btn-info" onclick="aegaron.map2.getView().setZoom(aegaron.map2.getView().getZoom()+1)"><span class="glyphicon glyphicon-zoom-in"><span class="hide-accessible">zoom in</span></span></button>
					<button class="btn btn-mini btn-info" onclick="aegaron.map2.getView().setZoom(aegaron.map2.getView().getZoom()-1)"><span class="glyphicon glyphicon-zoom-out"><span class="hide-accessible">zoom out</span></span></button>
				</div>
				<div class="form-group">
					<select class="form-control changecompare" style="margin-bottom:0px; width: 280px;" id="changecompare2">
						<option value=1>-- choose a main plan --</option> 
					</select>
				</div>
			</div>
		</div>
		<div class="mapcontainer-nav-right">
			<div class="form-inline">
				<div class="form-group">
					<select class="form-control changecompare" style="margin-bottom:0px; width:280px;" id="changecompare3">
						<option value=1>-- choose a second plan --</option> 
					</select>
				</div>
				<div class="form-group">
					<button class="btn btn-mini btn-info" onclick="aegaron.map3.getView().setZoom(aegaron.map3.getView().getZoom()+1)"><span class="glyphicon glyphicon-zoom-in"><span class="hide-accessible">zoom in</span></span></button>
					<button class="btn btn-mini btn-info" onclick="aegaron.map3.getView().setZoom(aegaron.map3.getView().getZoom()-1)"><span class="glyphicon glyphicon-zoom-out"><span class="hide-accessible">zoom out</span></span></button>
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
</div>
