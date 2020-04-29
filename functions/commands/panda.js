exports.run = (client, msg, args, main_color, some_random_api_url) => {
	const send_panda = function(panda) {
		try {
			let command_file = require('../send_animal_image_embed.js');
			return command_file.run(panda, msg, 'panda', main_color);
		} catch (error) {
			//console.error(error);
		}
	};

	const api_url = `${some_random_api_url}img/panda`;
	try {
		let command_file = require('../fetch_data.js');
		return command_file.run(api_url, send_panda);
	} catch (error) {
		//console.error(error);
	}
};

exports.panda = {
	name: 'panda',
	description: 'panda command'
};
