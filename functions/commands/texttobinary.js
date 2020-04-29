exports.run = (client, msg, args, main_color) => {
	const Discord = require('discord.js');

	const send_binary = async function(binary) {
		if (!binary.binary) return msg.reply('an error occurred. Please try again.');

		let description = binary.binary;
		if (description.length > 256) {
			msg.reply("the binary result is longer than 256 characters - that's too long.");
			return;
			/*const file_path = 'texttobinary_temp.txt';
            fs.writeFile(file_path, description, function(err) {
                if (err) throw err;
                console.log('written to file');
            });
    
            const attachment = new Discord.Attachment(file_path);
            fs.unlink(file_path, function(err) {
                if (err) throw err;
                console.log('file deleted');
            });
            msg.channel.send(attachment);*/
		} else {
			const title = 'Binary:';
			const embed = new Discord.RichEmbed()
				.setColor(main_color)
				.setTitle(title)
				.setDescription(description);
			msg.channel.send(embed);
		}
	};

	if (!args[1]) return msg.reply('you did not provide any arguments. Try `wise texttobinary text`.');

	const text = args.slice(1, args.length).join(' ');
	const some_random_api_url = 'https://some-random-api.ml/';
	const texttobinary_api_url = `${some_random_api_url}binary?text=${text}`;
	try {
		let command_file = require('../fetch_data.js');
		return command_file.run(texttobinary_api_url, send_binary);
	} catch (error) {
		//console.error(error);
	}
};

exports.texttobinary = {
	name: 'texttobinary',
	description: 'texttobinary command'
};
