// I thought to use earthqakes of less than 2.5 to be able to feel them...
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

var myMap = L.map("map").setView([0, 0], 2);

// Add a tile layer (the background map image) to our map
// Use the addTo method to add objects to our map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

function colorByMag(mag){
    if ( mag < 4.5 ){
        return 'yellow'; // yellow
    } else if (mag < 5.5) {
        return 'orange'; // orange
    } else {
        return 'red';
    }

}

d3.json(url, function(data){
    console.log(data)
    //checking the data
    // L.geoJson(data)
    for( var i = 0; i < data.features.length; i++){
        L.circle([data.features[i].geometry.coordinates[1],data.features[i].geometry.coordinates[0]], {
            fillOpacity : 0.75,
            color:  colorByMag(data.features[i].properties.mag),
            radius: data.features[i].properties.mag * 10000
        }).bindPopup("<h1>" + data.features[i].properties.place +
         "</h1><hr><h3>Magnatude: "+ data.features[i].properties.mag +
         "</h3><hr><p>Url: "+ data.features[i].properties.url + "</p>" ).addTo(myMap)
    }
})