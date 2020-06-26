var Url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"



d3.json(Url, function(data) {
    createFeatures(data.features);
    console.log(data.features)
  });

function createFeatures(Data) {
    function onEachFeature(feat, lay) {
    lay.bindPopup("<h3>" + feat.properties.place +
        "</h3><hr><p>" + new Date(feat.properties.time) + "</p>");
    }

    function radiusSize(mag) {
    return mag * 10000;
    }

  function circleColor(mag) {
    if (mag < 1) {
    return "#ccff33"
    }
    else if (mag < 2) {
    return "#ffff33"
    }
    else if (mag < 3) {
    return "#ffcc33"
    }
    else if (mag < 4) {
    return "#ff9933"
    }
    else if (mag < 5) {
    return "#ff6633"
    }
    else {
    return "#ff3333"
    }
}

var eq = L.geoJSON(Data, {
    pointToLayer: function(earthquakeData, latlng) {
    return L.circle(latlng, {
        radius: radiusSize(earthquakeData.properties.mag),
        color: circleColor(earthquakeData.properties.mag),
        fillOpacity: 1
    });
    },
    onEachFeature: onEachFeature
});

function createMap(earthquakes) {

    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "dark-v10",
      accessToken: API_KEY
    });
  
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };
  
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    var myData = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });
  
    
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myData);
  }


createMap(eq);

}