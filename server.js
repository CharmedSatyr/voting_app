'use strict';

const express = require('express'),
	routes = require('./app/routes/index.js'),
	mongoose = require('mongoose');

//const path = process.cwd();

const port = process.env.PORT || 8080,
	dbport = process.env.DBPORT || 27017;

const app = express();

mongoose.connect('mongodb://localhost:' + dbport + '/voting_app');

app.use('/views', express.static(process.cwd() + '/views'));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));

routes(app);

app.listen(port, function() {
	console.log('Listening on port', port);
});
