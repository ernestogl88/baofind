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
    startDate: req.body.startDate,
    users: [req.user._id],
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
  },{new: true})
    .populate("map")
    .then(game => {
      User.findByIdAndUpdate(req.user._id, {
        currentGame: game._id,
        currentSpot: game.map.spots[0]
      }, {new:true}).then(user => {
        res.redirect(`/game/clue/${user.currentSpot}`);
      });
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
  Spot.findById(req.params.id).then(spot => {
    res.render("game/clue", { spot });
  });
});

router.post("/clue/uploadPhoto", uploadCloud.single("photo"), (req, res) => {
  const imgPath = req.file.url;
  User.findByIdAndUpdate(
    req.user._id,
    {
      $push: { pictures: imgPath }
    },
    { new: true }
  )
    .then(user => {
      Game.findById(user.currentGame)
        .populate("map")
        .then(game => {
          let spotNumber = game.map.spots.indexOf(user.currentSpot);
          console.log(spotNumber+'********************'+game.map.spots.length);
          if (spotNumber === game.map.spots.length-1) {
            res.render("game/winner");
          } else {
            User.findByIdAndUpdate(req.user._id, {
              currentSpot: game.map.spots[spotNumber+1]
            },{new: true})
            .then(() => {
              res.redirect(`/game/clue/${game.map.spots[spotNumber+1]}`);
            });
          }
        });
    })
    .catch(error => {
      console.log(error);
    });
});

router.get("/clue/:_id/:lat/:lng", (req, res) => {
  const latPhoto = +req.params.lat;
  const lngPhoto = +req.params.lng;
  Spot.findById(req.params._id).then(spot => {
    let latDif = 0.000898315 * 10;
    let lngDif = 0.001172673 * 10;
    let lngSpot = +spot.lng;
    let latSpot = +spot.lat;
    // console.log(latPhoto);
    // console.log(spot.lat);
    // console.log(lngPhoto);
    // console.log(spot.lng);
    if (
      latPhoto >= latSpot - latDif &&
      latPhoto <= latSpot + latDif &&
      lngPhoto >= lngSpot - lngDif &&
      lngPhoto <= lngSpot + lngDif
    ) {
      res.json({ answer: true });
    } else {
      res.json({ answer: false });
    }
  });
});
module.exports = router;
