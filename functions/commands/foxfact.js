exports.run = (client, msg, args, main_color, some_random_api_url) => {
	const send_foxfact = function(foxfact) {
		try {
			let command_file = require('../send_animal_fact_embed');
			return command_file.run(foxfact, msg, 'fox fact', main_color);
		} catch (error) {
			//console.error(error);
		}
	};

	const api_url = `${some_random_api_url}facts/fox`;
	try {
		let command_file = require('../fetch_data.js');
		return command_file.run(api_url, send_foxfact);
	} catch (error) {
		//console.error(error);
	}
};

exports.foxfact = {
	name: 'foxfact',
	description: 'foxfact command'
};
