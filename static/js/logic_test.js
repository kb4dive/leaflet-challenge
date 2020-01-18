// Create URL Vaiable for Earthquake Date
var quakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(quakeURL, function(data) {
  // Assign data.features object to the createFeatures function
  createFeatures(data.features);
  console.log(data.features)
});

function createFeatures(quakeData) {

  // Define a function to run for each feature in the "features" array and create popup displaying the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<br>The Epicenter is Located:<br>" + feature.properties.place + "<hr>" + "<br>Time of Activity is:<br>" + new Date(feature.properties.time));
  }

  // Define function to create the circle radius based on the magnitude
  function markerSize(magnitude) {
    return magnitude * 25000;
  }

  // Define function to set the circle color based on the magnitude
  function markerColor(magnitude) {
    if (magnitude < 1) {
      return "#ccff33"
    }
    else if (magnitude < 2) {
      return "#ffff33"
    }
    else if (magnitude < 3) {
      return "#ffcc33"
    }
    else if (magnitude < 4) {
      return "#ff9933"
    }
    else if (magnitude < 5) {
      return "#ff6633"
    }
    else {
      return "#ff3333"
    }
  }

  // Create a GeoJSON layer and Run the onEachFeature function for each item in the array 
  var earthquakes = L.geoJSON(quakeData, {
    pointToLayer: function(quakeData, latlng) {
      return L.circle(latlng, {
        radius: markerSize(quakeData.properties.mag),
        color: markerColor(quakeData.properties.mag),
        fillOpacity: 1
      });
    },
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define outdoormap, satellitemap, and grayscalemap layers
  var outdoorsmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });

  var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var grayscalemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // Create the faultline layer
  var faultLine = new L.LayerGroup();
  
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satellite": satellitemap,
    "Greyscale": grayscalemap,
    "Outdoors" : outdoorsmap
    
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    FaultLines: faultLine,
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display when prompted to load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    layers: [outdoorsmap, earthquakes, faultLine]
  });
}