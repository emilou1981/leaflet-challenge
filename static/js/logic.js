// Store API query variables
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// var date = "$where=created_date between'2016-01-10T12:00:00' and '2017-01-01T14:00:00'";
// var complaint = "&complaint_type=Rodent";
// var limit = "&$limit=10000";

// Assemble API query URL
// var url = baseURL + date + complaint + limit;

// Grab the data with d3
d3.json(url, function(response) {
  console.log(response.features);
  createFeatures(response.features);
});

// //adding color to legend
// function getColor(d)
// {
//     return d <=1 ? "#51cd32" :
//     d <=2 ? "#cdcd32" :
//     d <=3 ? "#ffd500" :
//     d <=4 ? "#ffa200" :
//     d <=5 ? "#ff6f00" :
//     "#ff3c00";
// }
  

//Create legend
var legend = L.control({position: "bottomright"});
legend.onAdd = function () {
  var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 1, 2, 3, 4, 5];
    labels=[]
  
    // Loop through data
  for (var i = 0; i < grades.length; i++) {

    div.innerHTML +=
      '<i class="square" style="background:' + getColor(grades[i] + 1) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    console.log('div' + div);
  return div;
};
  


// Function that will determine the color of a neighborhood based on the borough it belongs to
function getColor(c)
{
  x = Math.ceil(c);
  switch (Math.ceil(x)) {
    case 1:
      return "#51cd32";
    case 2:
      return "#cdcd32";
    case 3:
      return "#ffd500";
    case 4:
      return "#ffa200";
    case 5:
      return "#ff6f00";
    default:
      return "#ff3c00";
  }
}

// Create function for radius markings
function createFeatures(Data) {
  var earthquakes = L.geoJson(Data,{
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: feature.properties.mag*5,
        fillColor: getColor(feature.properties.mag),
        color: "gray",
        weight: .4,
        opacity: .5,
        fillOpacity: 0.5})
        .bindPopup("<h3>" + "Location: " + feature.properties.place +
          " Magnitude: " + feature.properties.mag + "</p>");
  }
});

  // Sending earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define map layer
  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  })
  
  // Create map
  var Map = L.map("map", {
    center: [40.76, -111.89],
    zoom: 3,
    layers: [lightmap, earthquakes]
  });
    console.log(Map);

  //Add legend to map
  legend.addTo(Map);
}


