exports.run = (msg, image_type, file_type, some_random_api_url) => {
	const user = msg.mentions.users.first() || msg.author;
	const url = `${some_random_api_url}beta/${image_type}?avatar=${user.displayAvatarURL}`;
	msg.channel.send('', { files: [{ attachment: url, name: `${image_type}.${file_type}` }] });

	/*const Discord = require('discord.js');
    let avatar_url = '';
	if (!args[1]) avatar_url = msg.author.displayAvatarURL;
	else if (args[1].match(/^<@!?(\d+)>$/)) {
		const matches = args[1].match(/^<@!?(\d+)>$/);
		const id = matches[1];
		const user = new Discord.User(client, client.users.get(id));

		avatar_url = user.displayAvatarURL;
	} else avatar_url = args[1];
	const image_url = `${some_random_api_beta_url}${image_type}?avatar=${avatar_url}`;
	//const attachment = new Discord.Attachment(image_url);
	//console.log(attachment);
	//msg.channel.send(attachment);
	const embed = new Discord.RichEmbed().setColor(main_color).setImage(image_url);
	msg.channel.send(embed);*/
};

exports.handle_some_random_api_image = {
	name: 'handle_some_random_api_image'
};
