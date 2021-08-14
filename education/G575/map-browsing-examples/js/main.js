/* Written by Vincent Cunningham 2020
	G575 Examples with current Leaflet
*/

// various globals that are useful:

// the map itself
var map;

// slider max/min
var maxHorz = 60;
var maxVert = 60;
var min = 0;

// slider marker
var marker

// bool for widget hide/show on ex = 7
var needToShowWidget = false;

// vars for widget
var shown = false;
var panAmount = 75;
var zoomLevel = 13;

// objs to hold the ref to html divs
var ex_name = document.getElementById("example-name");
var ex_desc = document.getElementById("example-desc");

// the current example
var currEx;

// check the url for specific example/tileset to use on load
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
		ex = 1;
	} else {
		console.log("You have chosen to open to example", ex);
	}
	
	// start creating the map with any given info/the defaults
	createMap(ex,tile);
}

// create the map with the desired view and zoom
// param ex is the number of the example to display
// call this on first load to use specified example(defaults to 1)
function createMap(ex,tile){
	
	// if smart scrolling was selected then this handler is needed
	// I couldn't disable it when switching so smart scrolling only works if loaded specifically, and breaks other examples

	m = document.querySelectorAll('#map')[0];

	if(ex == 4){
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

	//L.Map.addInitHook('addHandler', 'scrollWheelPan', L.Map.ScrollWheelPan);

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
	esri_gray = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
		attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
		maxZoom: 16
	});

	var tiles = [];

	// if a tile was specified load it. if not choose the default
	if(tile < 1 || tile > 4){
		console.log("Tile not found. Defaulted to OSM_Mapnik");
		tiles = [esri_gray];
	}
	else{
		switch(tile){
			case 0:
				tiles = [esri_gray];
				console.log("You have chosen to open with the default tileset");
				break;
			case 1:
				tiles = [osm_def];
				console.log("You have chosen to open with the OSM tileset");
				break;
			case 2:
				tiles = [stamen_wc];
				console.log("You have chosen to open with the watercolor tileset");
				break;
			case 3:
				tiles = [carto_dm];
				console.log("You have chosen to open with the dark mode tileset");
				break;
			case 4:
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

	/*/ for determining exact pixel/latlng positions
	map.on('mousemove', function(e) {
		console.log(e.latlng);
		console.log(e.layerPoint);
	});
	/*/

	// adding all basemaps for user to switch
	var baseMaps = {
		"Esri Gray Earth Canvas": esri_gray,
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

	// create a widget for adjusting pan/zoom amounts
	var WidgetControl = L.Control.extend({
		
		// position in top right of map
		options: {
			position: 'topright'
		},

		onAdd: function () {
			// create the control container with a particular class name
			var container = L.DomUtil.create('div', 'widget-control-container');
			
			// create a button that calls the resetZoom function
			$(container).append('<button onclick="showWidget()" title="Zoom/Pan Widget" id="viz-button"></button>');
			$(container).append('<div id="widget-sidebar"><button onclick="dropPan()" style="margin-right: 5px">-</button><span id=panAmount-text>Pan Amount: 0</span><button onclick="addPan()" style="margin-left: 5px">+</button><br><br><button onclick="dropZoom()" style="margin-right: 5px">-</button><span id=zoomLevel-text>Zoom Level: 0</span><button onclick="addZoom()" style="margin-left: 5px">+</button></div>');
			L.DomEvent.disableClickPropagation(container);
	
			return container;
		}
	});

	map.addControl(new WidgetControl());

	// create a widget for adjusting pan/zoom amounts
	var WidgetControlHidden = L.Control.extend({
		
		// position in top right of map
		options: {
			position: 'topright'
		},

		onAdd: function () {
			// create the control container with a particular class name
			var container = L.DomUtil.create('div', 'widget-control-container-hidden');
			
			// create a button that calls the resetZoom function
			$(container).append('<button onclick="showWidget()" title="Zoom/Pan Widget" id="viz-button-hidden"></button>');
			L.DomEvent.disableClickPropagation(container);
	
			return container;
		}
	});
	
	map.addControl(new WidgetControlHidden());

	// horizontal slider for example 4
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
			$(container).append('<button class="step" id="reverse"></button>');
			$(container).append('<button class="step" id="forward"></button>');
			
			L.DomEvent.disableClickPropagation(container);
			
			return container;
		}
	});

	// vertical slider for example 4
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
			$(container).append('<button class="step" id="up"></button>');
			$(container).append('<button class="step" id="down"></button>');
			
			L.DomEvent.disableClickPropagation(container);
			
			return container;
		}
	});
	
	// push to map
	map.addControl(new HorzSequenceControl());
	map.addControl(new VertSequenceControl());

	var prev = Math.ceil(maxHorz/2);

	// set slider attributes
	$('.range-slider').attr({
		min: min,
		max: maxHorz,
		value: prev,
		step: 1
	});

	// attempt to pan the correct number of steps when the slider is dragged
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
		
	// sync the slider and pan in the right direction when one of the buttons is clicked
	$('.step').click(function(){
		if(this.id == "forward"){
			if($("#horizontal")[0].value < maxHorz){
				$("#horizontal")[0].value = Number($("#horizontal")[0].value) + 1;
				pan(3);
			}
		}else if(this.id == "reverse"){
			if($("#horizontal")[0].value > min){
				$("#horizontal")[0].value = Number($("#horizontal")[0].value) - 1;
				pan(2);
			}
		}else if(this.id == "up"){
			if($("#vertical")[0].value < maxVert){
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
	
	// remove the default zoom control until needed
	map.removeControl(map.zoomControl);
	
	displayExample(ex);
}

// displays example it is passed
// called by HTML buttons and on page load based on params
function displayExample(ex){

	// for dynamic slider length in ex4
	currEx = ex;

	$(".active").toggleClass();

	$("#"+ex).toggleClass("active");

	// if previous example was #7 then the widget needs to be available again
	if(needToShowWidget){
		$("#viz-button-hidden").fadeIn(200);
		needToShowWidget = false;
	}

	// reset map zoom possibilities
	map.options.minZoom = 12;
	map.options.maxZoom = 15;

	// reset all displays, controls, and built in features
	document.getElementById("minimap").style.display = "none";
	
	document.getElementById("pan-up").style.display = "none";
	document.getElementById("pan-down").style.display = "none";
	document.getElementById("left").style.display = "none";
	document.getElementById("right").style.display = "none";

	document.getElementsByClassName("horz-sequence-control-container")[0].style.display = "none";
	document.getElementsByClassName("vert-sequence-control-container")[0].style.display = "none";
	
	//document.getElementsByClassName("zoom-reset-control-container")[0].style.display = "none";
	document.getElementsByClassName("zoom-reset-control-container")[0].style.display = "block";
	
	map.removeControl(map.zoomControl);

	updateWidget();

	if(true){
		resetZoom(13);
	}

	map.off('click');
	map.dragging.disable();
	map.boxZoom.disable();
	map.keyboard.disable();
	map.touchZoom.disable();
	map.doubleClickZoom.disable();
	map.scrollWheelZoom.disable();
	
	// based on the ex passed turn off/on certain features
	switch(ex) {
		
		// Grab&Drag: enable the built in drag pan
		case 1:
			console.log(ex);
			ex_name.innerText = "Grab and Drag";
			ex_desc.innerText = "Click and drag directly on the map to reposition it. Scroll to zoom in and out.";
			
			map.dragging.enable();
			map.scrollWheelZoom.enable();
			map.touchZoom.enable();
			
			break;
		
		// Zoom&Recenter: Grab coordinates on click and change view
		case 2:
			console.log(ex);
			ex_name.innerText = "Zoom and Recenter";
			ex_desc.innerText = "Click on the map to pan and zoom.";
			
			map.on('click', function(ev) {
				//console.log(map.getZoom());
				if(zoomLevel < 15){
					zoomLevel += 1;
					map.flyTo(ev.latlng,zoomLevel);
					updateWidget();
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
			
			// leaflet has this built in
			map.boxZoom.enable();

			// display the reset zoom button
			document.getElementsByClassName("zoom-reset-control-container")[0].style.display = "block";
			
			break;
		
		/* SmartScrollBars: {WIP}

			There are still a few oddities with this example, namely multi-panning on bar drag and the visual presentation,
			but overall I was able to get it to work

			also they will ideally scale on zoomend but still figuring that out
		
		*/
		case 4:
		
			console.log(ex);
			ex_name.innerText = "Smart Scroll Bars";
			ex_desc.innerText = "Use the scroll bars to pan. Note that the scroll bar length changes depending on the zoom.";
			
			//map.addControl(map.zoomControl);
			document.getElementsByClassName("vert-sequence-control-container")[0].style.display = "block";
			document.getElementsByClassName("horz-sequence-control-container")[0].style.display = "block";
			
			break;
		
		// NavTabs: Add a button at each direction that causes a panBy in that dir
		case 5:
			console.log(ex);
			ex_name.innerText = "Navigator Tabs";
			ex_desc.innerText = "Click the arrows to pan the map.";
			
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

			// leaflet has this built in
			map.keyboard.enable();
			
			break;
		
		// NavWindow: Add an inset map that allows for view change by dragging a box
		case 7:
			console.log(ex);
			ex_name.innerText = "Navigator Window";
			ex_desc.innerText = "Click and drag the box in the inset map to pan.";

			// hide the zoom/pan widget based on current state
			if(shown == false){
				$("#viz-button-hidden").fadeOut(200);
			}
			else if(shown == true) {
				shown = false;
				$(".widget-control-container").fadeOut(200);
			}
			needToShowWidget = true;

			// show the div the minimap will be in
			document.getElementById("minimap").style.display = "block";
			
			// create the minimap
			bounds1 = L.latLngBounds(L.latLng(43.2,-89.6),L.latLng(42.95,-89.2));
			minimap = L.map('minimap', {attributionControl: false,scrollWheelZoom: false,boxZoom: false,keyboard: false, doubleClickZoom: false,dragging: false, scrollWheelPan: true,touchZoom: false,maxBounds: bounds1,maxBoundsViscosity: 1.0}).setView([43.076,-89.40], 13);
			// load the tileset I found
			L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
				minZoom: 0,
				maxZoom: 16,
				ext: 'png',
			}).addTo(minimap);
	
			minimap.removeControl(minimap.zoomControl);
			
			minimap.setZoom(9);
			
			// make a marker that takes the shape of a rectangle that matches the size of the larger map
			var rectangle = L.icon({
				iconUrl: 'img/rect.png',
				
				iconSize: [53,35],
				iconAnchor: [18,15]
			});
			marker = null;
			marker = new L.marker(map.getCenter(),{
				draggable: true,
				icon: rectangle
			}).addTo(minimap);
			marker.setOpacity(0.4);
			marker.on("drag", function(e) {
				var marker = e.target;
				var position = marker.getLatLng();
				map.panTo(new L.LatLng(position.lat, position.lng));
			});

			marker.setLatLng([43.076,-89.40]);
			
			break;
			
		default:
			console.log("Example should be a value from 1-7");
			map.dragging.enable();
	}

	updateWidget();
}

// sets the zoom to the level passed and with the original bounds
function resetZoom(zoom){
	map.setView([43.076,-89.40], zoom);
	zoomLevel = zoom;
	updateWidget();
}

// show/hide the widget for adjusting zoom/pan
function showWidget(){
	widget = $(".widget-control-container");
	sidebar = $("#widget-sidebar");
	
	panText = $("#panAmount-text");
	zoomText = $('#zoomLevel-text');

	panText.text("Pan Amount: " + panAmount);
	zoomText.text("Zoom Level: " + zoomLevel);

	console.log(sidebar);

	if(shown == false){
		shown = true;
		widget.fadeIn(200);
		document.getElementById("viz-button-hidden").style.display = "none";
	}
	else if(shown == true) {
		shown = false;
		widget.fadeOut(200);
		widget.promise().done(function(){
			document.getElementById("viz-button-hidden").style.display = "block";
		});
	}
}

// called whenever a widget value is updated
function updateWidget(){
	panText = $("#panAmount-text");
	zoomText = $('#zoomLevel-text');

	panText.text("Pan Amount: " + panAmount);
	zoomText.text("Zoom Level: " + zoomLevel);
}

// set of helper functions for sidepanel increments
function addPan(){
	if(panAmount < 250){
		panAmount += 25;
		panText = $("#panAmount-text").text("Pan Amount: " + panAmount);
	}
	if(currEx == 4){
		changeSliders(false);
	}
}
function dropPan(){
	if(panAmount > 25){
		panAmount -= 25;
		panText = $("#panAmount-text").text("Pan Amount: " + panAmount);
	}
	if(currEx == 4){
		changeSliders(false);
	}
}
function addZoom(){
	if(zoomLevel < 15){
		zoomLevel += 1;
		zoomText = $('#zoomLevel-text').text("Zoom Level: " + zoomLevel);
	}
	if(currEx == 4){
		changeSliders(true);
	}else{
		map.setZoom(zoomLevel);
	}
}
function dropZoom(){
	if(zoomLevel > 12){
		zoomLevel -= 1;
		zoomText = $('#zoomLevel-text').text("Zoom Level: " + zoomLevel);
	}
	if(currEx == 4){
		changeSliders(true);
	}else{
		map.setZoom(zoomLevel);
	}
}

/* change the sliders for example four based on new zoom level(and pan amount)

	basically I just manually found the # of pans for each zoom level(horz/vert) at the lowest pan amount(25) for the full bounds:

		[ZL-12, ZL-13, ZL-14, ZL-15]

		since it increments in 25pxs and the max is 10x the lowest I just check what the zoom and pan are and then based on that
		find the ideal number of pans for the current situation and set the slider accordingly

	the slider also changes to a set length for each zoom level to emulate the desired 'scroll bar length changes depending on the zoom',
	and at the end of the method you reset the view to make the current slider value easier(if the zoom was changed)
*/
var horzList = [33,86,220,540];
var vertList = [20,60,140,300];

function changeSliders(trueIfZoom){
	var horz;
	var vert;

	switch(Number(zoomLevel)){
		case 12:
			horz = calcHorz(12);
			vert = calcVert(12);

			$("#horizontal")[0].max = horz;
			$("#vertical")[0].max = vert;

			$("#horizontal")[0].value = Math.ceil(horz/2);
			$("#vertical")[0].value = Math.ceil(vert/2);

			$("#horizontal").css('width', '150px');
			$("#vertical").css('width', '150px');

			$("#vertical").css('right', '-13px');
			$("#vertical").css('bottom', '164px');

			$("#up").css('top', '-171px');

			break;
		case 13:
			horz = calcHorz(13);
			vert = calcVert(13);

			$("#horizontal")[0].max = horz;
			$("#vertical")[0].max = 18;

			$("#horizontal")[0].value = Math.ceil(horz/2);
			$("#vertical")[0].value = Math.ceil(18/2);
			
			$("#horizontal").css('width', '225px');
			$("#vertical").css('width', '225px');

			$("#vertical").css('right', '-50px');
			$("#vertical").css('bottom', '202px');

			$("#up").css('top', '-246px');

			break;
		case 14:
			horz = calcHorz(14);
			vert = calcVert(14);	

			$("#horizontal")[0].max = horz;
			$("#vertical")[0].max = vert;

			$("#horizontal")[0].value = Math.ceil(horz/2);
			$("#vertical")[0].value = Math.ceil(vert/2);
			
			$("#horizontal").css('width', '300px');
			$("#vertical").css('width', '300px');

			$("#vertical").css('right', '-87px');
			$("#vertical").css('bottom', '239px');

			$("#up").css('top', '-322px');

			break;
		case 15:
			horz = calcHorz(15);
			vert = calcVert(15);

			$("#horizontal")[0].max = horz;
			$("#vertical")[0].max = vert;

			$("#horizontal")[0].value = Math.ceil(horz/2);
			$("#vertical")[0].value = Math.ceil(vert/2);

			$("#horizontal").css('width', '350px');
			$("#vertical").css('width', '350px');

			$("#vertical").css('right', '-112px');
			$("#vertical").css('bottom', '265px');

			$("#up").css('top', '-372px');

			break;
		default:
			console.log("Zoom level is outside of intended params");
			break;
	}
	maxHorz = horz;
	maxVert = vert;

	//console.log(horz);
	//console.log(vert);

	//console.log(trueIfZoom);

	if(trueIfZoom){	resetZoom(zoomLevel); }
}

// helper func to determine the ideal pans for horz slider
function calcHorz(zl){
	//console.log(horzList[zl-12]);

	var pVal = panAmount/25;
	return Math.ceil(horzList[zl-12]/pVal);
}

// helper func to determine the ideal pans for vert slider
function calcVert(zl){
	//console.log(vertList[zl-12]);

	var pVal = panAmount/25;
	return Math.ceil(vertList[zl-12]/pVal);
}

// pan in the given direction a set number of pixels
function pan(dir) {
	// up
	if(dir == 0){
		map.panBy([0,-panAmount]);
	}
	// down
	else if(dir == 1){
		map.panBy([0,panAmount]);
	}
	// left
	else if(dir == 2){
		map.panBy([-panAmount,0]);
	}
	// right
	else if(dir == 3){
		map.panBy([panAmount,0]);
	}
}

// pan in the given direction a given number of pixels
function panByPix(dir,val) {

	val = Number(val);

	console.log("Panning in direction " + dir + " " + val + " times");
	console.log(panAmount*val)

	// up
	if(dir == 0){
		map.panBy([0,-panAmount*val]);
	}
	// down
	else if(dir == 1){
		map.panBy([0,panAmount*val]);
	}
	// left
	else if(dir == 2){
		map.panBy([-panAmount*val,0]);
	}
	// right
	else if(dir == 3){
		map.panBy([panAmount*val,0]);
	}
}

// call the first function once the page loads
$(document).ready(parseURL());