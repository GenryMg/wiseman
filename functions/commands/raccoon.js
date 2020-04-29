exports.run = (client, msg, args, main_color, some_random_api_url) => {
	const send_raccoon = function(raccoon) {
		try {
			let command_file = require('../send_animal_image_embed.js');
			return command_file.run(raccoon, msg, 'raccoon', main_color);
		} catch (error) {
			//console.error(error);
		}
	};

	const api_url = `${some_random_api_url}img/racoon`;
	try {
		let command_file = require('../fetch_data.js');
		return command_file.run(api_url, send_raccoon);
	} catch (error) {
		//console.error(error);
	}
};

exports.raccoon = {
	name: 'raccoon',
	description: 'raccoon command'
};
