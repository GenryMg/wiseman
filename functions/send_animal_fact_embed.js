exports.run = (data, msg, animal_info, main_color) => {
	const Discord = require('discord.js');

	if (!data) return msg.reply(`I'm sorry, but I could not get a ${animal_info} for you. Try again please.`);

	const embed = new Discord.RichEmbed()
		.setTitle(`${animal_info.charAt(0).toUpperCase() + animal_info.slice(1)}!`)
		.setColor(main_color)
		.setDescription(data.fact);
	msg.channel.send(embed);
};

exports.send_animal_fact_embed = {
	name: 'send_animal_fact_embed'
};
