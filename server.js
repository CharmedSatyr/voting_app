'use strict';

const express = require('express'),
	routes = require('./app/routes/routes.js'),
	mongo = require('mongodb').MongoClient;

const port = 8080,
	dbport = 27017;

const app = express();

mongo.connect('mongodb://localhost:27017/voting_app', (err, db) => {

	(err)
		? console.error('Database failed to connect!')
		: console.log('MongoDB successfully connected on port', dbport);

	app.use('/views', express.static(process.cwd() + '/views'));
	app.use('/controllers', express.static(process.cwd() + '/app/controllers'));

	routes(app, db);

	app.listen(port, function() {
		console.log('Listening on port', port);
	});

});
