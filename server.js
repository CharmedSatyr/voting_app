'use strict';

const express = require('express'),
   routes = require('./app/routes/index.js'),
   mongoose = require('mongoose'),
   passport = require('passport'),
   session = require('express-session');

const app = express();
require('dotenv')
   .load();
require('./app/config/passport')(passport);

const port = process.env.PORT || 8080,
   mongo_uri = process.env.MONGO_URI || 'mongodb://localhost:27017/voting_app';

const path = process.cwd();

mongoose.connect(mongo_uri);
mongoose.Promise = global.Promise;

app.use('/controllers', express.static(path + '/app/controllers'));
app.use('/views', express.static(path + '/views'));
app.use('/common', express.static(path + '/app/common'));

app.use(session({
   secret: 'secretCharm',
   resave: false,
   saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

app.listen(port, () => {
   console.log('Node.js listening on port ' + port + '...');
});
