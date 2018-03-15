
var freeBikesInBarrio = 0;
var Iaac = {lat:41.397, lng: 2.194};
var mode = new Boolean(false);
var map;
var mapOptions = {
    zoom: 14,
    center: Iaac,
    styles:styles
}
var gmarkers = [];
var activeDistrict = -1;
var activeDistrictCenter = [];
var displayRadius = 0.006

var dataVisualized= false;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
}


// LOAD JSON WITH XHR
var JsonString;
var JsonObject;

// Create the XHR object.
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
      // XHR for Chrome/Firefox/Opera/Safari.
      xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
      // XDomainRequest for IE.
      xhr = new XDomainRequest();
      xhr.open(method, url);
    } else {
      // CORS not supported.
      xhr = null;
    }
    return xhr;
  }
  
  // Helper method to parse the title tag from the response.
  function getTitle(text) {
    //console.log(text);
  }
  
  // Make the actual CORS request.
  function makeCorsRequest() {
    // This is a sample server that supports CORS.
    var url = 'https://api.citybik.es/v2/networks/bicing';
  
    var xhr = createCORSRequest('GET', url);
    if (!xhr) {
      alert('CORS not supported');
      return;
    }
  
    // Response handlers.
    xhr.onload = function() {
      JsonString = xhr.responseText;
      JsonObject = JSON.parse(JsonString);
      //console.log(JsonBicing);
      //JSONData(JsonObject);
    };
  
    xhr.onerror = function() {
      alert('Woops, there was an error making the request.');
    };
  
    xhr.send();
  }

makeCorsRequest();

function displayData (){
  if (!dataVisualized) {
   dataVisualized = true; 
   JSONData(JsonObject);
  }
  else {
    
    removeMarkers();
    dataVisualized = false; 
  }
} 

function displayDataByZone (){
  if (!dataVisualized) {
   dataVisualized = true; 
   JSONDataByZone(JsonObject);
  }
  else {
    removeMarkers();
    dataVisualized = false; 
  }
} 


function removeMarkers(){
  for(i=0; i<gmarkers.length; i++){
      gmarkers[i].setMap(null);
  }
}

function JSONData(data){
    //console.log(typeof data);
    //console.log(data);
    var freeBikes = new Array();
    var lon = new Array();
    var lat = new Array();
    var i;
    for(i=0; i<data.network.stations.length; i++ ){   
        freeBikes[i]= data.network.stations[i].empty_slots;
        lat[i] = data.network.stations[i].latitude;
        lon[i] = data.network.stations[i].longitude;
        var myLatLng = {lat: lat[i], lng: lon[i]};
        console.log(data.network.stations[i]);

        displayBikeStations(freeBikes[i],myLatLng,i);
 
      }
}


function JSONDataByZone(data){
  //console.log(typeof data);
  //console.log(data);
  freeBikesInBarrio = 0;
  var freeBikes = new Array();
  var lon = new Array();
  var lat = new Array();
  var i;
  var Lon0 = activeDistrictCenter[0];
  var Lat0 = activeDistrictCenter[1];
  for(i=0; i<data.network.stations.length; i++ ){   
      freeBikes[i]= data.network.stations[i].empty_slots;
      lat[i] = data.network.stations[i].latitude;
      lon[i] = data.network.stations[i].longitude;
      var myLatLng = {lat: lat[i], lng: lon[i]};
      
      console.log("Free bikes in barrio = " + freeBikesInBarrio);
      // a^2 + b^2 = c^2
      var deltaDistance = Math.sqrt(Math.pow((lat[i] - Lat0),2) + Math.pow((lon[i] - Lon0),2));

      if(deltaDistance < displayRadius){
        displayBikeStations(freeBikes[i],myLatLng,i);
        console.log(data.network.stations[i]);
        freeBikesInBarrio += freeBikes[i];
      }
    }
}



function displayBikeStations(freeBike, myLatLng,i){

      var icon = {
          url: "Circle.png", // url
          scaledSize: new google.maps.Size(freeBike*1.6, freeBike*1.6), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
      };

      var marker = new google.maps.Marker({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        position: myLatLng,
        radius: freeBike*4, 
        icon: icon,
        map: map
      });
      gmarkers.push(marker);

      var infowindow = new google.maps.InfoWindow({
        content: String("Free bikes: " + freeBike)
      });
      marker.addListener('click',function(){
        console.log("clicked")
      });
      google.maps.event.addListener(marker, "mouseover", function() {
        console.log("Hovered" + i);
        infowindow.open(map, marker);
      });
      google.maps.event.addListener(marker, "mouseout", function() {
        console.log("Hovered" + i);
        infowindow.close(map, marker);
      });

}






window.onload = function(){
  
  console.log("here");
  


}


function writeToJson(){
  var fs  = require('fs');
  var fileName =  'crime.json';
  var file = require(fileName);
  
  file.key = "new Val";

  console.log(file);

}



