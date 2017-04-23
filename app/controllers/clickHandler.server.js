'use strict';

function clickHandler(db) {

	const clicks = db.collection('clicks');

	this.getClicks = (req, res) => {

		const clickProjection = {
			'_id': false
		};

		clicks.findOne({}, clickProjection, (err, result) => {
			if (err)
				throw err;

			if (result) {
				res.json(result);
			} else {
				clicks.insert({
					'clicks': 0
				}, (err) => {
					if (err)
						throw err;

					clicks.findOne({}, clickProjection, (err, doc) => {
						if (err)
							throw err;
						res.json(doc);
					});
				});
			}
		});
	};
}

module.exports = clickHandler;
