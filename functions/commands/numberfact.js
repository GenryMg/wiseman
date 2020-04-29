exports.run = (client, msg, args, main_color) => {
	const Discord = require('discord.js');
	const fetch = require('node-fetch');

	let numberfact_api_url = `http://numbersapi.com/random/`;
	if (args[1]) {
		if (args[1] == 'trivia' || args[1] == 'year' || args[1] == 'date' || args[1] == 'math') numberfact_api_url += args[1];

		if (!isNaN(args[1])) numberfact_api_url = numberfact_api_url.replace('random', args[1]);
		else if (!isNaN(args[2]) && args[1] != 'date') numberfact_api_url = numberfact_api_url.replace('random', args[2]);
		else if (!isNaN(args[2]) && !isNaN(args[3])) numberfact_api_url = numberfact_api_url.replace('random', `${args[2]}/${args[3]}`);
	}

	fetch(numberfact_api_url)
		.then(function(response) {
			if (!response.ok) throw Error(`Fetch response error: ${response.status}`);
			else return response.text();
		})
		.then(function(numberfact) {
			const title = 'Number fact!';
			const description = numberfact;
			if (description.length > 256) {
				if (description.length < 2000) msg.channel.send(description);
				return;
			}
			/*const url = numberfact_api_url.replace('http://numbersapi.com/', 'http://numbersapi.com/#');*/

			const embed = new Discord.RichEmbed()
				.setColor(main_color)
				.setTitle(title)
				.setDescription(description);
			/*.setURL(url);*/
			msg.channel.send(embed);
		})
		.catch(console.error);
};

exports.numberfact = {
	name: 'numberfact',
	description: 'numberfact command'
};
