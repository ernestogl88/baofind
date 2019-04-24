const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const mapSchema = new Schema({
  spots: [{type: Schema.Types.ObjectId, ref: "Spots"}],
  mapDescription: String
});

const Map = mongoose.model('Map', mapSchema);
module.exports = Map;
