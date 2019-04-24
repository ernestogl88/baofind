const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const spotSchema = new Schema({
  coords: {
    lng: Number,
    lat: Number
  },
  picture: String,
  spotDescription: String
});

const Spots = mongoose.model('Spots', spotSchema);
module.exports = Spots;
