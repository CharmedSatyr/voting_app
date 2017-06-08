'use strict';

const GitHubStrategy = require('passport-github2')
   .Strategy;
const TwitterStrategy = require('passport-twitter')
   .Strategy;
const User = require('../models/User.js');
const configAuth = require('./auth');

module.exports = (passport) => {

   passport.serializeUser((user, done) => {
      done(null, user.id);
   });

   passport.deserializeUser((id, done) => {
      User.findById(id, (err, user) => {
         done(err, user);
      });
   });

   passport.use(new TwitterStrategy({
      consumerKey: configAuth.twitterAuth.consumerKey,
      consumerSecret: configAuth.twitterAuth.consumerSecret,
      callbackURL: configAuth.twitterAuth.callbackURL
   }, (token, tokenSecret, profile, cb) => {
      process.nextTick(() => {

         console.log(profile);

         User.findOne({
            'twitter.id': profile.id
         }, (err, user) => {
            if (err) {
               return cb(err);
            }
            if (user) {
               return cb(null, user);
            } else {
               const newUser = new User();

               newUser.twitter.id = profile.id;
               newUser.twitter.username = profile.username;
               newUser.twitter.displayName = profile.displayName;

               newUser.save((err) => {
                  if (err) {
                     throw err;
                  }
                  return cb(null, newUser);
               });
            }
         });
      });
   }));


   passport.use(new GitHubStrategy({
      clientID: configAuth.githubAuth.clientID,
      clientSecret: configAuth.githubAuth.clientSecret,
      callbackURL: configAuth.githubAuth.callbackURL
   }, (token, refreshToken, profile, done) => {
      process.nextTick(() => {
         console.log(profile);
         User.findOne({
            'github.id': profile.id
         }, (err, user) => {
            if (err) {
               return done(err);
            }
            if (user) {
               return done(null, user);
            } else {
               const newUser = new User();

               newUser.github.id = profile.id;
               newUser.github.username = profile.username;
               newUser.github.displayName = profile.displayName;

               newUser.save((err) => {
                  if (err) {
                     throw err;
                  }
                  return done(null, newUser);
               });
            }
         });
      });
   }));
};
