require('dotenv').config();

const express = require('express');
const router  = express.Router();
const Game = require('../models/Game')
const request = require('request-promise');
const uploadCloud = require('../config/cloudinary.js');
const Spot = require('../models/Spots')

router.get('/newGame', (req,res)=>{
  res.render('game/newGame')
})

router.post('/newGame', (req,res)=>{
  
})

router.get('/joinGame', (req,res)=>{
  res.render('game/joinGame')
})

router.get('/nearPlaces/:lat/:long', (req,res)=>{
  let lat = req.params.lat;
  let long = req.params.long;
  request(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=100&key=AIzaSyCekv9TIkClXh5EfD8V7pObO2gTrs_g__A`)
  .then(nearestPoint => res.json(JSON.parse(nearestPoint)))
  .catch(err => {
      console.log(err);
  });
})


router.get('/clue', (req,res) => {
  res.render('game/clue')
})

router.post('/clue', uploadCloud.single('photo'), (req, res) => {
  const { picture } = req.body;
  const imgPath = req.file.url;
  const imgName = req.file.originalname;
  const photo = new Spot({picture, description, imgPath, imgName})
  photo.save()
  .then(spot => {
    res.render('game/clue');
  })
  .catch(error => {
    console.log(error);
  })
});


module.exports = router;