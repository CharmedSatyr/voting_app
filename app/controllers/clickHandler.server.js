'use strict';

const Users = require('../models/users.js');

class ClickHandler {
   constructor(req, res) {
      this.getClicks = (req, res) => {
         Users
            .findOne({
               'github.id': req.user.github.id
            })
            .exec((err, result) => {
               if (err)
                  throw err;

               if (result) {
                  res.json(result.nbrClicks);

               } else {
                  const newDoc = new Clicks({
                     'clicks': 0
                  });
                  newDoc.save((err, doc) => {
                     if (err)
                        throw err;

                     res.json(doc);
                  });
               }
            });
      };

      this.addClick = (req, res) => {
         Users
            .findOneAndUpdate({
               'github.id': req.user.github.id
            }, {
               $inc: {
                  'nbrClicks.clicks': 1
               }
            })
            .exec((err, result) => {
               if (err)
                  throw err;

               res.json(result.nbrClicks);
            });
      };

      this.resetClicks = (req, res) => {
         Users
            .findOneAndUpdate({
               'github.id': req.user.github.id
            }, {
               'nbrClicks.clicks': 0
            })
            .exec((err, result) => {
               if (err)
                  throw err;

               res.json(result.nbrClicks);
            });
      };
   }
}

module.exports = ClickHandler;
