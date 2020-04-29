exports.run = (client, msg, args, main_color) => {
	const send_turtle = function(turtle) {
		try {
			let command_file = require('../send_animal_image_embed_2.js');
			return command_file.run(turtle, msg, 'turtle', main_color);
		} catch (error) {
			//console.error(error);
		}
	};

	const api_url = `https://and-here-is-my-code.glitch.me/img/turtle`;
	try {
		let command_file = require('../fetch_data.js');
		return command_file.run(api_url, send_turtle);
	} catch (error) {
		//console.error(error);
	}
};

exports.cat = {
	name: 'cat',
	description: 'cat command'
};
