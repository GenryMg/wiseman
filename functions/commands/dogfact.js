exports.run = (client, msg, args, main_color, some_random_api_url) => {
	const send_dogfact = function(dogfact) {
		try {
			let command_file = require('../send_animal_fact_embed');
			return command_file.run(dogfact, msg, 'dog fact', main_color);
		} catch (error) {
			//console.error(error);
		}
	};

	const api_url = `${some_random_api_url}facts/dog`;
	try {
		let command_file = require('../fetch_data.js');
		return command_file.run(api_url, send_dogfact);
	} catch (error) {
		//console.error(error);
	}
};

exports.dogfact = {
	name: 'dogfact',
	description: 'dogfact command'
};
