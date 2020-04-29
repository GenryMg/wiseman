exports.run = (client, msg, args, main_color) => {
	const Discord = require('discord.js');

	const send_yesno = function(yesno) {
		if (!yesno) return msg.reply('something went wrong. Please try again.');

		const answer = yesno.answer;
		const forced = yesno.forced;

		let title = `${answer.charAt(0).toUpperCase()}${answer.slice(1)}`;
		if (forced) title += ' (forced)';

		title += '!';

		const image_url = yesno.image;

		const embed = new Discord.RichEmbed()
			.setColor(main_color)
			.setTitle(title)
			.setImage(image_url);
		msg.channel.send(embed);
	};

	const yesno_api_url = 'https://yesno.wtf/api';
	try {
		let command_file = require('../fetch_data.js');
		return command_file.run(yesno_api_url, send_yesno);
	} catch (error) {
		//console.error(error);
	}
};

exports.yesno = {
	name: 'yesno',
	description: 'yesno command'
};
