exports.run = (client, msg, args, main_color, some_random_api_url) => {
	const send_elephantfact = function(elephantfact) {
		try {
			let command_file = require('../send_animal_fact_embed');
			return command_file.run(elephantfact, msg, 'elephant fact', main_color);
		} catch (error) {
			//console.error(error);
		}
	};

	const api_url = `${some_random_api_url}facts/elephant`;
	try {
		let command_file = require('../fetch_data.js');
		return command_file.run(api_url, send_elephantfact);
	} catch (error) {
		//console.error(error);
	}
};

exports.elephantfact = {
	name: 'elephantfact',
	description: 'elephantfact command'
};
