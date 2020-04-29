const Discord = require('discord.js');
const { stripIndents } = require('common-tags');
const { promptMessage } = require('../../functions.js');

module.exports = {
	name: 'kick',
	category: 'moderation',
	description: 'Kicks the member',
	usage: '<id | mention>',
	run: async (client, msg, args, main_color) => {
		if (msg.deletable) msg.delete();

		// No args
		if (!args[0]) {
			return msg.reply('please provide a person to kick.').then(message => message.delete(5000));
		}

		// No reason
		if (!args[1]) {
			return msg.reply('please provide a reason to kick.').then(message => message.delete(5000));
		}

		// No author permissions
		if (!msg.member.hasPermission('KICK_MEMBERS')) {
			return msg.reply('❌ You do not have permissions to kick members. Please contact a staff member').then(message => message.delete(5000));
		}

		// No bot permissions
		if (!msg.guild.me.hasPermission('KICK_MEMBERS')) {
			return msg.reply('❌ I do not have permissions to kick members. Please contact a staff member').then(message => message.delete(5000));
		}

		const toKick = msg.mentions.members.first() || msg.guild.members.get(args[0]);

		// No member found
		if (!toKick) {
			return msg.reply("couldn't find that member, try again").then(message => message.delete(5000));
		}

		// Can't kick urself
		if (toKick.id === msg.author.id) {
			return msg.reply("you can't kick yourself...").then(message => message.delete(5000));
		}

		// Check if the user's kickable
		if (!toKick.kickable) {
			return msg.reply("I can't kick that person due to role hierarchy, I suppose.").then(message => message.delete(5000));
		}

		const promptEmbed = new Discord.RichEmbed()
			.setColor(main_color)
			.setAuthor(`This verification becomes invalid after 30s.`)
			.setDescription(`Do you want to kick ${toKick}?`);

		// Send the message
		await msg.channel.send(promptEmbed).then(async message => {
			// Await the reactions and the reaction collector
			const emoji = await promptMessage(message, msg.author, 30, ['✅', '❌']);

			// The verification stuffs
			if (emoji === '✅') {
				message.delete();

				toKick.kick(args.slice(1).join(' ')).catch(err => {
					if (err) return msg.channel.send(`well.... the kick didn't work out. Here's the error ${err}`);
				});
			} else if (emoji === '❌') {
				message.delete();

				msg.reply(`kick canceled.`).then(m => m.delete(10000));
			}
		});
	}
};
