'use strict';

const ClickHandler = require(process.cwd() + '/app/controllers/clickHandler.server.js');

module.exports = (app, db) => {

	const clickHandler = new ClickHandler(db);

	app
		.route('/')
		.get((req, res) => {
			res.sendFile(process.cwd() + '/views/index.html');
		});

	app
		.route('/api/clicks')
		.get(clickHandler.getClicks);
};
