require('dotenv').config();

const express = require('express');
const router  = express.Router();
const Game = require('../models/Game')
const request = require('request-promise');
const multer  = require('multer');

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



module.exports = router;