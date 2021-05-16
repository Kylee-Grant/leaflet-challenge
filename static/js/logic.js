// Based on Activity 17.1.7 and 17.1.10

/* IMPORT DATA */ 
// The USGS provides earthquake data in a number of different formats, updated every 5 minutes. 
// Visit the [USGS GeoJSON Feed](http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) page and pick a data set to visualize. 
// When you click on a data set, for example "All Earthquakes from the Past 7 Days", you will be given a JSON representation of that data. 
// You will use the URL of this JSON to pull in the data for our visualization.
// Store our API endpoint as queryUrl.
var queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data);
});

/* DATA PREP */
function createFeatures(data){
// Organize our data so that it can be more easily used 
    var earthquakeInfo = []; 
    data.features.forEach(function(earthquakeData) {
        earthquakeInfo.push({
            place: earthquakeData.properties.place,
            coordinates: [earthquakeData.geometry.coordinates[1], earthquakeData.geometry.coordinates[0]],
            dpt: earthquakeData.geometry.coordinates[2],
            mag: earthquakeData.properties.mag
        });
    });
    console.log(earthquakeInfo);
    createMap(earthquakeInfo);
};

/* START MAP */
function createMap(earthquakeInfo) {
    
    // Create a map object.
    var myMap = L.map("map", {
        center: [30.0000, -20.0000],
        zoom: 2
    });

    // Create the tile layer that will be the background of our map.
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    /* VISUALIZE DATA */
    // Plot all of the earthquakes from your data set based on their longitude and latitude.
    // Data markers should reflect the magnitude of the earthquake by their size and and depth of the earthquake by color. 
    // Earthquakes with higher magnitudes should appear larger and earthquakes with greater depth should appear darker in color.
    // HINT: The depth of the earth can be found as the third coordinate for each earthquake.
    // Include popups that provide additional information about the earthquake when a marker is clicked.
    // Create a legend that will provide context for your map data.

    // Loop through the array, and create one marker for each object
    for (var i = 0; i < earthquakeInfo.length; i++) {

        // Add circles to the map.
        L.circle(earthquakeInfo[i].coordinates, {
            color: "white",
            fillColor: "blue",
            fillOpacity: 0.05 * earthquakeInfo[i].dpt, // UPDATE: https://stackoverflow.com/questions/6443990/javascript-calculate-brighter-colour
            // Adjust the radius
            radius: earthquakeInfo[i].mag * 50000
        }).bindPopup("<h1>" + earthquakeInfo[i].place + "</h1> <hr> <h3>Magnitude: " + earthquakeInfo[i].mag + "   ||   Depth: " + earthquakeInfo[i].dpt + "</h3>").addTo(myMap);
    };
     
    /* CREATE LEGEND */
    // UPDATE: https://gis.stackexchange.com/questions/193161/add-legend-to-leaflet-map
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
       var div = L.DomUtil.create("div", "info legend");
       var limits = geojson.options.limits;
       var colors = geojson.options.colors;
       var labels = [];
   
       // Add the minimum and maximum.
       var legendInfo = "<h1>Teen Birth Rate</h1>" +
         "<div class=\"labels\">" +
           "<div class=\"min\">" + limits[0] + "</div>" +
           "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
         "</div>";
   
       div.innerHTML = legendInfo;
   
       limits.forEach(function(limit, index) {
         labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
       });
   
       div.innerHTML += "<ul>" + labels.join("") + "</ul>";
       return div;
     };
   
     // Adding the legend to the map
     legend.addTo(myMap);
};