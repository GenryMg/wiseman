exports.run = (client, msg, args) => {
	if (args.length == 1) return msg.reply("you did not provide any arguments, try `wise random 'minimum' 'maximum'`.");
	else if (args.length == 2) return msg.reply("you provided only 1 argument, try `wise random 'minimum' 'maximum'`.");
	else if (isNaN(args[1]) || isNaN(args[2])) return msg.reply("one or more provided arguments are not a number, try `wise random 'minimum' 'maximum'`.");

	const min = args[1];
	const max = args[2];
	let random_number = 0;
	try {
		let command_file = require('../generate_random_number');
		random_number = command_file.run(min, max);
	} catch (error) {
		//console.error(error);
	}
	msg.reply(`I picked ${random_number}`);
};

exports.random = {
	name: 'random',
	description: 'random command'
};
