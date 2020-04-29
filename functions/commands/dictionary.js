exports.run = (client, msg, args, main_color, some_random_api_url) => {
	if (!args[1]) return msg.reply('you did not provide any arguments.');

	const word = args.slice(1).join(' ');
	const url = `${some_random_api_url}dictionary?word=${word}`;

	const send_definition = function(data) {
		if (data.error) {
			if (data.error == 'Could not find word') msg.reply(`I could not find a definition for __${word}__.`);
			else console.log(`Error from dictionary command after fetching: ${data.error}`);
			return;
		}

		const Discord = require('discord.js');

		const title = `Definition for __${data.word}__:`;
		const description = data.definition;

		const embed = new Discord.RichEmbed()
			.setColor(main_color)
			.setTitle(title)
			.setDescription(description);
		msg.channel.send(embed);
	};

	try {
		let command_file = require('../fetch_data.js');
		command_file.run(url, send_definition);
	} catch (error) {
		console.error(error);
	}
};

exports.dictionary = {
	name: 'dictionary',
	description: 'dictionary command'
};
