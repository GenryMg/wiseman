exports.run = (client, msg, args, main_color) => {
	const Discord = require('discord.js');
	const btoa = require('btoa');

	if (!args[1]) return msg.reply('you did not provide any arguments. Try `wise texttobase64 text`.');

	const text = args.slice(1, args.length).join(' ');

	const title = `Base64:`;
	let description = btoa(text);
	if (description.length > 256) return msg.reply("the result is longer than 256 characters - that's too long.");

	const embed = new Discord.RichEmbed()
		.setColor(main_color)
		.setTitle(title)
		.setDescription(description);
	msg.channel.send(embed);
};

exports.texttobase64 = {
	name: 'texttobase64',
	description: 'texttobase64 command'
};
