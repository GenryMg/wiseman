exports.run = (client, msg) => {
	msg.reply(`pong! (${Math.floor(client.ping)}ms)`);
};

exports.ping = {
	name: 'ping',
	description: 'ping command'
};
