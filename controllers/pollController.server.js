'use strict';

const Poll = require('../models/Poll.js');

class PollController {

   constructor(req, res) {

      //Show all existing polls
      this.getAllPolls = (req, res) => {
         Poll
            .find((err, results) => {
               if (err) {
                  console.error(err);
               }
               res.json(results);
            });
      }

      //Create a new poll
      this.addPoll = (req, res) => {

         //Login name
         let name_view;
         if (req.user) {
            name_view = req.user.github.displayName || req.user.twitter.displayName || req.user.github.username ||
               req.user.twitter.username
         } else {
            name_view = 'Captain Anonymous';
         }


         Poll
            .findOne({
               'title': req.params.title
            })
            .exec((err, result) => {
               if (err) {
                  console.error(err);
               }
               if (result) {
                  res.send('Duplicate poll entry: ' + result.title);
               } else {

                  const pollEntry = new Poll({
                     'title': req.params.title,
                     'author': name_view,
                     'candidates': []
                  });
                  pollEntry.save((err, doc) => {
                     if (err) {
                        console.error(err);
                     }
                     res.send('Creating new poll: ' + doc.title);
                  });
               }
            });

      }

      //Remove an existing poll
      this.removePoll = (req, res) => {
         Poll.findOne({
               'title': req.params.title
            })
            .remove()
            .exec();
         res.send('Deleting poll: ' + req.params.title)
      }

      //Add a new candidate to a specified poll
      this.addCandidate = (req, res) => {
         Poll
            .findOneAndUpdate({
               'title': req.params.poll,
            }, {
               $addToSet: {
                  'candidates': {
                     'name': req.params.name //Note that this doesn't check for duplicates
                  }
               }
            })
            .exec((err, result) => {
               if (err) {
                  console.error(err);
               }
               res.send('Entered candidate: "' + req.params.name + '" to poll: "' +
                  req.params.poll + '"');
            });
      }

      //Remove a new candidate from a specified poll
      this.removeCandidate = (req, res) => {
         Poll
            .findOneAndUpdate({
               'title': req.params.poll,
            }, {
               $pull: {
                  'candidates': {
                     'name': req.params.name
                  }
               }
            })
            .exec((err, result) => {
               if (err) {
                  console.error(err);
               }
               res.send('Removed candidate: "' + req.params.name + '" from poll: "' +
                  req.params.poll + '"');
            });
      }

      //Get all candidates for a specified poll
      this.getCandidates = (req, res) => {
         Poll
            .findOne({
               'title': req.params.poll
            })
            .exec((err, results) => {
               if (err) {
                  console.error(err);
               }
               res.json(results.candidates);
            });
      }

      //Vote for a candidate in a specified poll
      this.voteForCandidate_server = (req, res) => {
         Poll.findOneAndUpdate({
               'title': req.params.poll,
               'candidates.name': req.params.name

            }, {
               $inc: {
                  'candidates.$.votes': 1
               }
            })
            .exec((err, result) => {
               if (err) {
                  console.error(err)
               }
               res.send('Vote cast for: "' + req.params.name + '" in poll: "' + req.params.poll + '"');
            });
      }
   }
}

module.exports = PollController;
