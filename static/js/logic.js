// I thought to use earthqakes of less than 2.5 to be able to feel them.
// The urls can just be commented out, so either should work.
// var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var myMap = L.map("map").setView([0, 0], 2);

// Add a tile layer (the background map image) to our map
// Use the addTo method to add objects to our map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(myMap);

function colorByMag(mag){
    if ( mag < 0 ) {
        //I just wanted to see what a negative reading meant, and they are just really small earthquakes, like really small, .02mm. I didn't know, so I looked it up.
        //https://www.usgs.gov/faqs/how-can-earthquake-have-a-negative-magnitude?qt-news_science_products=0#qt-news_science_products
        return 'blue';
    }else if ( mag < 2.5 ){
        return 'green';
    } else if ( mag < 4 ){
        return 'yellow'; // yellow
    } else if (mag < 5.5) {
        return 'orange'; // orange
    } else {
        return 'red';
    }
}
//found most of the leaflet legend info here
//https://gis.stackexchange.com/questions/133630/adding-leaflet-legend
var legend = L.control({position: "bottomright"});
legend.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "info legend");
    var labels =['<strong>Strengths</strong>']
    var colors = ['blue', 'green', 'yellow', 'orange', 'red']
    var categories = ['less than 0', '0-2.5','2.5-4','4-5.5','5.5+']

    for ( var i = 0; i< categories.length; i++ ){
        div.innerHTML += 
        labels.push(
            '<i class="circle" r=5 style="background: '+ colors[i] + '"></i>' +
        (categories[i] ? categories[i] : '+')
        )
    }
    div.innerHTML = labels.join('<br>')
    return div;
}
legend.addTo(myMap)

function getDateStringMine(date){
    var d = new Date(date);
    return d.toDateString();
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
         "</h3><hr><a href= "+data.features[i].properties.url+">Url: "+ data.features[i].properties.url + "</a>" +
         "<hr><p>" + getDateStringMine(data.features[i].properties.time) + "</p>").addTo(myMap)
    }
})