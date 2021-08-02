
// various globals that are useful:

// the map itself
var map;

// slider max/min
var max = 13;
var min = 0;

// objs to hold the ref to html divs
var ex_name = document.getElementById("example-name");
var ex_desc = document.getElementById("example-desc");

// the current example
var currEx;

function parseURL(){
	// check the URL passed for routing information
	const query = window.location.search;
	console.log(query);
	const urlParams = new URLSearchParams(query);
	
	// mode = solo means check for the example #, multi means check for the ordered string (not implemented anymore)
	//var mode = urlParams.get('mode');
	var ex = Number(urlParams.get('ex'));
	var tile = Number(urlParams.get('tile'));
	//console.log(mode,ex);
	if(ex < 1 || ex > 7){
		console.log("Link parameters do not match. Defaulted to example 1.");
	} else {
		console.log("You have chosen to open to example", ex);
	}
	
	createMap(ex,tile);
}

// create the map with the desired view and zoom
// param ex is the number of the example to display
// call this on first load to use specified example(defaults to 1)
function createMap(ex,tile){
	
	// if smart scrolling was selected then this handler is needed
	// I can't disable it when switching so smart scrolling only works if first loaded
	if(ex == 4){
		m = document.querySelectorAll('#map')[0];

		L.DomEvent.on(m, 'wheel', function(e) {
				let x = e.deltaX;
				let y = e.deltaY;

				map.stop();
				if(y > 0 && Number($("#vertical")[0].value > 0)){
					$("#vertical")[0].value = Number($("#vertical")[0].value) - 1;
					map.panBy([x, y]);
				} else if(y < 0 && Number($("#vertical")[0].value) < Number($("#vertical")[0].max)){
					$("#vertical")[0].value = Number($("#vertical")[0].value) + 1;
					map.panBy([x, y]);
				}
			})

		L.Map.ScrollWheelPan = L.Map.ScrollWheelZoom.extend({
			_performZoom: function() {}
		});
	}

	// load the tileset(s)
	var osm_def = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}),
	stamen_wc = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
		attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		subdomains: 'abcd',
		minZoom: 1,
		maxZoom: 16,
		ext: 'jpg'
	}),
	carto_dm = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
		subdomains: 'abcd',
		maxZoom: 19
	})
	esri_sat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
		attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
	});

	var tiles = [];

	if(tile < 1 || tile > 3){
		console.log("Tile not found. Defaulted to OSM_Mapnik");
		tiles = [osm_def];
	}
	else{
		switch(tile){
			case 0:
				tiles = [osm_def];
				console.log("You have chosen to open with the default tileset");
				break;
			case 1:
				tiles = [stamen_wc];
				console.log("You have chosen to open with the watercolor tileset");
				break;
			case 2:
				tiles = [carto_dm];
				console.log("You have chosen to open with the dark mode tileset");
				break;
			case 3:
				tiles = [esri_sat];
				console.log("You have chosen to open with the satellite tileset");
				break;
		}

	}
	
	// set the zoom level and viewpoint after defining the parameters of the map
	bounds = L.latLngBounds(L.latLng(43.2,-89.7),L.latLng(42.95,-89.1));
	map = L.map('map', {
		scrollWheelZoom: false,
		boxZoom: false,
		keyboard: false, 
		doubleClickZoom: false,
		dragging: false,
		 scrollWheelPan: true,
		 touchZoom: false,
		 maxBounds: bounds,
		 maxBoundsViscosity: 1.0,

		 layers: tiles
	}).setView([43.076,-89.40], 13);

	var baseMaps = {
		"OpenStreetMaps Mapnik": osm_def,
		"Stamen Watercolor": stamen_wc,
		"Dark Matter": carto_dm,
		"Esri World Imagery": esri_sat
	};
	L.control.layers(baseMaps).addTo(map);
	
	// create this for Examples 2 and 3 then hide until needed
	var ZoomResetControl = L.Control.extend({
		
		// position in bottom left of map
		options: {
			position: 'bottomleft'
		},

		onAdd: function () {
			// create the control container with a particular class name
			var container = L.DomUtil.create('div', 'zoom-reset-control-container');
			
			// create a button that calls the resetZoom function
			$(container).append('<button onclick="resetZoom(12)">Reset Zoom</button>');
			L.DomEvent.disableClickPropagation(container);
	
			return container;
		}
	});
	
	map.addControl(new ZoomResetControl());

	var HorzSequenceControl = L.Control.extend({
		options: {
			position: 'bottomright'
		},
		
		onAdd: function(){
			// create the div to hold the slider
			var container = L.DomUtil.create('div', 'horz-sequence-control-container');
			
			// create the actual slider
			$(container).append('<input class="range-slider" type="range" id="horizontal">');
			
			// create the step buttons
			$(container).append('<button class="step" id="reverse"><-</button>');
			$(container).append('<button class="step" id="forward">+></button>');
			
			L.DomEvent.disableClickPropagation(container);
			
			return container;
		}
	});

	var VertSequenceControl = L.Control.extend({
		options: {
			position: 'bottomright'
		},
		
		onAdd: function(){
			// create the div to hold the slider
			var container = L.DomUtil.create('div', 'vert-sequence-control-container');
			
			// create the actual slider
			$(container).append('<input class="range-slider" type="range" orient="vertical" id="vertical">');
			
			// create the step buttons
			$(container).append('<button class="step" id="up">/\\</button>');
			$(container).append('<button class="step" id="down">\\/</button>');
			
			L.DomEvent.disableClickPropagation(container);
			
			return container;
		}
	});
	
	// push to map
	map.addControl(new HorzSequenceControl());
	map.addControl(new VertSequenceControl());

	map.on('zoomend', function() {
		if(currEx == 4){changeSliders();}
	});

	var prev = 6;

	// set slider attributes
	$('.range-slider').attr({
		min: min,
		max: max,
		value: prev,
		step: 1
	});

	$('.range-slider').on('input', function(){

		var index = Number($(this).val());

		if(this.id == "vertical"){
			if(index >= prev){
				panByPix(0,Math.abs(index - prev));
			}else{
				panByPix(1,Math.abs(index - prev));
			}
		}else {
			if(index > prev){
				panByPix(3,Math.abs(index - prev));
			}else{
				panByPix(2,Math.abs(index - prev));
			}
		}

		//console.log(this.id, prev, index);
		//console.log(index > prev);

		prev = Number($(this).val());
	});
		
	$('.step').click(function(){
		if(this.id == "forward"){
			if($("#horizontal")[0].value < max){
				$("#horizontal")[0].value = Number($("#horizontal")[0].value) + 1;
				pan(3);
			}
		}else if(this.id == "reverse"){
			if($("#horizontal")[0].value > min){
				$("#horizontal")[0].value = Number($("#horizontal")[0].value) - 1;
				pan(2);
			}
		}else if(this.id == "up"){
			if($("#vertical")[0].value < max){
				$("#vertical")[0].value = Number($("#vertical")[0].value) + 1;
				pan(0);
			}
		}else if(this.id == "down"){
			if($("#vertical")[0].value > min){
				$("#vertical")[0].value = Number($("#vertical")[0].value) - 1;
				pan(1);
			}
		}
	});
	
	map.removeControl(map.zoomControl);
	
	displayExample(ex);
}

