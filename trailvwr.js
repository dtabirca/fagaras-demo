/**
 * TrailVwr 
 */

// map definitions
var opts = {
	map: {
		zoom: zoomMap1,
		center: L.latLng(45.6524567,25.5264231),
		fullscreenControl: false,
		resizerControl: false,
		layersControl: false,
		zoomControl: false,
		searchControl: false,
		locateControl:false,
		pegmanControl:false,
		minimapControl:false,
		loadingControl:false,
		attributionControl: false
	},
	map2: {
		zoom: zoomMap2,
		fullscreenControl: false,
		resizerControl: false,
		layersControl: false,
		zoomControl: false,
		searchControl: false,
		locateControl:false,
		pegmanControl:false,
		minimapControl:false,
		loadingControl:false,
		attributionControl:false,
		scaleControl:false,
	},
	map3: {
		zoom: zoomMap3,
		fullscreenControl: false,
		resizerControl: false,
		layersControl: false,
		zoomControl: false,
		searchControl: false,
		locateControl:false,
		pegmanControl:false,
		minimapControl:false,
		loadingControl:false,
		attributionControl:false,
		scaleControl:false,
	},						
	elevationControl: {
		url: gpxFile,
		options: {
			theme: "lightblue-theme",
			collapsed: false,
			detached: true,
			summary: "linear",
			followMarker: true,
			download:false,
			gpxOptions: {
				max_point_interval: 240000,
				async: true,
				marker_options: {
					startIconUrl: null,
					endIconUrl: null,
					shadowUrl: null,
					wptIcons: {
						'': L.divIcon({
							className: 'elevation-waypoint-marker',
							html: '<i class="elevation-waypoint-icon"></i>',
							iconSize: [30, 30],
							iconAnchor: [8, 30],
						})
					},
				},
				polyline_options: {
					className: 'track',
					//color: '#566B13',
					//color: '#d66413',
					color: trackColor,
					opacity: 0.9,
					weight: 3,
					lineCap: 'round'
				},
			},				
		},
	},
	layersControl: {
		options: {
			collapsed: false,
		},
	},
};

// leaflet-elevation overwrite
L.Control.Elevation.prototype.initialize = function(options) {
	
	this.options.autohide = typeof options.autohide !== "undefined" ? options.autohide : !L.Browser.mobile;
	// Aliases.
	if (typeof options.detachedView !== "undefined") this.options.detached = options.detachedView;
	if (typeof options.responsiveView !== "undefined") this.options.responsive = options.responsiveView;
	if (typeof options.showTrackInfo !== "undefined") this.options.summary = options.showTrackInfo;
	if (typeof options.summaryType !== "undefined") this.options.summary = options.summaryType;
	if (typeof options.autohidePositionMarker !== "undefined") this.options.autohideMarker = options.autohidePositionMarker;
	if (typeof options.followPositionMarker !== "undefined") this.options.followMarker = options.followPositionMarker;
	if (typeof options.useLeafletMarker !== "undefined") this.options.marker = options.useLeafletMarker ? 'position-marker' : 'elevation-line';
	if (typeof options.leafletMarkerIcon !== "undefined") this.options.markerIcon = options.leafletMarkerIcon;

	// L.Util.setOptions(this, options);
	this.options = this._deepExtend(this.options, options);

	this._draggingEnabled = !L.Browser.mobile;

	if (options.imperial) {
		this._distanceFactor = this.__mileFactor;
		this._heightFactor = this.__footFactor;
		this._xLabel = "mi";
		this._yLabel = "ft";
	} else {
		this._distanceFactor = this.options.distanceFactor;
		this._heightFactor = this.options.heightFactor;
		this._xLabel = this.options.xLabel;
		this._yLabel = this.options.yLabel;
	}

	this._zFollow = this.options.zFollow;
	if (this.options.followMarker) this._setMapView = L.Util.throttle(this._setMapView, 10000, this);
};
L.Control.Elevation.prototype._appendMouseFocusG = function(g) {
	var focusG = this._focusG = g.append("g")
		.attr("class", "mouse-focus-group");

	this._mousefocus = focusG.append('svg:line')
		.attr('class', 'mouse-focus-line')
		.attr('x2', '0')
		.attr('y2', '0')
		.attr('x1', '0')
		.attr('y1', '0');

	this._focuslabelrect = focusG.append("rect")
		.attr('class', 'mouse-focus-label')
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", 0)
		.attr("height", 0)
		.attr("rx", 3)
		.attr("ry", 3);

	this._focuslabeltext = focusG.append("svg:text")
		.attr("class", "mouse-focus-label-text");
	this._focuslabelIS = this._focuslabeltext.append("svg:tspan")
		.attr("class", "mouse-focus-label-is")
	this._focuslabelIP = this._focuslabeltext.append("svg:tspan")
		.attr("class", "mouse-focus-label-ip")
	this._focuslabelX = this._focuslabeltext.append("svg:tspan")
		.attr("class", "mouse-focus-label-x")
	this._focuslabelY = this._focuslabeltext.append("svg:tspan")
		.attr("class", "mouse-focus-label-y")		
	this._focuslabelT = this._focuslabeltext.append("svg:tspan")
		.attr("class", "mouse-focus-label-t")		
};
var startt;
var startc;
var endc;
var totalgain=0;
var totalloss=0;
var gpx;

