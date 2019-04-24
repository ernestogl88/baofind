const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  name: String,
  map: { type: Schema.Types.ObjectId, ref: "Map"},
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  state: { type: Boolean, default: false },
  startDate: Date,
  finishDate: Date,
  reward: String
});

const Game = mongoose.model("Game", gameSchema);
module.exports = Game;
