exports.run = (client, msg, args, main_color) => {
	const Discord = require('discord.js');
	const atob = require('atob');

	if (!args[1]) return msg.reply('you did not provide any arguments. Try `wise base64totext base64`.');

	const base64 = args.slice(1, args.length).join(' ');

	const title = `Text:`;
	let description = atob(base64);
	if (description.length > 256) return msg.reply("the result is longer than 256 characters - that's too long.");

	const embed = new Discord.RichEmbed()
		.setColor(main_color)
		.setTitle(title)
		.setDescription(description);
	msg.channel.send(embed);
};

exports.base64totext = {
	name: 'base64totext',
	description: 'base64totext command'
};
