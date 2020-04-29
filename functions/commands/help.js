exports.run = (client, msg, args, main_color) => {
	const Discord = require('discord.js');

	const data = require('../../bot_commands.json');

	if (!data) return console.log('an error occurred');

	const categories_values = Object.values(data.categories);
	const categories_keys = Object.keys(data.categories);

	if (!args[1]) {
		const title = 'Wiseman Commands';

		let embed = new Discord.RichEmbed().setColor(main_color).setTitle(title);

		for (let i = 0; i < categories_values.length; i++) {
			const emoji = Object.values(categories_values[i])[1];
			const category_name_first_letter_uppercase = categories_keys[i][0].toUpperCase() + categories_keys[i].slice(1);
			const category_name_lowercase = category_name_first_letter_uppercase.toLowerCase();
			embed.addField(`${emoji}  ${category_name_first_letter_uppercase}`, `\`wise help ${category_name_lowercase}\``, true);
		}

		msg.channel.send(embed);
	} else {
		const category_or_command = args
			.slice(1)
			.join(' ')
			.toLowerCase();
		for (let i = 0; i < categories_values.length; i++) {
			const category = categories_keys[i].toLowerCase();
			if (category == category_or_command) {
				const commands = Object.values(categories_values[i])[0].sort();

				const title = `Commands for the category __${category}__:`;
				let description = '';
				for (let i = 0; i < commands.length; i++) {
					description += `${commands[i]}, `;
				}
				description = description.slice(0, description.length - 2);
				//const footer = 'Do wise help command to get more info about a specific command.';

				const embed = new Discord.RichEmbed()
					.setColor(main_color)
					.setTitle(title)
					.setDescription(description);

				return msg.channel.send(embed);
			}
		}
		//category does not exist
		return msg.reply('that category does not exist.');
	}
};

exports.help = {
	name: 'help',
	description: 'help command'
};
