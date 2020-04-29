exports.run = (client, msg, args, main_color) => {
	const Discord = require('discord.js');

	const send_recipes = function(recipes, search_terms) {
		let title = '';
		if (!recipes) return msg.reply('something went wrong. Please try again.');

		if (recipes.results.length == 0) {
			title = `There are no results for __${search_terms}__.`;
			const embed = new Discord.RichEmbed().setColor(main_color).setTitle(title);
			msg.channel.send(embed);
			return;
		}

		const results = recipes.results;
		let five_first_results = [];
		if (results.length >= 5) five_first_results = results.slice(0, 5);
		else five_first_results = results;

		title = `Search results for __${search_terms}__:`;

		let embed = new Discord.RichEmbed().setColor(main_color).setTitle(title);
		for (let i of five_first_results) {
			const name = i.title;
			const value = `[link](${i.href})\n**Ingredients:** ${i.ingredients}`;
			embed.addField(name, value);
		}
		msg.channel.send(embed);
	};

	if (!args[1]) return msg.reply('you did not provide any arguments. Try `wise recipe search terms`.');

	const search_terms = args.slice(1, args.length).join(' ');
	//http://recipepuppy.com/api/?i=ingredient1,ingredient2&q=search terms&p=2
	const recipe_api_url = `http://recipepuppy.com/api/?q=${search_terms}`;
	try {
		let command_file = require('../fetch_data.js');
		return command_file.run(recipe_api_url, send_recipes, search_terms);
	} catch (error) {
		//console.error(error);
	}
};

exports.recipe = {
	name: 'recipe',
	description: 'recipe command'
};
