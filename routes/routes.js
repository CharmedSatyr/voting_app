'use strict';

const Poll = require('../models/Poll.js');
const PollController = require('../controllers/pollController.server.js');
const pollController = new PollController();

const mu = require('mu2');
const path = require('path');

mu.root = path.join(process.cwd(), '/views');

const mupdate = (obj, file, response) => {
   mu.clearCache();
   let stream = mu.compileAndRender(file, obj);
   stream.pipe(response);
}

module.exports = (app, passport) => {

   let show, name_view, loggedIn;
   const permissions = (req, res, next) => {
      if (req.isAuthenticated()) {
         loggedIn = true;
         name_view = req.user.github.displayName || req.user.twitter.displayName || req.user.github.username ||
            req.user.twitter.username;
         next();
      } else {
         loggedIn = false;
         name_view = 'Captain Anonymous';
         next();
      }
   }

   //VIEW - Login Page
   app.route('/')
      .get((req, res) => {
         show = {
            username: '',
            login: true,
            logout: false,
            pollControllerScripts: false,
            pollCreate: false,
            pollSelect: false,
            viewExistingPoll: false,
            title: '',
            author: '',
            date: '',
            removeCandidateOrPoll: false
         }
         mupdate(show, 'index.html', res);
      });


   //VIEW - Main Polls Page
   app.route('/polls')
      .get(permissions, (req, res) => {

         show = {
            username: name_view,
            login: false,
            logout: true,
            pollControllerScripts: true,
            pollCreate: loggedIn,
            pollSelect: true,
            viewExistingPoll: false,
            title: '',
            author: '',
            date: '',
            removeCandidateOrPoll: false
         }
         mupdate(show, 'index.html', res);
      });

   //VIEW - Poll template
   app.route('/polls/:title')
      .get(permissions, (req, res) => {

         Poll.findOne({
               'title': req.params.title
            })
            .exec((err, result) => {
               show = {
                  username: name_view,
                  login: false,
                  logout: true,
                  pollControllerScripts: false,
                  pollCreate: false,
                  pollSelect: false,
                  viewExistingPoll: true,
                  title: req.params.title,
                  author: result.author,
                  date: result.created,
                  removeCandidateOrPoll: loggedIn
               }
               mupdate(show, 'index.html', res);
            });
      });

   //API - Get all polls
   app.route('/api/polls/')
      .get(pollController.getAllPolls);

   //API - Add or remove a poll
   app.route('/api/polls/:title')
      .post(pollController.addPoll)
      .delete(pollController.removePoll);

   //API - Add, remove, or vote for a candidate
   app.route('/api/:poll/candidates/:name')
      .put(pollController.addCandidate)
      .delete(pollController.removeCandidate)
      .post(pollController.voteForCandidate_server);

   //API - Get candidates for a specific poll
   app.route('/api/:poll/candidates/')
      .get(pollController.getCandidates);

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

   //Auth Logout
   app.route('/logout')
      .get((req, res) => {
         req.logout();
         res.redirect('/');
      });

};