L.Control.Elevation.prototype.loadGPX = function(data) {
	var callback = function(data) {
		this.options.gpxOptions.polyline_options.className += 'elevation-polyline ' + this.options.theme;

		this.layer = this.gpx = gpx = new L.GPX(data, this.options.gpxOptions);

		this.layer.on('loaded', function(e) {
			if (this._map) this._map.fitBounds(e.target.getBounds());
		}, this);
		this.layer.on('addpoint', function(e) {
			if (e.point._popup) {
				e.point._popup.options.className = 'elevation-popup';
				e.point._popup._content = decodeURI(e.point._popup._content);
			}
			if (e.point._popup && e.point._popup._content) {
				e.point.bindTooltip(e.point._popup._content, { direction: 'top', sticky: true, opacity: 1, className: 'elevation-tooltip' }).openTooltip();
			}
		});
		this.layer.once("addline", function(e) {
			this.addData(e.line /*, this.layer*/ );

			this.track_info = this.track_info || {};
			this.track_info.type = "gpx";
			this.track_info.name = this.layer.get_name();
			this.track_info.distance = this._distance;
			this.track_info.elevation_max = this._maxElevation;
			this.track_info.elevation_min = this._minElevation;

			var evt = {
				data: data,
				layer: this.layer,
				name: this.track_info.name,
				track_info: this.track_info,
			};

			if (this.fire) this.fire("eledata_loaded", evt, true);
			if (this._map) this._map.fire("eledata_loaded", evt, true);
		}, this);

		if (this._map) {
			this.layer.addTo(this._map);
		} else {
			console.warn("Undefined elevation map object");
		}

	}.bind(this, data);
	
	if (typeof L.GPX !== 'function' && this.options.lazyLoadJS) {
		L.Control.Elevation._gpxLazyLoader = this._lazyLoadJS('https://cdnjs.cloudflare.com/ajax/libs/leaflet-gpx/1.4.0/gpx.js', L.Control.Elevation._gpxLazyLoader);
		L.Control.Elevation._gpxLazyLoader.then(function(){
			
			L.GPX.prototype._parse = function(input, options, async) {
    			var _this = this;
    			var cb = function(gpx, options) {
      				layers = _this._parse_gpx_data(gpx, options);
      				if (!layers) return;
					//console.log(layers._latlngs);    
					var first_coords = layers._latlngs[0];
					var last_coords = layers._latlngs[layers._latlngs.length-1];
					//map.flyTo(L.latLng(first_coords.lat.toFixed( 6 ), first_coords.lng.toFixed( 6 )), zoomMap1Large);
					setTimeout(async function(){
						L.tileLayer.provider(providerMap1).addTo(map);
					}, 5000);
						_this.addLayer(layers);
     					_this.fire('loaded', { layers: layers, element: gpx });
     					setTimeout(async function(){
							map.flyTo(L.latLng(first_coords.lat.toFixed( 6 ), first_coords.lng.toFixed( 6 )), zoomMap1Large);
						}, 2000);
					//}, 1);
    			}
    			if (input.substr(0,1)==='<') { // direct XML has to start with a <
      				var parser = new DOMParser();
      				if (async) {
				        setTimeout(function() {
				          cb(parser.parseFromString(input, "text/xml"), options);
				        });
					} else {
						cb(parser.parseFromString(input, "text/xml"), options);
					}
			    } else {
			      this._load_xml(input, cb, options, async);
			    }
  			};
			callback.call();
		});
	} else {
		callback.call();
	}
};
L.Control.Elevation.prototype._addGPXdata = function(coords) {
	if (coords) {
		startt = coords[0].meta.time;
		startc = coords[0].lat.toFixed( 6 ) + ", " + coords[0].lng.toFixed( 6 );

		//qq=false;
		for (var i = 0; i < coords.length; i++) {
			//console.log(coords[i]);
			if (coords[i-elevAccuracy] != undefined){
				if (i%elevAccuracy==0){
					df = (coords[i].meta.ele > coords[i-elevAccuracy].meta.ele &&
				 	coords[i].lat != coords[i-elevAccuracy].lat &&
				 	coords[i].lng != coords[i-elevAccuracy].lng) ?
			  		(coords[i].meta.ele - coords[i-elevAccuracy].meta.ele) : 0;
					totalgain += df;
				}				
				if (i%elevAccuracy==0){
					df = (coords[i].meta.ele < coords[i-elevAccuracy].meta.ele &&
				 	coords[i].lat != coords[i-elevAccuracy].lat &&
				 	coords[i].lng != coords[i-elevAccuracy].lng) ?
				  		(coords[i-elevAccuracy].meta.ele - coords[i].meta.ele) : 0;
			  		totalloss += df;
			  	}
			}
			this._addPoint(coords[i].lat, coords[i].lng, coords[i].meta.ele, coords[i].meta.time);
		}
		endc = coords[coords.length-1].lat.toFixed( 6 ) + ", " + coords[coords.length-1].lng.toFixed( 6 );
	}
};
L.Control.Elevation.prototype._addPoint = function(x, y, z, t) {
	if (this.options.reverseCoords) {
		var tmp = x;
		x = y;
		y = tmp;
	}

	var data = this._data || [];
	var eleMax = this._maxElevation || -Infinity;
	var eleMin = this._minElevation || +Infinity;
	var dist = this._distance || 0;

	var curr = new L.LatLng(x, y);
	var prev = data.length ? data[data.length - 1].latlng : curr;
	var prevt = data.length ? data[data.length - 1].t : t;

	//start, end, gain, loss, max, min, _points, hr

	var date1 = new Date(prevt);
	var date2 = new Date(t);
	var timediff = date2.getTime() - date1.getTime();

	var delta = curr.distanceTo(prev) * this._distanceFactor;
	delta = Math.round(delta / 1000 * 100000) / 100000;
	dist  = dist + delta;
	//hr, cad?
	
	// skip point if it has not elevation
	if (typeof z !== "undefined") {
		z = z * this._heightFactor;
		eleMax = eleMax < z ? z : eleMax;
		eleMin = eleMin > z ? z : eleMin;
		data.push({
			dist: dist,
			x: x,
			y: y,
			z: z,
			latlng: curr,
			t: t,
			td: timediff,
			d: delta,
		});
	}

	this._data = data;
	this._distance = dist;
	this._maxElevation = eleMax;
	this._minElevation = eleMin;
};
L.Control.Elevation.prototype._updatePositionMarker = function(item) {
	var point = this._map.latLngToLayerPoint(item.latlng);
	var layerpoint = {
		dist: item.dist,
		x: point.x,
		y: point.y,
		z: item.z,
	};

	if (!this._mouseHeightFocus) {
		L.svg({ pane: "elevationPane" }).addTo(this._map); // default leaflet svg renderer
		var layerpane = d3.select(this._map.getContainer()).select(".leaflet-elevation-pane svg");
		this._appendPositionMarker(layerpane);
	}

	this._updatePointG(layerpoint);
};

