const express = require('express');
const router  = express.Router();
const Game = require('../models/Game')

router.get('/newGame', (req,res)=>{
  res.render('game/newGame')
})

router.post('/newGame', (req,res)=>{
  
})

router.get('/joinGame', (req,res)=>{
  res.render('game/joinGame')
})

router.get('/nearPlaces', (req,res)=>{

})

router.get('/getPhoto', (req,res)=>{
  
})


module.exports = router;