// displays example it is passed
// called by HTML buttons and on page load based on params
function displayExample(ex){

	// for dynamic slider length in ex4
	currEx = ex;

	// reset all displays, controls, and built in features
	document.getElementById("minimap").style.display = "none";
	
	document.getElementById("pan-up").style.display = "none";
	document.getElementById("pan-down").style.display = "none";
	document.getElementById("left").style.display = "none";
	document.getElementById("right").style.display = "none";

	document.getElementsByClassName("horz-sequence-control-container")[0].style.display = "none";
	document.getElementsByClassName("vert-sequence-control-container")[0].style.display = "none";
	
	document.getElementsByClassName("zoom-reset-control-container")[0].style.display = "none";
	
	map.removeControl(map.zoomControl);
	
	//map.setView(origin);
	map.off('click');
	
	map.dragging.disable();
	map.boxZoom.disable();
	map.keyboard.disable();
	map.touchZoom.disable()
	map.doubleClickZoom.disable();
	
	// based on the ex passed turn off/on certain features
	switch(ex) {
		
		// Grab&Drag: enable the built in drag pan
		case 1:
			console.log(ex);
			ex_name.innerText = "Grab and Drag";
			ex_desc.innerText = "Click and drag directly on the map to reposition it.";
			
			map.options.minZoom = 13;
			map.options.maxZoom = 13;
			map.setZoom(13);
			
			map.dragging.enable();
			
			break;
		
		// Zoom&Recenter: Grab coordinates on click and change view
		case 2:
			console.log(ex);
			ex_name.innerText = "Zoom and Recenter";
			ex_desc.innerText = "Click on the map to pan and zoom.";

			map.options.minZoom = 12;
			map.options.maxZoom = 15;
			map.setZoom(12);
			
			map.on('click', function(ev) {
				var zoomTo = map.getZoom();
				//console.log(map.getZoom());
				if(map.getZoom() < 15){
					zoomTo += 1;
					map.flyTo(ev.latlng,zoomTo);
				}else{
					map.panTo(ev.latlng);
				}

			});
			
			// display the reset zoom button
			document.getElementsByClassName("zoom-reset-control-container")[0].style.display = "block";
			
			break;
		
		// Zoom Box: use built in boxZoom
		case 3:
			console.log(ex);
			ex_name.innerText = "Zoom Box";
			ex_desc.innerText = "Hold shift and click the map to begin drawing a box, then release to zoom to the area in the box.";
			
			map.options.minZoom = 12;
			map.options.maxZoom = 15;
			map.setZoom(12);
			
			// leaflet has this built in
			map.boxZoom.enable();

			// display the reset zoom button
			document.getElementsByClassName("zoom-reset-control-container")[0].style.display = "block";
			
			break;
		
		/* SmartScrollBars: {WIP} 

				 Override scrollZoom with a pan(if loaded first)
				'scrollbars' implemented along with paired step buttons,
				 but scrolling too fast makes it skip some pans*/
		case 4:
		
			console.log(ex);
			ex_name.innerText = "Smart Scroll Bars";
			ex_desc.innerText = "Use the scroll bars to pan. Note that the scroll bar length changes depending on the zoom.";
			
			map.options.minZoom = 12;
			map.options.maxZoom = 15;
			map.setZoom(13);
			
			map.addControl(map.zoomControl);
			document.getElementsByClassName("vert-sequence-control-container")[0].style.display = "block";
			document.getElementsByClassName("horz-sequence-control-container")[0].style.display = "block";
			
			break;
		
		// NavTabs: Add a button at each direction that causes a panBy in that dir
		case 5:
			console.log(ex);
			ex_name.innerText = "Navigator Tabs";
			ex_desc.innerText = "Click the arrows to pan the map.";
			
			map.options.minZoom = 13;
			map.options.maxZoom = 13;
			map.setZoom(13);
			
			// buttons created at page start so just display them
			document.getElementById("pan-up").style.display = "block";
			document.getElementById("pan-down").style.display = "block";
			document.getElementById("left").style.display = "block";
			document.getElementById("right").style.display = "block";
			
			break;
		
		// Keyboard: enable built in feature
		case 6:
			console.log(ex);
			ex_name.innerText = "Keyboard Controls";
			ex_desc.innerText = "Click inside this box first to give it focus, then use the arrow keys to pan the map.";
			
			map.options.minZoom = 13;
			map.options.maxZoom = 13;
			map.setZoom(13);
			
			// leaflet has this built in
			map.keyboard.enable();
			
			break;
		
		// NavWindow: Add an inset map that allows for view change by dragging a box
		case 7:
			console.log(ex);
			ex_name.innerText = "Navigator Window";
			ex_desc.innerText = "Click and drag the box in the inset map to pan.";
			
			map.options.minZoom = 14;
			map.options.maxZoom = 14;
			map.setZoom(14);
			// show the div the minimap will be in
			document.getElementById("minimap").style.display = "block";
			document.getElementsByClassName("leaflet-control-layers")[0].style.top = "185px";
			
			// create the minimap
			bounds1 = L.latLngBounds(L.latLng(43.2,-89.6),L.latLng(42.95,-89.2));
			minimap = L.map('minimap', {scrollWheelZoom: false,boxZoom: false,keyboard: false, doubleClickZoom: false,dragging: false, scrollWheelPan: true,touchZoom: false,maxBounds: bounds1,maxBoundsViscosity: 1.0}).setView([43.076,-89.40], 13);
			// load the tileset I found
			L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
				subdomains: 'abcd',
				minZoom: 0,
				maxZoom: 18,
				ext: 'png'
			}).addTo(minimap);
	
			minimap.removeControl(minimap.zoomControl);
			
			minimap.setZoom(10);
			
			// make a marker that takes the shape of a rectangle that matches the size of the larger map
			var rectangle = L.icon({
				iconUrl: 'rect.png',
				
				iconSize: [50,30],
				iconAnchor: [25,15]
			});
			var marker = new L.marker(map.getCenter(),{
				draggable: true,
				icon: rectangle
			}).addTo(minimap);
			marker.setOpacity(0.4);
			marker.on("drag", function(e) {
				var marker = e.target;
				var position = marker.getLatLng();
				map.panTo(new L.LatLng(position.lat, position.lng));
			});
			
			break;
			
		default:
			console.log("Example should be a value from 1-7");
			map.dragging.enable();
	}
}