L.Control.Elevation.prototype._appendPositionMarker = function(pane) {
	var theme = this.options.theme;
	var heightG = pane.select("g");
	this._pointG = heightG.append("g");
	this._pointG
	.append("circle")
	.attr("fill", "#fff")
	.attr(
		"style",
		"stroke: rgb(234, 67, 53); stroke-width: 6;"
	)
	.attr("r", 10)
	.attr("cx", 0)
	.attr("cy", 0);   

	this._mouseHeightFocusLabel = heightG.append("svg:text")
		.attr("class", theme + " height-focus-label")
		.style("pointer-events", "none");
};
L.Control.Elevation.prototype._showDiagramIndicator = function(item, xCoordinate) {
	var opts = this.options;
	this._focusG.style("visibility", "visible");

	this._mousefocus.attr('x1', xCoordinate)
		.attr('y1', 0)
		.attr('x2', xCoordinate)
		.attr('y2', this._height())
		.classed('hidden', false);

	var alt = item.z,
		dist = item.dist,
		ll = item.latlng,
		numY = opts.hoverNumber.formatter(alt, opts.hoverNumber.decimalsY),
		numX = opts.hoverNumber.formatter(dist, opts.hoverNumber.decimalsX);

	this._focuslabeltext
		// .attr("x", xCoordinate)
		.attr("y", this._y(item.z))
		.style("font-weight", "700");

	var sd = new Date(startt);
	var cd = new Date(item.t);
	var time = cd.getTime() - sd.getTime();
	
	this._focuslabelT
		.text("time: " + secondsToHms(time/1000))//
		.attr("x", xCoordinate)
		.attr("y", -40);

	this._focuslabelX
		.text("dist: " + numX + " " + this._xLabel)
		.attr("x", xCoordinate)
		.attr("y", -25);

	this._focuslabelY
		.text("elev: " + numY + " " + this._yLabel)
		.attr("x", xCoordinate)
		.attr("y", -10);

	// // // instant speed
	// var is = (item.d/(item.td/1000/60/60)).toFixed( 2 ) + ' km/h';
	// // // instant pace
	// var ip = ((item.td/1000/60)/item.d).toFixed( 2 ) + ' min/km';
	// this._focuslabelIS
	// 	.text("speed: " + is)
	// 	.attr("x", xCoordinate)
	// 	.attr("y", -55);

	// this._focuslabelIP
	// 	.text("pace: " + ip)
	// 	.attr("x", xCoordinate)
	// 	.attr("y", -40);

	var focuslabeltext = this._focuslabeltext.node();
	if (this._isDomVisible(focuslabeltext)) {
		var bbox = focuslabeltext.getBBox();
		var padding = 2;

		this._focuslabelrect
			.attr("x", bbox.x - padding)
			.attr("y", bbox.y - padding)
			.attr("width", bbox.width + (padding * 2))
			.attr("height", bbox.height + (padding * 2));
	}
};
// elevation panel functions
var firstitem = false;
L.Control.Elevation.include({
	// Update map and chart "markers" from latlng
	setPositionFromLatLng: function(latlng) {
		if (!this._data || this._data.length === 0) {
			return;
		}
		// var latlng = e.latlng;
		var item = this._findItemForLatLng(latlng);
		if (item) {
			var xCoord = item.xDiagCoord;

			this._hidePositionMarker();
			if (showDiagram){
				this._showDiagramIndicator(item, xCoord);
			}
			this._showPositionMarker(item);
			if (!firstitem){
				//map.flyTo(L.latLng(item.x.toFixed( 6 ), item.y.toFixed( 6 )), 15);
				setTimeout(function(){
					map.setZoom(zoomMap1Large);
				}, 500);
				firstitem = true;
			}
		}
	},

	addRunner: function(runner) {
		let g = d3.select(controlElevation._container).select("svg > g");
		const runnerObj = g.append("g").attr("class", "runner");
		let x = this._x(runner.dist);
		runnerObj
				.append("image")
		.attr("xlink:href", 'hike.png')
		.attr("fill", 'red')
		.attr("width", 50)
		.attr("height", 50)
		.attr("x", x-50)
		.attr("y", this._y(this._data[this._findItemForX(x)].z)-50);

		return runnerObj;
	},
	addCheckpoint: function(checkpoint) {
		let g = d3.select(controlElevation._container).select("svg > g");
		let check = g.append("g").attr("class", "checkpoints");
		let x = this._x(checkpoint.dist);
		let y = this._y(this._data[this._findItemForX(x)].z);
		if (showCheckpointLines){
			check
				.append("svg:line")
				.attr("x2", x)
				.attr("y2", y)
				.attr("x1", x)
				.attr("y1", this._height())
				.attr(
					"style",
					"stroke: rgb(51, 51, 51); stroke-width: 1; stroke-dasharray: 2, 2;"
				);
		}
		check
			.append("svg:circle")
			.attr("class", " height-focus circle-lower")
			.attr("r", 2)
			.attr("cx", x)
			.attr("cy", y);

		return checkpoint;
	},
	updateRunnerPos: function(runner, pos) {

		pos = parseFloat(pos.toFixed( 2 ));
//console.log(pos);		
		let x = parseFloat(this._x(pos).toFixed(0));
//console.log(x);		
		let iter = this._findItemForX(x);
//console.log(iter);				
		let curr = this._data[iter];
		// 
		if (curr != undefined){
			
			var ip = ((curr.td/1000/60)/curr.d).toFixed( 2 );
			runner
				.select("image")
				.attr("x", x-50)
				.attr("y", this._y(curr.z)-50);
			if (ip > 10){
				runner.select("image").attr("xlink:href", 'hike.png');
			} else{
				runner.select("image").attr("xlink:href", 'run.png')
			}
			this.setPositionFromLatLng(curr.latlng);
			map.panTo(curr.latlng);
			map2.panTo(curr.latlng);
			map3.panTo(curr.latlng);
		}
	},
});

