exports.run = (client, msg, args, main_color, some_random_api_url) => {
	const send_catfact = function(catfact) {
		try {
			let command_file = require('../send_animal_fact_embed');
			return command_file.run(catfact, msg, 'cat fact', main_color);
		} catch (error) {
			//console.error(error);
		}
	};

	const api_url = `${some_random_api_url}facts/cat`;
	try {
		let command_file = require('../fetch_data.js');
		return command_file.run(api_url, send_catfact);
	} catch (error) {
		//console.error(error);
	}
};

exports.catfact = {
	name: 'catfact',
	description: 'catfact command'
};
