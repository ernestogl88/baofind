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
  createMarkerInfo(lat, long);
  axios
    .get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=50&key=AIzaSyCekv9TIkClXh5EfD8V7pObO2gTrs_g__A`
    )
    .then(nearestPoint => {
      photoRef = nearestPoint.data.results[1].photos[0].photo_reference;
      return axios.get(
        `https://maps.googleapis.com/maps/api/place/photo?photoreference=${photoRef}=false&maxheight=500&maxwidth=500&key=AIzaSyCekv9TIkClXh5EfD8V7pObO2gTrs_g__A`
      );
    })
    .then()
    .catch(err=>{
      console.log(err)
    })

  console.log(photoRef);
}

function createMarkerInfo(lat, lng) {
  let container = document.getElementById("markersInfo");
  let p = document.createElement("p");
  p.innerHTML = `Lat: ${lat}, Lng: ${lng}`;
  container.appendChild(p);
}
