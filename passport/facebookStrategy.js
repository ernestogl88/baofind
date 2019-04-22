require('dotenv').config();

const FacebookStrategy = require('passport-facebook').Strategy;
const passport = require('passport');
const User = require('../models/User');

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:3000/auth/facebook/callback"
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));

{/* 
passport.use(new SlackStrategy({
    clientID: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({
            slackID: profile.id
        })
        .then(user => {
            if (user) {
                User.findByIdAndUpdate(user._id,{
                    username:profile.user.name},{new:true}).then(user => {
                        return done(null, user);
                    })
            }

            const newUser = new User({
                username: profile.user.name,
                slackID: profile.id
            });

            newUser.save()
                .then(user => {
                    done(null, newUser);
                })
        })
        .catch(error => {
            done(error)
        })

})); */}