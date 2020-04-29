exports.run = (connection, msg, server, queue_loop, main_color) => {
	const Discord = require('discord.js');
	const ytdl = require('ytdl-core-discord');

	const play = async function() {
		/*const stream = await ytdl(server.queue[0], { filter: 'audioonly' });
		server.dispatcher = connection.playStream(stream);*/
		server.dispatcher = connection.playOpusStream(await ytdl(server.queue[0]), { type: 'opus' });
		server.nowPlaying = server.queue[0];
		if (!queue_loop) server.queue.shift();

		server.dispatcher.on('end', function() {
			if (server.queue[0]) play();
			else {
				connection.disconnect();
				const title = `The queue is empty. I left __${msg.member.voiceChannel.name}__.`;
				const embed = new Discord.RichEmbed().setColor(main_color).setTitle(title);
				msg.channel.send(embed);
			}
		});
	};

	play();
};

exports.play = {
	name: 'play'
};
