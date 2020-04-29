exports.run = (client, msg, args, main_color) => {
	const Discord = require('discord.js');

	if (!args[1]) return msg.reply('you did not provide any arguments.');
	//const possibilities = ['yes', 'no', 'maybe', 'probably yes', 'probably no'];
	const possibilities = ['It is certain.', 'It is decidedly so.', 'Without a doubt.', 'Yes - definitely.', 'You may rely on it.', 'As I see it, yes.', 'Most likely.', 'Outlook good.', 'Yes.', 'Signs point to yes.', 'Reply hazy, try again.', 'Ask again later.', 'Better not tell you now.', 'Cannot predict now.', 'Concentrate and ask again.', "Don't count on it.", 'My reply is no.', 'My sources say no.', 'Outlook not so good.', 'Very doubtful.'];
	let random_int = 0;
	try {
		let command_file = require(`../generate_random_int`);
		random_int = command_file.run(0, possibilities.length - 1);
	} catch (error) {
		//console.error(error);
	}

	const title = `My 8ball says...`;
	const description = possibilities[random_int];
	const embed = new Discord.RichEmbed()
		.setColor(main_color)
		.setTitle(title)
		.setDescription(description);
	msg.channel.send(embed);
};

exports.eight_ball = {
	name: '8ball',
	description: '8ball command'
};
