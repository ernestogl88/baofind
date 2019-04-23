require("dotenv").config();

const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({
        facebookId: profile.id
      })
        .then(user => {
          if (user) {
            return done(null, user);
          }

          const newUser = new User({
            username: profile.displayName,
            facebookId: profile.id
          });

          newUser.save().then(user => {
            done(null, newUser);
          });
        })
        .catch(error => {
          done(error);
        });
    }
  )
);