// sets the zoom to the level passed and with the original bounds
function resetZoom(zoom){
	map.setView([43.076,-89.40], zoom)
	corner1 = [];
	corner2 = [];
}

// change the sliders for example four based on new zoom level
function changeSliders(){
	switch(Number(map.getZoom())){
		case 12:
			$("#horizontal")[0].max = 9;
			$("#vertical")[0].max = 9;

			$("#horizontal")[0].value = 4;
			$("#vertical")[0].value = 4;

			$("#horizontal")[0].width = 250;
			$("#vertical")[0].height = 250;
			break;
		case 13:
			$("#horizontal")[0].max = 13;
			$("#vertical")[0].max = 13;

			$("#horizontal")[0].value = 6;
			$("#vertical")[0].value = 6;

			$("#horizontal")[0].width = 300;
			$("#vertical")[0].height = 300;
			break;
		case 14:
			$("#horizontal")[0].max = 15;
			$("#vertical")[0].max = 15;

			$("#horizontal")[0].value = 7;
			$("#vertical")[0].value = 7;

			$("#horizontal")[0].width = 350;
			$("#vertical")[0].height = 350;
			break;
		case 15:
			$("#horizontal")[0].max = 19;
			$("#vertical")[0].max = 19;

			$("#horizontal")[0].value = 9;
			$("#vertical")[0].value = 9;

			$("#horizontal")[0].width = 400;
			$("#vertical")[0].height = 400;
			break;
		default:
			console.log("Zoom level is outside of intended params");
			break;
	}
}

// pan in the given direction a set number of pixels
function pan(dir) {
	// up
	if(dir == 0){
		map.panBy([0,-75]);
	}
	// down
	else if(dir == 1){
		map.panBy([0,75]);
	}
	// left
	else if(dir == 2){
		map.panBy([-75,0]);
	}
	// right
	else if(dir == 3){
		map.panBy([75,0]);
	}
}

// pan in the given direction a given number of pixels
function panByPix(dir,val) {

	val = Number(val);

	console.log("Panning in direction " + dir + " " + val + " times");
	console.log(75*val)

	// up
	if(dir == 0){
		map.panBy([0,-75*val]);
	}
	// down
	else if(dir == 1){
		map.panBy([0,75*val]);
	}
	// left
	else if(dir == 2){
		map.panBy([-75*val,0]);
	}
	// right
	else if(dir == 3){
		map.panBy([75*val,0]);
	}
}

// call the first function once the page loads
$(document).ready(parseURL());