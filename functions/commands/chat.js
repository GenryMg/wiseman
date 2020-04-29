exports.run = (client, msg, args) => {
	const send_chat = function(chat) {
		if (!chat) return msg.reply('The chat bot did not respond for an unknown reason. Try again please.');

		msg.channel.send(chat.response);
	};

	if (!args[1]) return msg.reply("You need to enter a message, try `wise chat 'message'`.");

	args = args.splice(1);
	let chat_message = '';
	for (let i of args) {
		chat_message += i + '%20';
	}
	chat_message.replace(/ /g, '%20');
	chat_message = chat_message.slice(0, chat_message.length - 3);

	const some_random_api_url = 'https://some-random-api.ml/';
	const api_url = `${some_random_api_url}chatbot/?message=${chat_message}`;
	try {
		let command_file = require('../fetch_data.js');
		return command_file.run(api_url, send_chat);
	} catch (error) {
		//console.error(error);
	}
};

exports.chat = {
	name: 'chat',
	description: 'chat command'
};
