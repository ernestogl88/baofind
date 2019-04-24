const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  facebookId: String,
  username: String,
  pictures: [{type: String}],
  currentGame: { type: Schema.Types.ObjectId, ref: "Game"},
  currentSpot: { type: Schema.Types.ObjectId, ref: "Spot"},
});

const User = mongoose.model('User', userSchema);
module.exports = User;


