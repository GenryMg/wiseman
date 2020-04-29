exports.run = (client, msg, args, main_color) => {
	if (msg.author.id != '157877645801947137') return msg.reply('you are not allowed to use this command.');

	const Discord = require('discord.js');

	const after_toggling = function(developer_mode_enabled) {
		const title = `Developer mode enabled: ${developer_mode_enabled}`;

		const embed = new Discord.RichEmbed().setColor(main_color).setTitle(title);
		msg.channel.send(embed);
	};

	try {
		let command_file = require('../toggle_developer_mode');
		command_file.run(after_toggling);
	} catch (error) {
		console.error(error);
	}
};

exports.develop = {
	name: 'develop',
	description: 'develop command'
};
