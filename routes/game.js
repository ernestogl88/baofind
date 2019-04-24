require("dotenv").config();

const express = require("express");
const router = express.Router();
const Game = require("../models/Game");
const request = require("request-promise");
const uploadCloud = require("../config/cloudinary.js");
const Spot = require("../models/Spots");
const multer = require("multer");
const Map = require("../models/Map");
const User = require("../models/User.js");

router.get("/newGame", (req, res) => {
  res.render("game/newGame");
});

router.post("/newGame", (req, res) => {
  let spotsId = [];
  let spots = [];
  for (var i = 0; i < req.body.totalSpots; i++) {
    let lng = `lng${i}`;
    let lat = `lat${i}`;
    let picture = `image${i}`;
    let spotDescription = `description${i}`;
    let spot = new Spot({
      coords: {
        lng: req.body[lng],
        lat: req.body[lat]
      },
      picture: req.body[picture],
      spotDescription: req.body[spotDescription]
    });
    spots.push(spot);
  }
  let game = new Game({
    name: req.body.gameTitle,
    users: [req.user._id],
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    reward: req.body.gameReward
  });
  spots.forEach(spot => {
    spot
      .save()
      .then(spot => {
        spotsId.push(spot._id);
      })
      .catch(err => console.log(err));
  });
  let map = new Map({
    spots: spotsId,
    mapDescription: req.body.gameDescription
  });
  map.save().then(map => {
    game.map = map._id;
    return game.save()
    .then(res.render('/'))
    .catch(err=>console.log(err))
  });
});

router.get("/joinGame", (req, res) => {
  res.render("game/joinGame");
});

router.get("/nearPlaces/:lat/:long", (req, res) => {
  let lat = req.params.lat;
  let long = req.params.long;
  request(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=100&key=AIzaSyCekv9TIkClXh5EfD8V7pObO2gTrs_g__A`
  )
    .then(nearestPoint => res.json(JSON.parse(nearestPoint)))
    .catch(err => {
      console.log(err);
    });
});

router.get("/clue", (req, res) => {
  res.render("game/clue");
});

router.post("/clue", uploadCloud.single("photo"), (req, res) => {
  const { picture } = req.body;
  const imgPath = req.file.url;
  User.findByIdandUpdate(req.user.id, {
    $push: { pictures: imgPath }})
    .then(spot => {
      res.render("game/clue");
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;
