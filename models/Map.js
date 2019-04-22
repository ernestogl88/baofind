const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const mapSchema = new Schema({
  mapId: String,
  spots: [],
  mapDescription: String
});

const Map = mongoose.model('Map', mapSchema);
module.exports = Map;
