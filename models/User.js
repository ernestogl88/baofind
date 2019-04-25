const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  facebookId: {type: String, required:true},
  username: {type: String, required:true},
  pictures: [{type: String}],
  currentGame: { type: Schema.Types.ObjectId, ref: "Game"},
  currentSpot: { type: Schema.Types.ObjectId, ref: "Spots"}
})

const User = mongoose.model('User', userSchema);
module.exports = User;


