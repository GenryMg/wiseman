exports.run = (client, msg, args, main_color, some_random_api_url) => {
	const send_pikachu = function(pikachu) {
		try {
			let command_file = require('../send_animal_image_embed.js');
			return command_file.run(pikachu, msg, 'pikachu', main_color);
		} catch (error) {
			//console.error(error);
		}
	};

	const api_url = `${some_random_api_url}pikachuimg`;
	try {
		let command_file = require('../fetch_data.js');
		return command_file.run(api_url, send_pikachu);
	} catch (error) {
		//console.error(error);
	}
};

exports.pikachu = {
	name: 'pikachu',
	description: 'pikachu command'
};
