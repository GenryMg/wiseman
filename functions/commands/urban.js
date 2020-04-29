exports.run = (client, msg, args, main_color) => {
	const Discord = require('discord.js');

	if (!msg.channel.nsfw) return msg.reply('`wise urban` can only be used in NSFW channels.');

	const send_urban_definition = function(urban_definition, definition_number) {
		if (!urban_definition) return msg.reply('I was unable to get the definition for you. Try again please.');
		if (!urban_definition.list[0]) return msg.reply('no results were found.');

		let list_item = '';
		if (definition_number) {
			if (definition_number <= urban_definition.list.length) list_item = urban_definition.list[definition_number];
			else {
				list_item = urban_definition.list[urban_definition.list.length - 1];
				definition_number = urban_definition.list.length - 1;
			}
		} else list_item = urban_definition.list[0];
		const word = list_item.word;
		const definition = list_item.definition;
		const permalink = list_item.permalink;

		let title = `Definition of __${word}__`;
		if (definition_number) title += ` (definition ${definition_number + 1})`;
		title += ':';
		const footer = `👍 ${list_item.thumbs_up} 👎 ${list_item.thumbs_down}`;

		const embed = new Discord.RichEmbed()
			.setColor(main_color)
			.setTitle(title)
			.setDescription(definition)
			.setURL(permalink)
			.setFooter(footer);
		msg.channel.send(embed);
	};

	if (!args[1]) return msg.reply('you did not provide a search term, try `wise urban search terms [definition number]`');

	//http://api.urbandictionary.com/v0/define?term=
	const search_terms_array = args.splice(1, args.length);
	let search_terms = '';
	let definition_number = null;
	for (let i of search_terms_array) {
		if (parseInt(i)) {
			if (parseInt(i) > 0) definition_number = parseInt(i) - 1;
		} else search_terms += i + ' ';
		//if definition_number == 0 it can't parseInt() it for some reason and so adds it to search_terms
	}
	search_terms.trim();

	let urban_dictionary_url = `http://api.urbandictionary.com/v0/define?term=${search_terms}`;
	console.log(urban_dictionary_url);

	try {
		let command_file = require('../fetch_data.js');
		return command_file.run(urban_dictionary_url, send_urban_definition, definition_number);
	} catch (error) {
		//console.error(error);
	}
};

exports.urban = {
	name: 'urban',
	description: 'urban command'
};
