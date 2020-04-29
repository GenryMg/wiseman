exports.run = (client, msg, args, main_color) => {
	const Discord = require('discord.js');

	const send_advice = function(advice_json) {
		if (!advice_json) return msg.reply('something went wrong. Please try again.');

		let title = '';
		if (advice_json.total_results) {
			if (advice_json.total_results == 0) return msg.reply('no results were found.');

			title = advice_json.slips[0].advice;
		} else title = advice_json.slip.advice;

		const embed = new Discord.RichEmbed().setColor(main_color).setTitle(title);
		msg.channel.send(embed);
	};

	let advice_api_url = 'https://api.adviceslip.com/advice';
	if (args[1]) {
		const search_terms = args.slice(1).join(' ');
		advice_api_url += `/search/${search_terms}`;
	}
	try {
		let command_file = require('../fetch_data.js');
		return command_file.run(advice_api_url, send_advice);
	} catch (error) {
		//console.error(error);
	}
};

exports.advice = {
	name: 'advice',
	description: 'advice command'
};
