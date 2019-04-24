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
      if(nearestPoint.data.results[1].photos===undefined){
        photoRef = nearestPoint.data.results[2].photos[0].photo_reference;
      }
      photoRef = nearestPoint.data.results[1].photos[0].photo_reference;
      let container = document.getElementById("imageInfo");
      let div = document.createElement('div');
      let latInput = document.createElement('input');
      latInput.setAttribute('type','text');
      latInput.setAttribute('class','lat');
      latInput.disabled=true;
      latInput.value= lat;
      div.appendChild(latInput);
      let lngInput = document.createElement('input');
      lngInput.setAttribute('type','text');
      lngInput.setAttribute('class','lng');
      lngInput.disabled=true;
      lngInput.value= long;
      div.appendChild(lngInput);
      container.appendChild(div);
      let img = document.createElement("img");
      img.setAttribute(
        "src",
        `https://maps.googleapis.com/maps/api/place/photo?photoreference=${photoRef}&sensor=false&maxheight=300&maxwidth=300&key=AIzaSyCekv9TIkClXh5EfD8V7pObO2gTrs_g__A`
      );
      let imgInput = document.createElement('input');
      imgInput.setAttribute('type','hidden');
      imgInput.setAttribute('class','image')
      imgInput.value = `https://maps.googleapis.com/maps/api/place/photo?photoreference=${photoRef}&sensor=false&maxheight=300&maxwidth=300&key=AIzaSyCekv9TIkClXh5EfD8V7pObO2gTrs_g__A`;
      div.appendChild(imgInput);
      let div2 = document.createElement('div');
      div2.appendChild(img);
      let input = document.createElement('textarea');
      input.setAttribute('rows','3');
      input.setAttribute('columns','20');
      div2.appendChild(input);
      container.appendChild(div2)
      setFormIds();
    })
    .catch(err => {
      console.log(err);
    });
}

function setFormIds (){
  let totalSpots = document.getElementById('totalSpots');
  let form = document.getElementById('newGameForm');
  let images = form.querySelectorAll('.image');
  images.forEach((img,idx)=>{
    img.setAttribute('name',`image${idx}`)
  })
  totalSpots.value = images.length;
  let textareas = form.querySelectorAll('textarea');
  textareas.forEach((textarea,idx)=>{
    textarea.setAttribute('name',`description${idx}`)
  })
  let lats = form.querySelectorAll('.lat');
  lats.forEach((lat,idx)=>{
    lat.setAttribute('name',`lat${idx}`)
  })
  let longs = form.querySelectorAll('.lng');
  longs.forEach((lng,idx)=>{
    lng.setAttribute('name',`lng${idx}`)
  })
}