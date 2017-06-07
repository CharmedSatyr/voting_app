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

module.exports = (app) => {

   //VIEW - Login Page
   app.route('/')
      .get((req, res) => {
         show = {
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

   //VIEW - Main Polls Page
   app.route('/polls')
      .get((req, res) => {
         show = {
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

         Poll.findOne({
               'title': req.params.title
            })
            .exec((err, result) => {
               console.log(result.created);
               show = {
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
      .post(pollController.addPoll)
      .delete(pollController.removePoll);

   //API - Get all polls
   app.route('/api/polls/')
      .get(pollController.getAllPolls);

   //API - Add, remove, or vote for a candidate
   app.route('/api/:poll/candidates/:name')
      .put(pollController.addCandidate)
      .delete(pollController.removeCandidate)
      .post(pollController.voteForCandidate);

   //API - Get candidates for a specific poll
   app.route('/api/:poll/candidates/')
      .get(pollController.getCandidates);

};


app.get('/auth/github',
   passport.authenticate('github', {
      scope: ['user:email']
   }));

app.get('/auth/github/callback',
   passport.authenticate('github', {
      failureRedirect: '/'
   }),
   function (req, res) {
      // Successful authentication, redirect home.
      res.redirect('/polls');
   });
