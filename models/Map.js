const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const mapSchema = new Schema({
  username: String,
  password: String
});

const Map = mongoose.model('Map', mapSchema);
module.exports = Map;
