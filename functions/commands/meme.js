exports.run = (client, msg, args, main_color) => {
    const Discord = require('discord.js');

	const send_meme = function(meme, msg) {
		if (!meme) return msg.reply("I'm sorry, but I could not get a meme for you. Try again please.");

		if (meme.status_code == 500) return msg.reply(`the meme api is having some issues. Try again later please.\nerror code: ${meme.status_code}`);

		const embed = new Discord.RichEmbed()
			.setURL(meme.postLink)
			.setFooter('r/' + meme.subreddit)
			.setTitle(meme.title)
			.setImage(meme.url)
			.setColor(main_color);
		msg.channel.send(embed);
	};

	try {
		let command_file = require('../fetch_data.js');
		return command_file.run('https://meme-api.herokuapp.com/gimme', send_meme, msg);
	} catch (error) {
		//console.error(error);
	}
};

exports.meme = {
	name: 'meme',
	description: 'meme command'
};
