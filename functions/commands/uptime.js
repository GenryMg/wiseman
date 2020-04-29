exports.run = (client, msg, args, main_color) => {
	const Discord = require('discord.js');

	let totalSeconds = client.uptime / 1000;
	let days = Math.floor(totalSeconds / 86400);
	let hours = Math.floor(totalSeconds / 3600);
	totalSeconds %= 3600;
	let minutes = Math.floor(totalSeconds / 60);
	let seconds = Math.floor(totalSeconds % 60);

	const title = "I've been online for:";
	const description = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;

	const embed = new Discord.RichEmbed()
		.setColor(main_color)
		.setTitle(title)
		.setDescription(description);
	msg.channel.send(embed);
};

exports.uptime = {
	name: 'uptime',
	description: 'uptime command'
};
