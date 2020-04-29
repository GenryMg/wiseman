exports.run = (client, msg, args, main_color, some_random_api_url) => {
	const send_redpanda = function(redpanda) {
		try {
			let command_file = require('../send_animal_image_embed.js');
			return command_file.run(redpanda, msg, 'red panda', main_color);
		} catch (error) {
			//console.error(error);
		}
	};

	const api_url = `${some_random_api_url}img/red_panda`;
	try {
		let command_file = require('../fetch_data.js');
		return command_file.run(api_url, send_redpanda);
	} catch (error) {
		//console.error(error);
	}
};

exports.redpanda = {
	name: 'redpanda',
	description: 'redpanda command'
};
