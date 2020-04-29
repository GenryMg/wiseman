exports.run = (client, msg, args, main_color) => {
	const Discord = require('discord.js');
	if (!msg.member.hasPermission('ADMINISTRATOR')) return msg.reply('You are not allowed to use this command!');
	if (!args[1]) return msg.reply('you did not provide any arguments. Try `wise say text`.');

	const text = args.slice(1, args.length).join(' ');

	const embed = new Discord.RichEmbed()
		.setColor(main_color)
		.setDescription(text)
	/*try {
		const matches = args[1].match(/^<@!?(\d+)>$/);
		const id = matches[1];
		const user = new Discord.User(client, client.users.get(id));
		//user detected
		return msg.reply('you are not allowed to tag someone for `wise say`.');
	} catch {
		//no user detected
	}*/

	msg.channel.send(embed);
};

exports.say = {
	name: 'say',
	description: 'say command'
};
