'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Poll = new Schema({
   title: String,
   author: {
      type: String,
      default: 'Anonymous',
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
});

module.exports = mongoose.model('Poll', Poll);
