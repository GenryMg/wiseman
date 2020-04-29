exports.run = (client, msg, args, main_color, some_random_api_url) => {
	const send_dog = function(dog) {
		try {
			let command_file = require('../send_animal_image_embed.js');
			return command_file.run(dog, msg, 'dog', main_color);
		} catch (error) {
			//console.error(error);
		}
	};

	const api_url = `${some_random_api_url}img/dog`;
	try {
		let command_file = require('../fetch_data.js');
		return command_file.run(api_url, send_dog);
	} catch (error) {
		//console.error(error);
	}
};

exports.dog = {
	name: 'dog',
	description: 'dog command'
};
