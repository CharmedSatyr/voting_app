'use strict';

const express = require('express');
const routes = require('./routes/routes.js');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
require('dotenv')
   .load();

const port = process.env.PORT || 8080;
const mongo_uri = process.env.MONGO_URI || 'mongodb://localhost:27017/voting_app';
const db = mongoose.connection;

mongoose.connect(mongo_uri, (err, db) => {
   (err) ?
   console.error('Database failed to connect!'): console.log('Connected to Mongo database.');
});
mongoose.Promise = global.Promise;

app.use('/common', express.static(path.join(__dirname, '/common')));
app.use('/controllers', express.static(path.join(__dirname, '/controllers')));

routes(app);

app.listen(port, () => {
   console.log('Node.js listening on port', port + '.');
});
