exports.run = (client, msg, args, main_color, some_random_api_url) => {
	const send_birb = function(birb) {
		try {
			let command_file = require('../send_animal_image_embed.js');
			return command_file.run(birb, msg, 'birb', main_color);
		} catch (error) {
			//console.error(error);
		}
	};

	const api_url = `${some_random_api_url}img/birb`;
	try {
		let command_file = require('../fetch_data.js');
		return command_file.run(api_url, send_birb);
	} catch (error) {
		//console.error(error);
	}
};

exports.birb = {
	name: 'birb',
	description: 'birb command'
};
