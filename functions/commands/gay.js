exports.run = (client, msg, args, main_color, some_random_api_url) => {
	try {
		let command_file = require('../handle_some_random_api_image');
		return command_file.run(msg, 'gay', 'png', some_random_api_url);
	} catch (error) {
		//console.error(error);
	}
};

exports.gay = {
	name: 'gay',
	description: 'gay command'
};
