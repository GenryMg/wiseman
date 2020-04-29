exports.run = (client, msg, args, main_color) => {
	const Discord = require('discord.js');

	const guild = msg.guild;
	if (!guild.available) return msg.reply('unable to read data of this guild.');

	const embed = new Discord.RichEmbed()
		.setColor(main_color)
		.setTitle('Guild info')
		.addField('Name', guild.name)
		.addField('User count', guild.memberCount)
		.addField('Member count', guild.members.filter(member => !member.user.bot).size)
		.addField('Bot count', guild.members.filter(member => member.user.bot).size)
		.addField('Region', guild.region)
		.addField('Guild ID', guild.id)
		.addField('Created guild at', guild.createdAt)
		.setThumbnail(guild.iconURL);

	//.addField('Verified guild', guild.verified) //not sure what this means

	msg.channel.send(embed);
};

exports.guildinfo = {
	name: 'guildinfo',
	description: 'guildinfo command'
};
