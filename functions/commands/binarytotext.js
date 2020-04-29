exports.run = (client, msg, args, main_color) => {
	const Discord = require('discord.js');

	if (!args[1]) return msg.reply('you did not provide any arguments. Try `wise binarytotext binary`.');

	const binary = args.slice(1, args.length).join(' ');

	const title = `Text:`;
	let description = '';
	const arr = binary.match(/.{1,8}/g);
	for (let i = 0; i < arr.length; i++) {
		description += String.fromCharCode(parseInt(arr[i], 2).toString(10));
	}

	if (description.length > 256) return msg.reply("the result is longer than 256 characters - that's too long.");

	const embed = new Discord.RichEmbed()
		.setColor(main_color)
		.setTitle(title)
		.setDescription(description);
	msg.channel.send(embed);
};

exports.binarytotext = {
	name: 'binarytotext',
	description: 'binarytotext command'
};
