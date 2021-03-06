const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
require("../passport/facebookStrategy.js");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/facebook", passport.authenticate("facebook"));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/profile/",
    failureRedirect: "/login"
  })
);

router.get("/login", (req, res, next) => {
  res.render("index", { message: req.flash("error") });
});

router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    res.redirect("/");
  });
});

module.exports = router;
// router.post("/login", passport.authenticate("local", {
//   successRedirect: "/",
//   failureRedirect: "/auth/login",
//   failureFlash: true,
//   passReqToCallback: true
// }));

// router.get("/signup", (req, res, next) => {
//   res.render("auth/signup");
// });

// router.post("/signup", (req, res, next) => {
//   const username = req.body.username;
//   const password = req.body.password;
//   if (username === "" || password === "") {
//     res.render("auth/signup", { message: "Indicate username and password" });
//     return;
//   }

//   User.findOne({ username }, "username", (err, user) => {
//     if (user !== null) {
//       res.render("auth/signup", { message: "The username already exists" });
//       return;
//     }

//     const salt = bcrypt.genSaltSync(bcryptSalt);
//     const hashPass = bcrypt.hashSync(password, salt);

//     const newUser = new User({
//       username,
//       password: hashPass
//     });

//     newUser
//       .save()
//       .then(() => {
//         res.redirect("/");
//       })
//       .catch(err => {
//         res.render("auth/signup", { message: "Something went wrong" });
//       });
//   });
// });


