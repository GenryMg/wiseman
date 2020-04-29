exports.run = (client, msg, args, main_color, some_random_api_url) => {
	const send_whalefact = function(whalefact) {
		try {
			let command_file = require('../send_animal_fact_embed');
			return command_file.run(whalefact, msg, 'whale fact', main_color);
		} catch (error) {
			//console.error(error);
		}
	};

	const api_url = `${some_random_api_url}facts/whale`;
	try {
		let command_file = require('../fetch_data.js');
		return command_file.run(api_url, send_whalefact);
	} catch (error) {
		//console.error(error);
	}
};

exports.whalefact = {
	name: 'whalefact',
	description: 'whalefact command'
};
