exports.run = (client, msg, args, main_color) => {
	const Discord = require('discord.js');

	const send_google = function(search_results, [msg, search_terms, nsfw]) {
		if (!search_results) return msg.reply('something went wrong. Please try again.');
		const total_results = search_results.queries.request.totalResults;
		if (total_results == 0) return msg.reply('no results were found.');

		const items = search_results.items;
		//const google_page = `https://google.com/search?q=${search_terms.replace(' ', '%20')}`; //SEARCH RESULTS ON GOOGLE OFFICIAL SEARCH PAGE
		const google_page = `https://cse.google.com/cse?cx=${process.env.CUSTOM_GOOGLE_SEARCH_ENGINE}&q=${search_terms.replace(' ', '%20')}`; //SEARCH RESULTS ON CUSTOM SEARCH PAGE
		const search_information = search_results.searchInformation;
		const formatted_search_time = search_information.formattedSearchTime;
		const formatted_total_results = search_information.formattedTotalResults;

		let embed_title = `Search results for __${search_terms}__`;
		if (nsfw) embed_title += ' (non NSFW results)';
		else embed_title += ' (NSFW results)';
		const embed_description = `[Google results page](${google_page})\nAbout ${formatted_total_results} results (${formatted_search_time} seconds)`;

		let embed = new Discord.RichEmbed()
			.setColor(main_color)
			.setTitle(embed_title)
			.setDescription(embed_description);
		for (let item of items) {
			const title = item.title;
			const link = item.link;
			embed.addField(title, link);
		}

		msg.channel.send(embed);
	};

	//https://www.googleapis.com/customsearch/v1?q=google&cx=process.env.CUSTOM_GOOGLE_SEARCH_ENGINE&key=process.env.GOOGLE_SEARCH_API_KEY
	if (!args[1]) return msg.reply('you did not provide any search terms. Try `wise google search terms`.');

	const search_terms = args.slice(1).join(' ');
	const search_engine = process.env.CUSTOM_GOOGLE_SEARCH_ENGINE;
	const api_key = process.env.GOOGLE_SEARCH_API_KEY;
	let google_search_api_url = `https://www.googleapis.com/customsearch/v1?q=${search_terms}&cx=${search_engine}&key=${api_key}`;
	let nsfw = false;
	if (!msg.channel.nsfw) nsfw = true;
	if (nsfw) google_search_api_url += '&safe=active';

	try {
		let command_file = require('../fetch_data.js');
		return command_file.run(google_search_api_url, send_google, [msg, search_terms, nsfw]);
	} catch (error) {
		//console.error(error);
	}
};

exports.google = {
	name: 'google',
	description: 'google command'
};