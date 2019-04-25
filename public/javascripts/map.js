const myCurrentCoords = {
  lat: 40.4136667,
  lng: -3.7045938
};

const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 15.5,
  center: myCurrentCoords,
  disableDefaultUI: true,
  zoomControl: true
});

map.addListener("click", function(e) {
  placeMarker(e.latLng, map);
});
var input = document.getElementById("pac-input");
var searchBox = new google.maps.places.SearchBox(input);
map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

// Bias the SearchBox results towards current map's viewport.
map.addListener("bounds_changed", function() {
  searchBox.setBounds(map.getBounds());
});

var markers = [];
// Listen for the event fired when the user selects a prediction and retrieve
// more details for that place.
searchBox.addListener("places_changed", function() {
  var places = searchBox.getPlaces();

  if (places.length == 0) {
    return;
  }

  // Clear out the old markers.
  // markers.forEach(function(marker) {
  //   marker.setMap(null);
  // });

  // For each place, get the icon, name and location.
  var bounds = new google.maps.LatLngBounds();
  places.forEach(function(place) {
    if (!place.geometry) {
      console.log("Returned place contains no geometry");
      return;
    }

    // Create a marker for each place.
    let newMarker = new google.maps.Marker({
      map: map,
      title: place.name,
      position: place.geometry.location,
      draggable: true
    });
    markers.push(newMarker);
    setDragendListeners(markers);
    drawMarkersInfo(markers);
    if (place.geometry.viewport) {
      // Only geocodes have viewport.
      bounds.union(place.geometry.viewport);
    } else {
      bounds.extend(place.geometry.location);
    }
  });
  map.fitBounds(bounds);
});

function placeMarker(position, map) {
  var marker = new google.maps.Marker({
    position: position,
    map: map,
    draggable: true
  });
  markers.push(marker);
  setDragendListeners(markers);
  drawMarkersInfo(markers);
}

function setFormIds() {
  let totalSpots = document.getElementById("totalSpots");
  let form = document.getElementById("imageInfo");
  let images = form.querySelectorAll(".image");
  images.forEach((img, idx) => {
    img.setAttribute("name", `image${idx}`);
  });
  totalSpots.value = images.length;
  let textareas = form.querySelectorAll("textarea");
  textareas.forEach((textarea, idx) => {
    textarea.setAttribute("name", `description${idx}`);
  });
  let lats = form.querySelectorAll(".lat");
  lats.forEach((lat, idx) => {
    lat.setAttribute("name", `lat${idx}`);
  });
  let longs = form.querySelectorAll(".lng");
  longs.forEach((lng, idx) => {
    lng.setAttribute("name", `lng${idx}`);
  });
}

function drawMarkersInfo(markers) {
  let container = document.getElementById("imageInfo");
  container.innerHTML = "";
  markers.forEach(marker => {
    let lat = marker.position.lat();
    let long = marker.position.lng();
    let photoRef;
    axios
      .get(`http://localhost:3000/game/nearPlaces/${lat}/${long}`)
      .then(nearestPoint => {
        if (nearestPoint.data.results[1].photos === undefined) {
          photoRef = nearestPoint.data.results[2].photos[0].photo_reference;
        }
        photoRef = nearestPoint.data.results[1].photos[0].photo_reference;
        let div = document.createElement("div");
        let latInput = document.createElement("input");
        latInput.setAttribute("type", "text");
        latInput.setAttribute("class", "lat");
        latInput.readOnly = true;
        latInput.value = lat;
        div.appendChild(latInput);
        let lngInput = document.createElement("input");
        lngInput.setAttribute("type", "text");
        lngInput.setAttribute("class", "lng");
        lngInput.readOnly = true;
        lngInput.value = long;
        div.appendChild(lngInput);
        container.appendChild(div);
        let img = document.createElement("img");
        img.setAttribute(
          "src",
          `https://maps.googleapis.com/maps/api/place/photo?photoreference=${photoRef}&sensor=false&maxheight=300&maxwidth=300&key=AIzaSyCekv9TIkClXh5EfD8V7pObO2gTrs_g__A`
        );
        let imgInput = document.createElement("input");
        imgInput.setAttribute("type", "hidden");
        imgInput.setAttribute("class", "image");
        imgInput.value = `https://maps.googleapis.com/maps/api/place/photo?photoreference=${photoRef}&sensor=false&maxheight=300&maxwidth=300&key=AIzaSyCekv9TIkClXh5EfD8V7pObO2gTrs_g__A`;
        div.appendChild(imgInput);
        let div2 = document.createElement("div");
        div2.appendChild(img);
        let input = document.createElement("textarea");
        input.setAttribute("rows", "3");
        input.setAttribute("columns", "20");
        div2.appendChild(input);
        container.appendChild(div2);
        setFormIds();
      })
      .catch(err => {
        console.log(err);
      });
  });
}

function setDragendListeners(markers){
  markers.forEach(marker => {
    google.maps.event.addListener(marker, "dragend", function(marker) {
      let index = markers.indexOf(marker);
      markers.slice(index, 1);
      drawMarkersInfo(markers);
    });
  });
}
