exports.run = (client, msg, args) => {
	if (!args[1]) return msg.reply("you did not provide any arguments, try `wise choose 'option1' 'option2' '...'`");

	const options = args.slice(1, args.length);
	const max = Math.floor(options.length) - 1;
	let random_int = 0;
	try {
		let command_file = require('../generate_random_int.js');
		random_int = command_file.run(0, max);
	} catch (error) {
		//console.error(error);
		console.error('File "../generate_random_int.js" was not found.');
	}
	const result = options[random_int];
	msg.reply(`I picked ${result}`);
};

exports.choose = {
	name: 'choose',
	description: 'choose command'
};
