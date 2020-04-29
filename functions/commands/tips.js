exports.run = (client, msg, args, main_color) => {

const Discord = require('discord.js');

const embed = new Discord.RichEmbed()
      .setAuthor("Tips from the World Health Organization")
      .setDescription(`
      - Wash your hands frequently.
      - Avoid touching your face.
      - Sneeze and cough into a tissue or your elbow.
      - Avoid crowds and standing near others.
      - Stay home if you think you might be sick.
      - If you have a fever, cough, or difficulty breathing, follow advice given by your government's health authority`)
      .setFooter("More information can be found on the CDC website: https://www.cdc.gov/coronavirus/2019-ncov/index.html")
      .setColor(main_color);

    msg.channel.send(embed);

    }

exports.say = {
	name: 'say',
	description: 'say command'
};
