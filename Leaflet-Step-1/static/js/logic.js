
// Creating Title Layer.
console.log("working");

var apiKey = "pk.eyJ1Ijoiam1jYnJpZGU1NTc1IiwiYSI6ImNrNmp6eXBlMTAxcDMzbHFseWt5a3RkMGYifQ.JHHMIDuVwCMhQLhKCnYm2g";

var graymap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: apiKey
});

// Create map object.
var map = L.map("mapid", {
  center: [
    45.0, -90
  ],
  zoom: 3
});

// Add graymap title layer to map.
graymap.addTo(map);

// Calling the GeoJson data from USGS.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {

  
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

  // Setting marker color based on Earthquake mangitutde.
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

    return magnitude * 4;
  }

  // Add GeoJson layer to map.
  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    // We set the style for each circleMarker using our styleInfo function. Popup for each marker to display magnitude.
    style: styleInfo,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(map);

  // Set legend control object.
  var legend = L.control({
    position: "bottomright"
  });

  // Set details for the legend
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#ffff00",
      "#00ff00",
      "#0080ff",
      "#bf00ff",
      "#ff00ff",
      "#660066"
    ];

    // Loop through grades.
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // Set legend to map.
  legend.addTo(map);
});

