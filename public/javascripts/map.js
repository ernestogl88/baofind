const myCurrentCoords = {
  lat: 40.4136667,
  lng: -3.7045938
};

const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 15.5,
  center: myCurrentCoords
});

map.addListener("click", function(e) {
  placeMarker(e.latLng, map);
});

function placeMarker(position, map) {
  var marker = new google.maps.Marker({
    position: position,
    map: map
  });
  let lat = marker.position.lat();
  let long = marker.position.lng();
  let photoRef;
  axios
    .get(`http://localhost:3000/game/nearPlaces/${lat}/${long}`)
    .then(nearestPoint => {
      createMarkerInfo(lat, long);
      photoRef = nearestPoint.data.results[1].photos[0].photo_reference;
      let img = document.createElement("img");
      img.setAttribute(
        "src",
        `https://maps.googleapis.com/maps/api/place/photo?photoreference=${photoRef}&sensor=false&maxheight=1600&maxwidth=1600&key=AIzaSyCekv9TIkClXh5EfD8V7pObO2gTrs_g__A`
      );
      //img.setAttribute('width','200vw')
      let container = document.getElementById("markersInfo");
      container.appendChild(img);
      let input = document.createElement('textarea');
      input.setAttribute('rows','2');
      input.setAttribute('columns','10');
      container.appendChild(input);
    })
    .catch(err => {
      console.log(err);
    });
}

function createMarkerInfo(lat, lng) {
  let container = document.getElementById("markersInfo");
  let p = document.createElement("p");
  p.innerHTML = `Lat: ${lat}, Lng: ${lng}`;
  container.appendChild(p);
}
