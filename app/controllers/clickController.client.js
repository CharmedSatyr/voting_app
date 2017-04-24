'use strict';

(() => {
	const addButton = document.querySelector('.btn-add');
	const deleteButton = document.querySelector('.btn-delete');
	const clickNbr = document.querySelector('#click-nbr');
	const port = 8080;
	const apiUrl = 'http://localhost:' + port + '/api/clicks';

	const ready = (fn) => {
		if (typeof fn !== 'function') {
			return;
		}

		if (document.readyState === 'complete') {
			return fn();
		}

		document.addEventListener('DOMContentLoaded', fn, false);
	}

	const ajaxRequest = (method, url, callback) => {
		const xmlhttp = new XMLHttpRequest();

		xmlhttp.onreadystatechange = () => {
			if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
				callback(xmlhttp.response);
			}
		};

		xmlhttp.open(method, url, true);
		xmlhttp.send();
	}

	const updateClickCount = (data) => {
		const clicksObject = JSON.parse(data);
		clickNbr.innerHTML = clicksObject.clicks;
	}

	ready(ajaxRequest('GET', apiUrl, updateClickCount));

	addButton.addEventListener('click', () => {
		ajaxRequest('POST', apiUrl, () => {
			ajaxRequest('GET', apiUrl, updateClickCount)
		});

	}, false);

	deleteButton.addEventListener('click', () => {

		ajaxRequest('DELETE', apiUrl, () => {
			ajaxRequest('GET', apiUrl, updateClickCount);
		});

	}, false);

})();
