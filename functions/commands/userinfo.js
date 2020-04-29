exports.run = (client, msg, args, main_color) => {
	const Discord = require('discord.js');

	let user = msg.author;
	if (msg.mentions.users.first()) user = msg.mentions.users.first();
	const member = msg.guild.member(user);

	const nickname = member.nickname;

	const embed = new Discord.RichEmbed()
		.setColor(main_color)
		.setTitle('User info')
		.addField('Name', `${user.username}#${user.discriminator}`)
		.addField('User ID', user.id)
		.addField('Created account at', user.createdAt)
		.addField(`Joined ${msg.guild.name} at`, msg.guild.member(user).joinedAt)
		.addField('Nickname', nickname ? nickname : 'No nickname set')
		.addField('Status', `${user.presence.status} (${user.presence.game ? user.presence.game.name : 'No game set'})`)
		.setThumbnail(user.avatarURL);

	msg.channel.send(embed);
};

exports.userinfo = {
	name: 'userinfo',
	description: 'userinfo command'
};
