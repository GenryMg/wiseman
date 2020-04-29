exports.run = (client, msg, args, main_color, some_random_api_url) => {
	const send_koala = function(koala) {
		try {
			let command_file = require('../send_animal_image_embed.js');
			return command_file.run(koala, msg, 'koala', main_color);
		} catch (error) {
			//console.error(error);
		}
	};

	const api_url = `${some_random_api_url}img/koala`;
	try {
		let command_file = require('../fetch_data.js');
		return command_file.run(api_url, send_koala);
	} catch (error) {
		//console.error(error);
	}
};

exports.koala = {
	name: 'koala',
	description: 'koala command'
};
