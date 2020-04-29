const Discord = require('discord.js');
const { stripIndents } = require('common-tags');
const { promptMessage } = require('../../functions.js');

module.exports = {
	name: 'ban',
	category: 'moderation',
	description: 'Bans the member',
	usage: '<id | mention>',
	run: async (client, msg, args, main_color) => {
		if (msg.deletable) msg.delete();

		// No args
		if (!args[0]) {
			return msg.reply('please provide a person to ban.').then(message => message.delete(5000));
		}

		// No reason
		if (!args[1]) {
			return msg.reply('please provide a reason to ban.').then(message => message.delete(5000));
		}

		// No author permissions
		if (!msg.member.hasPermission('BAN_MEMBERS')) {
			return msg.reply('❌ You do not have permissions to ban members. Please contact a staff member').then(message => message.delete(5000));
		}

		// No bot permissions
		if (!msg.guild.me.hasPermission('BAN_MEMBERS')) {
			return msg.reply('❌ I do not have permissions to ban members. Please contact a staff member').then(message => message.delete(5000));
		}

		const toBan = msg.mentions.members.first() || msg.guild.members.get(args[0]);

		// No member found
		if (!toBan) {
			return msg.reply("couldn't find that member, try again").then(message => message.delete(5000));
		}

		// Can't ban urself
		if (toBan.id === msg.author.id) {
			return msg.reply("you can't ban yourself...").then(message => message.delete(5000));
		}

		// Check if the user's bannable
		if (!toBan.bannable) {
			return msg.reply("I can't ban that person due to role hierarchy, I suppose.").then(message => message.delete(5000));
		}

		const promptEmbed = new Discord.RichEmbed()
			.setColor(main_color)
			.setAuthor(`This verification becomes invalid after 30s.`)
			.setDescription(`Do you want to ban ${toBan}?`);

		// Send the message
		await msg.channel.send(promptEmbed).then(async message => {
			// Await the reactions and the reaction collector
			const emoji = await promptMessage(message, msg.author, 30, ['✅', '❌']);

			// The verification stuffs
			if (emoji === '✅') {
				message.delete();

				toBan.ban(args.slice(1).join(' ')).catch(err => {
					if (err) return msg.channel.send(`well.... the ban didn't work out. Here's the error ${err}`);
				});
			} else if (emoji === '❌') {
				message.delete();

				msg.reply(`ban canceled.`).then(m => m.delete(10000));
			}
		});
	}
};
