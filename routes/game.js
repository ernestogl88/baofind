const express = require('express');
const router  = express.Router();
const Game = require('../models/Game');
const multer  = require('multer');

router.get('/newGame', (req,res)=>{
  res.render('game/newGame')
})

router.post('/newGame', (req,res)=>{
  
})

router.get('/joinGame', (req,res)=>{
  res.render('game/joinGame')
})


router.get('/clue', (req,res) => {
  res.render('game/clue')
})



module.exports = router;