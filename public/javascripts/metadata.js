window.onload = getExif;

function getExif() {
  document.getElementById("photoUpload").onchange = function(e) {
    var file = e.target.files[0];
    if (file && file.name) {
      EXIF.getData(file, function() {
        var exifData = EXIF.pretty(this);
        console.log(exifData);
        if (exifData) {
          alert(exifData);
        } else {
          alert("No EXIF data found in image '" + file.name + "'.");
        }
      });
    }
  };
}
