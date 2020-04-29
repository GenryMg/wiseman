exports.run = (client, msg, args, main_color, some_random_api_url) => {
	const send_kangeroo = function(kangeroo) {
		try {
			let command_file = require('../send_animal_image_embed.js');
			return command_file.run(kangeroo, msg, 'kangeroo', main_color);
		} catch (error) {
			//console.error(error);
		}
	};

	const api_url = `${some_random_api_url}img/kangaroo`;
	try {
		let command_file = require('../fetch_data.js');
		return command_file.run(api_url, send_kangeroo);
	} catch (error) {
		//console.error(error);
	}
};

exports.kangeroo = {
	name: 'kangeroo',
	description: 'kangeroo command'
};
