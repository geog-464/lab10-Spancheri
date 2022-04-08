/// Script done by Sara Pancheri, April 1-8 2022

////////////
// Set up //
////////////

// Declare the map variables here to give it a global scope

let myMap;
let mapChoice;

// Default basemap
const CartoDB_Positron= L.tileLayer(
	'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', 
	{
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
	}
)

//Add in chosen tile layer 
var CartoDB_Neg= L.tileLayer(
	'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', 
	{
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
	}
)

function initialize(){
    loadMap();
};

////////////////
// End set up //
////////////////


////////////////
// Map script //
////////////////

//Define popups that will appear when pressing on points
function addPopups(feature, layer) {

	if(mapChoice == 'choiceA'){
		layer.bindPopup(feature.properties.StationNam + ", Address: " + feature.properties.Address1);
	}
	if(mapChoice == 'choiceB'){
		layer.bindPopup(feature.properties.city + ",Population:"+ feature.properties.pop_2018);
	}
}

// Load map function with both data sets 
function loadMap(mapid){
	try {

		myMap.remove()

	} catch(e) {

		console.log(e)
		console.log("no map to delete")

	} finally {

		// Choice of 2 map data sets

		if(mapid == 'mapa') {

			mapChoice = "choiceA";
			

			myMap = L.map('mapdiv', {
				center: [39, -95]
				,zoom: 4
				,maxZoom: 18
				,minZoom: 2
				,layers: CartoDB_Neg
			});

			let baseLayers = {
				"CartoDB Positron": CartoDB_Positron,
				"CartoDB Negative": CartoDB_Neg
			};

			
			let lcontrol = L.control.layers(baseLayers);
			lcontrol.addTo(myMap);
			fetchData();

		} else if(mapid == 'mapb') {

			mapChoice = "choiceB"
			
			myMap = L.map('mapdiv', {
				center: [20, 10]
				,zoom: 3
				,maxZoom: 18
				,minZoom: 2
				,layers: CartoDB_Neg
			});

			let baseLayers = {
				"CartoDB Positron": CartoDB_Positron,
				"CartoDB Negative": CartoDB_Neg
			};

		
			let lcontrol = L.control.layers(baseLayers);
			lcontrol.addTo(myMap);
			fetchData();

			}
		}
		console.log(mapChoice)
		console.log(mapid)
};

//Fetch both data sets: Amtrak Stations (mapa) and Mega Cities (mapb)
function fetchData(){

	console.log(mapChoice)

  //load the data
	if (mapChoice == 'choiceA'){
		fetch('https://raw.githubusercontent.com/geog-464/lab10/main/data/Amtrak_Stations.geojson')
			.then(function(response){
				return response.json();
			})
			.then(function(json){
				//create a Leaflet GeoJSON layer and add it to the map

				console.log()

				L.geoJson(json, {style: styleAll, pointToLayer: generateCircles, onEachFeature: addPopups}).addTo(myMap);

			})
	};
	
	if (mapChoice == 'choiceB'){
		fetch('https://raw.githubusercontent.com/geog-464/lab10/main/data/megacities.geojson')
			.then(function(response){
				return response.json();
			})
			.then(function(json){
				//create a Leaflet GeoJSON layer and add it to the map
				L.geoJson(json, {style: styleAll, pointToLayer: generateCircles, onEachFeature: addPopups}).addTo(myMap);
			})
	}
}

// Style layers: change how points spawn on Leaflet
function generateCircles(feature, latlng) {
	return L.circleMarker(latlng);
};

//Styling
function styleAll(feature, latlng) {
	console.log(feature.properties.ZipCode)

	var styles = {dashArray:null, dashOffset:null, lineJoin:null, lineCap:null, stroke:false, color:'#000', opacity:1, weight:1, fillColor:null, fillOpacity:0 };

	if (feature.geometry.type == "Point") {
		styles.fillColor = '#fff'
		,styles.fillOpacity = 0.5
		,styles.stroke=true
		,styles.radius=9
	}

	if (typeof feature.properties.ZipCode == "string") {
		styles.fillColor = 'cyan'
		,styles.fillOpacity = 0.5
		,styles.stroke=true
		,styles.radius=9
	}

	return styles;
};



////////////////////
// End Map script //
////////////////////


//window.onload = initialize();

