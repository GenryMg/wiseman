exports.run = (client, msg, args, main_color) => {
	const Discord = require('discord.js');

	let avatar_url = '';
	let user = '';
	if (!args[1]) {
		user = msg.author;
		avatar_url = user.displayAvatarURL;
	} else if (args[1].match(/^<@!?(\d+)>$/)) {
		const matches = args[1].match(/^<@!?(\d+)>$/);
		const id = matches[1];
		user = new Discord.User(client, client.users.get(id));

		avatar_url = user.displayAvatarURL;
	} else return msg.reply('you provided an invalid user.');

	const title = `${user.username}'s avatar`;

	const embed = new Discord.RichEmbed()
		.setColor(main_color)
		.setTitle(title)
		.setURL(avatar_url)
		.setImage(avatar_url);
	msg.channel.send(embed);
};

exports.avatar = {
	name: 'avatar',
	description: 'avatar command'
};
