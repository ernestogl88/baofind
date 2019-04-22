const express = require('express');
const router  = express.Router();
const User = require('../models/User')
/* GET home page */
router.get('/', (req, res) => {
  
  User.findById(req.user.id).then(user => {
    res.render('profile', {user})
  })
  .catch(err => {
    res.status(500).send ({message: `Error to find the user ${err}`})
  })

});

module.exports = router;
