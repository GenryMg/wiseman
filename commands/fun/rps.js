const Discord = require('discord.js');
const { promptMessage } = require('../../functions.js');

const chooseArr = ['🗻', '📰', '✂'];

module.exports = {
	name: 'rps',
	category: 'fun',
	description: 'Rock Paper Scissors game. React to one of the emojis to play the game.',
	usage: 'rps',
	run: async (client, msg, args, main_color) => {
		const embed = new Discord.RichEmbed().setColor(main_color).setDescription('Add a reaction to one of these emojis to play the game!');

		const message = await msg.channel.send(embed);
		const reacted = await promptMessage(message, msg.author, 30, chooseArr);

		const botChoice = chooseArr[Math.floor(Math.random() * chooseArr.length)];

		const getResult = function(me, clientChosen) {
			if ((me === '🗻' && clientChosen === '✂') || (me === '📰' && clientChosen === '🗻') || (me === '✂' && clientChosen === '📰')) {
				return 'You won!';
			} else if (me === clientChosen) {
				return "It's a tie!";
			} else {
				return 'You lost!';
			}
		};

		const result = getResult(reacted, botChoice);
		await message.clearReactions();

		embed.setDescription('').addField(result, `${reacted} vs ${botChoice}`);

		message.edit(embed);
	}
};
