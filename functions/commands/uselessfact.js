exports.run = (msg, main_color) => {

    const Discord = require('discord.js');
    const fetch = require("node-fetch");
    
    try {
    const res = await fetch("https://useless-facts.sameerkumar.website/api")
        .then(res => res.json())
        .then(json => {
          return json
        }); 
       

        const embed = new Discord.RichEmbed
        .setColor(main_color)
        .setTitle("To be honest why did you even run this command, you won't ever need these facts\nWelp, here's a very useless fact that you will probably never need in your life")
        .setField("Useless Fact", res.data)
        msg.reply(embed)

      } catch (error) {
        console.log(error);
      }
exports.uselessfact = {
	name: 'uselessfact',
	description: 'uselessfact command'
}
};