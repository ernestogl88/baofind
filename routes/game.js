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
    //console.log(req.body[lng], req.body[lat])
    let spot = new Spot({
      lng: req.body[lng],
      lat: req.body[lat],
      picture: req.body[picture],
      spotDescription: req.body[spotDescription]
    });
    spots.push(spot);
  }
  let map = new Map({
    mapDescription: req.body.gameDescription
  });
  let game = new Game({
    name: req.body.gameTitle,
    users: [req.user._id],
    startDate: req.body.startDate,
    finishDate: req.body.endDate,
    reward: req.body.gameReward
  });
  Spot.insertMany(spots)
    .then(spots => {
      spots.forEach(spot => {
        spotsId.push(spot._id);
      });
      map.spots = spotsId;
    })
    .then(() => {
      map.save().then(map => {
        game.map = map._id;
        return game
          .save()
          .then(res.render("index"))
          .catch(err => console.log(err));
      });
    })
    .catch(err => console.log(err));
});

router.get("/joinGame", (req, res) => {
  Game.find()
    .populate("map")
    .then(games => {
      res.render("game/joinGame", { games });
    });
});

router.get("/joinGame/:id", (req, res) => {
  Game.findByIdAndUpdate(req.params.id, {
    $push: { users: req.user._id }
  })
  .populate('map')
  .then(game => {
    User.findByIdAndUpdate(req.user._id, { currentGame: req.params.id }).then(
      user => {
        res.redirect(`/game/clue/${game.map.spots[0]}`);
      }
    );
  });
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

router.get("/clue/:id", (req, res) => {
  console.log('dentro del detalle de clue')
  Spot.findById(req.params.id)
  .then(spot=>{
    res.render("game/clue", {spot});
  })
});

router.post("/clue", uploadCloud.single("photo"), (req, res) => {
  const { picture } = req.body;
  const imgPath = req.file.url;
  User.findByIdandUpdate(req.user.id, {
    $push: { pictures: imgPath }
  })
    .then(spot => {
      res.render("game/clue");
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;
