const myCurrentCoords = {
  lat: 40.4138167,
  lng: -3.7025938
};

const Map = new google.maps.Map(
  document.getElementById('map'),
  {
    zoom: 15,
    center: myCurrentCoords
  }
);



google.maps.event.addListener(map, 'click', function (marker) {
  new google.maps.Marker({
    position: {
      lat: lat,
      lng: lng
    },
    map: Map,
    title: title
  });
});