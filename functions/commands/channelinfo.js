exports.run = (client, msg, args, main_color) => {
	const Discord = require('discord.js');

	let channel = msg.channel;
	if (msg.mentions.channels.first()) channel = msg.mentions.channels.first();

	let embed = new Discord.RichEmbed()
		.setColor(main_color)
		.setTitle('Channel info')
		.addField('Name', channel.name);
	if (channel.topic) embed.addField('Topic', channel.topic);
	embed
		.addField('Type', channel.type)
		.addField('NSFW', channel.nsfw)
		.addField('Channel ID', channel.id)
		.addField('Created channel at', channel.createdAt);

	msg.channel.send(embed);
};

exports.channelinfo = {
	name: 'channelinfo',
	description: 'channelinfo command'
};
