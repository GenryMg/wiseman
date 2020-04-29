exports.run = (client, msg, args) => {
	if (!args[1]) return msg.reply('you did not provide any arguments. Try `wise emojify text`.');

	let text = args.slice(1, args.length).join(' ');
	let emojified = '';

	for (let character of text) {
		if (character.toLowerCase().match(/[a-z]/i)) emojified += `:regional_indicator_${character.toLowerCase()}:`;
		else if (character == ' ') emojified += '     ';
		else emojified += character;
	}

	msg.channel.send(emojified);
};

exports.emojify = {
	name: 'emojify',
	description: 'emojify command'
};
