const express = require('express');
const router  = express.Router();
const User = require('../models/User')
const Spot = require('../models/Spots')
const Game = require('../models/Game')
/* GET home page */
/* router.get('/', (req, res) => {
  
  User.findById(req.user.id).then(user => {
    res.render('profile', {user})
  })
  .catch(err => {
    res.status(500).send ({message: `Error to find the user ${err}`})
  })

}); */

router.get('/', (req,res) => {
  User.findById(req.user.id)
  .populate('currentGame')
  .populate('currentSpot')
  .then(user=>{
    res.render('profile', {user})
  })
  .catch(err => {
    res.status(500).send ({message: `Error to find the user ${err}`})
  })
})

router.get('/myPictures', (req,res)=>{
  User.findById(req.user.id).then(user => {
    res.render('myPictures', {user})
  })
  .catch(err => {
    res.status(500).send ({message: `Error to find the user ${err}`})
  })
})

module.exports = router;
