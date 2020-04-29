exports.run = (data, msg, animal_info, main_color) => {
	const Discord = require('discord.js');

	if (!data) return msg.reply(`I'm sorry, but I could not get the coronavirus status for you. Please try again later.`);

	const embed = new Discord.RichEmbed()
		.setTitle(`Live Coronavirus Status`)
		.setColor(main_color)
		.setDescription(`Here is the coronavirus status of today and yesterday`)
		.addField("Total Confirmed Cases", data.cases, true)
		.addField("Total Deaths", data.deaths, true)
		.addField("Total Recovered", data.recovered, true)
		.addField("Today Cases", data.todayCases, true)
		.addField("Today Deaths", data.todayDeaths, true)
		.addField("Active", data.active, true)
		.addField("Critical", data.critical, true)
		.addField("Cases Per One Million", data.casesPerOneMillion, true)
		.addField("Tests", data.tests, true)
		.addField("Tests Per One Million", data.testsPerOneMillion, true)
		.addField("Affected Countries", data.affectedCountries, true)
		.setFooter("Run `wise tips` for tips for avioding the coronavirus!")
	msg.channel.send(embed);
};

exports.send_animal_fact_embed = {
	name: 'send_animal_fact_embed'
};