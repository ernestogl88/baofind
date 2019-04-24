window.onload = getExif;
var photoPosition = [];

function getExif() {
  document.getElementById("photoUpload").onchange = function(e) {
    var file = e.target.files[0];
    if (file && file.name) {
      EXIF.getData(file, function() {
        var exifData = EXIF.getAllTags(this);
        if (exifData) {
          var latdegrees = exifData.GPSLatitude[0];
          var latminutes = exifData.GPSLatitude[1];
          var latseconds = exifData.GPSLatitude[2];
          var photoLat = latseconds / 3600 + latminutes / 60 + latdegrees;
          photoPosition.push(photoLat);
          var lngdegrees = exifData.GPSLongitude[0];
          var lngminutes = exifData.GPSLongitude[1];
          var lngseconds = exifData.GPSLongitude[2];
          var photoLng = -(lngseconds / 3600 + lngminutes / 60 + lngdegrees);
          photoPosition.push(photoLng);

          let spotId = document.getElementById("spotId").value;
          console.log(photoPosition)
          axios
            .get(
              `http://localhost:3000/game/clue/${spotId}/${photoPosition[0]}/${
                photoPosition[1]
              }`
            )
            .then(response => {
              console.log(response.data.answer)
              if(response.data.answer === true) {
                document.getElementById("sendButton").disabled = false
              }
            })
            .catch(error => {
              console.log(error)
            });
          return photoPosition;
        } else {
          alert("No EXIF data found in image '" + file.name + "'.");
        }
      });
    }
  };
}
