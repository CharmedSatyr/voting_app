'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
   github: {
      id: String,
      displayName: String,
      username: String
   },
   twitter: {
      id: String,
      displayName: String,
      username: String
   }
   /*,
      polls: [{
         title: String,
         author: {
            type: String,
            default: 'Captain Anonymous',
            required: false
         },
         candidates: [{
            name: String,
            votes: {
               type: Number,
               default: 0,
               required: true
            }
         }],
         created: {
            type: Date,
            default: Date.now,
            expires: '7d'
         }
      }]
    */
});

module.exports = mongoose.model('User', User);
