'use strict';

const Poll = require('../models/Poll.js');
const PollController = require('../controllers/pollController.server.js');
const pollController = new PollController();

const mu = require('mu2');
const path = require('path');
let show;

mu.root = path.join(process.cwd(), '/views');

const mupdate = (obj, file, response) => {
   mu.clearCache();
   let stream = mu.compileAndRender(file, obj);
   stream.pipe(response);
}

module.exports = (app, passport) => {

   const isLoggedIn = (req, res, next) => {
      req.isAuthenticated() ?
         next() :
         res.redirect('/');
   }

   //VIEW - Login Page
   app.route('/')
      .get((req, res) => {
         show = {
            username: '',
            login: true,
            logout: false,
            pollCreateAndSelect: false,
            viewExistingPoll: false,
            title: '',
            author: '',
            date: ''
         }
         mupdate(show, 'index.html', res);
      });

   //Logout
   app.route('/logout')
      .get((req, res) => {
         req.logout();
         res.redirect('/');
      });

   //Twitter Auth
   app.route('/auth/twitter')
      .get(passport.authenticate('twitter'));

   //Twitter Auth
   app.route('/auth/twitter/callback')
      .get(passport.authenticate('twitter', {
         successRedirect: '/polls',
         failureRedirect: '/'
      }));

   //GitHub Auth
   app.route('/auth/github')
      .get(passport.authenticate('github'));

   //GitHub Auth
   app.route('/auth/github/callback')
      .get(passport.authenticate('github', {
         successRedirect: '/polls',
         failureRedirect: '/'
      }));

   //VIEW - Main Polls Page
   app.route('/polls')
      .get((req, res) => {

         let name_view;
         if (req.user) {
            name_view = req.user.github.displayName || req.user.twitter.displayName || req.user.github.username ||
               req.user.twitter.username
         } else {
            name_view = 'Captain Anonymous';
         }

         show = {
            username: name_view,
            login: false,
            logout: true,
            pollCreateAndSelect: true,
            viewExistingPoll: false,
            title: '',
            author: '',
            date: ''
         }
         mupdate(show, 'index.html', res);
      });

   //VIEW - Poll template
   app.route('/polls/:title')
      .get((req, res) => {

         const name_view = req.user.github.displayName || req.user.twitter.displayName || req.user.github.username ||
            req.user.twitter.username || 'Anonymous';

         Poll.findOne({
               'title': req.params.title
            })
            .exec((err, result) => {
               show = {
                  username: name_view,
                  login: false,
                  logout: true,
                  pollCreateAndSelect: false,
                  viewExistingPoll: true,
                  title: req.params.title,
                  author: result.author,
                  date: result.created
               }
               mupdate(show, 'index.html', res);
            });
      });

   //API - Add or remove a poll
   app.route('/api/polls/:title')
      .post(isLoggedIn, pollController.addPoll)
      .delete(isLoggedIn, pollController.removePoll);

   //API - Get all polls
   app.route('/api/polls/')
      .get(pollController.getAllPolls);

   //API - Add, remove, or vote for a candidate
   app.route('/api/:poll/candidates/:name')
      .put(isLoggedIn, pollController.addCandidate)
      .delete(isLoggedIn, pollController.removeCandidate)
      .post(pollController.voteForCandidate);

   //API - Get candidates for a specific poll
   app.route('/api/:poll/candidates/')
      .get(pollController.getCandidates);

};
