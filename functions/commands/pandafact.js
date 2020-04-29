exports.run = (client, msg, args, main_color, some_random_api_url) => {
	const send_pandafact = function(pandafact) {
		try {
			let command_file = require('../send_animal_fact_embed');
			return command_file.run(pandafact, msg, 'panda fact', main_color);
		} catch (error) {
			//console.error(error);
		}
	};

	const api_url = `${some_random_api_url}facts/panda`;
	try {
		let command_file = require('../fetch_data.js');
		return command_file.run(api_url, send_pandafact);
	} catch (error) {
		//console.error(error);
	}
};

exports.pandafact = {
	name: 'pandafact',
	description: 'pandafact command'
};
