exports.run = (client, msg, args, main_color, some_random_api_url) => {
	 const send_corona = function(corona) {
		try {
			let command_file = require('../send_corona.js');
			return command_file.run(corona, msg, 'Coronavirus', main_color);
		} catch (error) {
			//console.error(error);
		}
	}; 
    
	const api_url = `https://corona.lmao.ninja/v2/all`;
	try {
		let command_file = require('../fetch_data.js');
		return command_file.run(api_url, send_corona);
	} catch (error) {
		//console.error(error);
	}
};

exports.coronavirus = {
	name: 'coronavirus',
	description: 'coronavirus command'
};
