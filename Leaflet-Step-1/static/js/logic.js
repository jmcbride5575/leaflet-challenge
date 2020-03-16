
// Call in API.
var apiKey = "pk.eyJ1Ijoiam1jYnJpZGU1NTc1IiwiYSI6ImNrNmp6eXBlMTAxcDMzbHFseWt5a3RkMGYifQ.JHHMIDuVwCMhQLhKCnYm2g";

// API link
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Functions to calculate the color and radius.
function styleInfo(feature) {
  return {
    opacity: 1,
    fillOpacity: 1,
    fillColor: getColor(feature.properties.mag),
    color: "#000000",
    radius: getRadius(feature.properties.mag),
    stroke: true,
    weight: 0.5
  };
}

// Setting marker color based on Earthquake magnitutde.
function getColor(magnitude) {
  switch (true) {
  case magnitude > 5:
    return "#660066";
  case magnitude > 4:
    return "#ff00ff";
  case magnitude > 3:
    return "#bf00ff";
  case magnitude > 2:
      return "#0080ff";
  case magnitude > 1:
      return "#00ff00";
  default:
      return "#ffff00";
    }
  }

  //Function for radius of marker based on magnitude
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 25000;
  }

// Call in the GeoJson data.
d3.json(link, function(data) {
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  var earthquakes = L.geoJSON(earthquakeData, {
  // Setting popup info for each magnitude marker
 onEachFeature : function (feature, layer) {

    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " +  feature.properties.mag + "</p>")
    },     pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {radius: getRadius(feature.properties.mag),
        fillColor: getColor(feature.properties.mag),
        fillOpacity: 0.75,
        stroke: false,
    })
  }
  });

  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Set street layer
var streetsmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",{
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: apiKey
});

// Create basemaps object
var basemaps = {
  "Street Map" : streetsmap
};

// Create overlay object
var overlaymaps = {
  Earthquakes: earthquakes
};

var myMap = L.map("mapid", {
  center: [45.0,-90],
  zoom: 4,
  layers: [streetsmap, earthquakes]
});

L.control.layers(basemaps, overlaymaps, {
  collapsed: false
}).addTo(myMap);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function () {

    var div = L.DomUtil.create('div','info legend'),
        magnitudes = [0, 1, 2, 3, 4, 5];

    for (var i = 0; i < magnitudes.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(magnitudes[i] + 1) + '"></i> ' + 
    + magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] + '<br>' : ' + ');
    }

    return div;
};

legend.addTo(myMap);

}