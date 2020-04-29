exports.run = (client, msg, args, main_color, some_random_api_url) => {
	const send_cat = function(cat) {
		try {
			let command_file = require('../send_animal_image_embed.js');
			return command_file.run(cat, msg, 'cat', main_color);
		} catch (error) {
			//console.error(error);
		}
	};

	const api_url = `${some_random_api_url}img/cat`;
	try {
		let command_file = require('../fetch_data.js');
		return command_file.run(api_url, send_cat);
	} catch (error) {
		//console.error(error);
	}
};

exports.cat = {
	name: 'cat',
	description: 'cat command'
};
