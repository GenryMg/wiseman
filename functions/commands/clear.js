exports.run = (client, msg, args) => {
	if (!msg.member.hasPermission('MANAGE_MESSAGES')) return msg.reply('you are not allowed to use this command!');
	if (!msg.guild.me.hasPermission('MANAGE_MESSAGES')) return msg.reply('I do not have manage messages permission. Enable this at **Server Settings** > **Roles** > **Wiseman** > **Manage Messages**.');

	let amount = 10;
	if (args[1]) {
		if (Math.sign(args[1]) == -1 || !Number.isInteger(parseInt(args[1])) || isNaN(args[1]) || parseInt(args[1]) >= 100) {
			return msg.reply('the specified amount of messages should be a positive number (max 99)!');
		}
		amount = parseInt(args[1]);
	} /*else {
		//UNCOMMENT THIS IF THE COMMAND SHOULD NEED AN AMOUNT OF MESSAGES
		msg.reply('how many messages should be removed? Try `wise clear amount`.');
		return;
	}*/
	msg.channel.bulkDelete(amount).catch(console.error);
};

exports.clear = {
	name: 'clear',
	description: 'clear command'
};