// start
var map = new L.Map('map', opts.map);
L.control.attribution({position: 'bottomleft'}).addTo(map);
var map2 = new L.Map('map2', opts.map2);
var map3 = new L.Map('map3', opts.map3);
L.tileLayer.provider(providerMap2).addTo(map2);
L.tileLayer.provider(providerMap3).addTo(map3);

var controlElevation = L.control.elevation(opts.elevationControl.options);
controlElevation.addTo(map);
controlElevation.load(opts.elevationControl.url);

var displayed = -1;
async function animated(runner, i) {
	var photo;
	let x = controlElevation._x(i);
	let iter = controlElevation._findItemForX(x);
	if (i < controlElevation._distance) {
		for (var j=0; j<media.length;j++){
			if (parseFloat(i.toFixed( 2 )) >= parseFloat(media[j].dist.toFixed( 2 )) && displayed < j){
				displayed = j;
				if (showLity && media[j].style==undefined){// photo
					document.getElementsByClassName('elevation-div')[0].style.opacity = '0.5';
					photo = lity('<img src="trails/'+media[j].file+'">'
						+((media[j].text != '')?'<div class="lity-caption">'+media[j].text+'</div>':'')
						+((media[j].compass != undefined)?'<div class="lity-compass compass-'+media[j].compass+'"></div>':'')
						, {'esc':false});

					await new Promise(r => setTimeout(r, media[j].time));
					document.getElementsByClassName('elevation-div')[0].style.opacity = '1';
					photo.close();
				}
						
				if (media[j].style!=undefined){
					var icon;
					var marker;
					var color;
					switch (media[j].style){
						case 'shelter':
							icon = 'night_shelter';
							color = 'shelter';
							break;
						case 'start':
							icon = 'outlined_flag';
							color = 'start';
							break;
						case 'cabin':
							icon = 'home';
							color = 'cabin';
							break;
						case 'spring':
							icon = 'waves';
							color = 'water';
							break;
						case 'peak':
							icon = 'terrain';
							color = 'peak';
							break;
						case 'end':
							icon = 'flag';
							color = 'end';
							break;
						default:
							icon = 'room';
							color = 'default';
							break;
					}
					var wvrIcon = L.divIcon({
  				    	className: 'custom-div-icon',
        				html: "<div class='marker-pin'></div><i class='material-icons "+color+"'>"+icon+"</i><div class='marker-label'>"+media[j].text+"</div>",
					//var wvrIcon = L.icon({
						//iconUrl: icon,	
							//shadowUrl: 'leaf-shadow.png',
						iconSize:     [100, 42], // size of the icon
		    			//shadowSize:   [50, 64], // size of the shadow
		    			iconAnchor:   [50, 42], // point of the icon which will correspond to marker's location
						//shadowAnchor: [4, 62],  // the same for the shadow
					});		
	
					marker = L.marker([controlElevation._data[iter].x, controlElevation._data[iter].y], {icon: wvrIcon}).addTo(map);
					if (controlElevation._data[iter-10] != undefined && controlElevation._data[iter+10] != undefined){
						var tmpDate = controlElevation._data[iter-10].t;
						tmpDate.setSeconds(0); 
						var tmpt = tmpDate.getTime();
						var startDate = new Date(startt);
						startDate.setSeconds(0);
						var st = startDate.getTime();
						var nt = controlElevation._data[iter+10].t.getTime();
						var time = 0;
						//if more than 1h between readings, you must have been asleep
						//to be sure it is a valid stop, check more distant readings 
						//simulate	gone hours, 1s for each	
						if (tmpt + 60*60*1000 < nt){
							while (tmpt + 60*60*1000 < nt){

								tmpt = tmpt + 60*1000;
								tmpDate.setTime(tmpt);
								time = tmpt - st;

								document.getElementsByClassName("mouse-focus-label-t")[0].innerHTML = "time: " + secondsToHms(time/1000);
								await new Promise(r => 		
									setTimeout(r, 1)
								);					
							}
						} else{
							await new Promise(r => 
								setTimeout(r, media[j].time)
							);
						}
					} else{
						await new Promise(r => 
							setTimeout(r, media[j].time)
						);
					}
				}
			}
		}
		if (i > whereToSpeedUp) speed = speedUpSpeed;
		i = i + (0.001 * speed);
		setTimeout(function() {
			controlElevation.updateRunnerPos(runner, i);
			animated(runner, i)
		}, 1000/speed);
	}
	//console.log(iter+'|'+controlElevation._data.length);
	if(iter == controlElevation._data.length){
		//document.getElementById('playme').style.display = 'block';	
		gpx.fire('loaded');
		document.getElementsByClassName('elevation-div')[0].style.opacity = '0.5';
		setTimeout(function(){
			document.getElementById('stats').style.visibility = 'visible';
			document.getElementById('remarks-content').innerHTML = remarks;
		}, 5000);
		
	}	
}
let runner;
map.on('eledata_loaded', function(e) {
	setTimeout(function(){
		setTimeout(function(){
			document.getElementById('map2').style.visibility = 'visible';
		}, 10);
		setTimeout(function(){
			document.getElementById('map3').style.visibility = 'visible';
		}, 40);
		setTimeout(function(){
			document.getElementsByClassName('elevation-div')[0].style.visibility = 'visible';
		}, 80);
		setTimeout(function(){
			animated(runner, 0);
		}, 3000);
		//document.getElementById('stats').style.display = 'block';
		//document.getElementById('playme').style.display = 'block';
	}, 7500);

	for (var j=0; j<media.length;j++){
		controlElevation.addCheckpoint({
			dist: media[j].dist
		});
	}
	
	document.getElementById('start-data').innerHTML = startc;
	document.getElementById('end-data').innerHTML = endc;	
	document.getElementById('dist-data').innerHTML = e.track_info.distance.toFixed( 2 );
	//document.getElementById('max-data').innerHTML = e.track_info.elevation_max.toFixed( 2 );
	//document.getElementById('min-data').innerHTML = e.track_info.elevation_min.toFixed( 2 );
	document.getElementById('time-data').innerHTML = secondsToHms(e.layer._info.duration.total/1000);
	//
	document.getElementById('mov').innerHTML = secondsToHms(e.layer._info.duration.moving/1000);
	var is = (e.track_info.distance/(e.layer._info.duration.moving/1000/60/60)).toFixed( 2 );
	//var ip = ((e.layer._info.duration.total/1000/60)/e.track_info.distance).toFixed( 2 );
	document.getElementById('speed-data').innerHTML = is;
	//document.getElementById('pace').innerHTML = ip;
	document.getElementById('asc-data').innerHTML = totalgain.toFixed( 2 );
	//e.layer._info.elevation.gain.toFixed( 2 );
	document.getElementById('desc-data').innerHTML = totalloss.toFixed( 2 );
	//e.layer._info.elevation.loss.toFixed( 2 );
	//var slope = (e.layer._info.elevation.gain/e.track_info.distance/1000*100).toFixed( 2 );
	//document.getElementById('slo').innerHTML = slope + ' % '
	// + '( ' + (Math.atan(slope/100) * 180 / Math.PI).toFixed( 2 ) + '&#176;)';
	//document.getElementById('cal').innerHTML = (e.layer._info.duration.moving/1000/60/60*500).toFixed( 2 );

	runner = controlElevation.addRunner({
		dist: 0
	});
});
// util
function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    //var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? (h < 10 ? "0" + h : h) + "h" : "00h";
    var mDisplay = m > 0 ? (m < 10 ? "0" + m : m) + "m" : "00m";
    //var sDisplay = s > 0 ? (s < 10 ? "0" + s : s) : "00";

    return hDisplay + ' ' + mDisplay;// + sDisplay; 
}
/* 
 * Workaround for 1px lines appearing in some browsers due to fractional transforms
 * and resulting anti-aliasing.
 * https://github.com/Leaflet/Leaflet/issues/3575
 */
(function(){
    var originalInitTile = L.GridLayer.prototype._initTile
    L.GridLayer.include({
        _initTile: function (tile) {
            originalInitTile.call(this, tile);
            var tileSize = this.getTileSize();
            tile.style.width = tileSize.x + 1 + 'px';
            tile.style.height = tileSize.y + 1 + 'px';
        }
    });
})()

function preloadImages(){
	for (var j=0; j<media.length;j++){
		if (showLity && media[j].file!=undefined){
		    var img=new Image();
			img.src='trails/'+media[j].file;
		}
	}
}
$(document).ready(function() { preloadImages() });
