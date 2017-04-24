'use strict';

const path = process.cwd();

const ClickHandler = require(path + '/app/controllers/clickHandler.server.js');

module.exports = (app) => {

	const clickHandler = new ClickHandler();

	app
		.route('/')
		.get((req, res) => {
			res.sendFile(path + '/views/index.html');
		});

	app
		.route('/api/clicks')
		.get(clickHandler.getClicks)
		.post(clickHandler.addClick)
		.delete(clickHandler.resetClicks);
};
