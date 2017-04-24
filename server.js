'use strict';

const express = require('express'),
	routes = require('./app/routes/index.js'),
	mongo = require('mongodb').MongoClient;

const port = 3000,
	dbport = 27017;

const app = express();

mongo.connect('mongodb://localhost:' + dbport + '/voting_app', (err, db) => {

	(err)
		? console.error('Database failed to connect!')
		: console.log('MongoDB successfully connected on port', dbport);

	app.use('/public', express.static(process.cwd() + '/public'));
	app.use('/controllers', express.static(process.cwd() + '/app/controllers'));

	routes(app, db);

	app.listen(port, function() {
		console.log('Listening on port', port);
	});

});
