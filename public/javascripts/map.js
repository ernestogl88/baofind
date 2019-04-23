const myCurrentCoords = {
  lat: 40.4136667,
  lng: -3.7045938
};

const map = new google.maps.Map(
  document.getElementById('map'),
  {
    zoom: 15.5,
    center: myCurrentCoords
  }
);

map.addListener('click', function(e) {
  placeMarker(e.latLng, map);
});

function placeMarker(position, map) {
  var marker = new google.maps.Marker({
      position: position,
      map: map
  });

}