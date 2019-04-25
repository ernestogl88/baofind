const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  name: {type: String, required:true},
  map: { type: Schema.Types.ObjectId, ref: "Map", required:true},
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  status: { type: Boolean, default: true },
  startDate: {type: Date, required:true},
  finishDate: {type: Date, required:true},
  reward: String
});

const Game = mongoose.model("Game", gameSchema);
module.exports = Game;
