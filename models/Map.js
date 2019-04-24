const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const mapSchema = new Schema({
  spots: [],
  mapDescription: String
});

const Map = mongoose.model('Map', mapSchema);
module.exports = Map;
