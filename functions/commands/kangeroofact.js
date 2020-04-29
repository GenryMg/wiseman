exports.run = (client, msg, args, main_color, some_random_api_url) => {
	const send_kangeroofact = function(kangeroofact) {
		try {
			let command_file = require('../send_animal_fact_embed');
			return command_file.run(kangeroofact, msg, 'kangeroo fact', main_color);
		} catch (error) {
			//console.error(error);
		}
	};

	const api_url = `${some_random_api_url}facts/kangaroo`;
	try {
		let command_file = require('../fetch_data.js');
		return command_file.run(api_url, send_kangeroofact);
	} catch (error) {
		//console.error(error);
	}
};

exports.kangeroofact = {
	name: 'kangeroofact',
	description: 'kangeroofact command'
};
