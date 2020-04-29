exports.run = (url, callback, other_parameters = [], method = 'GET', body = null, headers = {}) => {
	let headers_all = { 'content-type': 'application/json' };
	if (headers) {
		const headers_keys = Object.keys(headers);
		const headers_values = Object.values(headers);

		for (let i = 1; i < headers_keys.length + 1; i++) {
			headers_all[headers_keys[i - 1]] = headers_values[i - 1];
		}
	}

	const fetch = require('node-fetch');
	fetch(url, {
		method: method,
		body: body,
		headers: headers_all
	})
		.then(function(response) {
			if (!response.ok) throw Error(`Fetch response error: ${response.status}`);
			else return response.json();
		})
		.then(function(data) {
			if (other_parameters) callback(data, other_parameters);
			else callback(data);
		})
		.catch(function(error) {
			console.error(`Error from fetch: ${error}`);
		});
};

exports.fetch_data = {
	name: 'fetch_data'
};
