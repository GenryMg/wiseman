exports.run = (client, msg, args, main_color) => {
	const Discord = require('discord.js');
	const { TeamTrees } = require('teamtrees-api');
	const teamTrees = new TeamTrees();

	const teamtrees_url = 'https://teamtrees.org';

	const title = '🌳 #TeamTrees Statistics 🌳';
	const description = `DONATE NOW: ${teamtrees_url}`;
	let embed = new Discord.RichEmbed()
		.setColor(main_color)
		.setTitle(title)
		.setDescription(description)
		.setURL(teamtrees_url);
	teamTrees.getTotalTrees(true).then(function(data) {
		embed.addField('Trees planted:', data);

		teamTrees.getLeft().then(function(data) {
			embed.addField('Trees remaining:', data.treesLeft.amount.fixed);
			embed.addField('% of goal:', `${data.treesLeft.percent}%`);
			embed.addField('Days to 2020:', data.daysLeft);

			msg.channel.send(embed);
		});
	});
};

exports.teamtrees = {
	name: 'teamtrees',
	description: 'teamtrees command'
};
