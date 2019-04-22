const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  mapId: { type: Schema.Types.ObjectId, ref: "Maps"},
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  status: { type: Boolean, default: false },
  start: Date,
  finish: Date
});

const Game = mongoose.model("Game", gameSchema);
module.exports = Game;
