'use strict';

const Clicks = require('../models/clicks.js');

function ClickHandler() { //Convert to ES6 as a class, not an arrow function

	this.getClicks = (req, res) => {

		Clicks.findOne({}, {'_id': false}).exec((err, result) => {
			if (err)
				throw err;

			if (result) {
				res.json(result);
			} else {
				const newDoc = new Clicks({'clicks': 0});
				newDoc.save(function(err, doc) {
					if (err)
						throw err;

					res.json(doc);
				});
			}
		});
	};

	this.addClick = (req, res) => {
		Clicks.findOneAndUpdate({}, {
			$inc: {
				'clicks': 1
			}
		}).exec((err, result) => {
			if (err)
				throw err;

			res.json(result);
		});
	};

	this.resetClicks = (req, res) => {
		Clicks.findOneAndUpdate({}, {'clicks': 0}).exec((err, result) => {
			if (err)
				throw err;

			res.json(result);
		});
	};
}

module.exports = ClickHandler;
