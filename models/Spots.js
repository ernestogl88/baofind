const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const spotSchema = new Schema({
  lng: {type: String},
  lat: {type: String},
  picture: {type: String, required:true},
  spotDescription: String
});

const Spots = mongoose.model("Spots", spotSchema);
module.exports = Spots;
