exports.run = msg => {
	const cd = new Date(); //current_datetime
	let day = cd.getDate().toString();
	let month = cd.getMonth() + 1;
	month = month.toString();
	const year = cd.getFullYear().toString();
	let hour = cd.getHours().toString();
	let minutes = cd.getMinutes().toString();
	let seconds = cd.getSeconds().toString();

	const append_leading_zero = function(number) {
		if (number.length == 1) return `0${number}`;
		else return number;
	};
	day = append_leading_zero(day);
	month = append_leading_zero(month);
	hour = append_leading_zero(hour);
	minutes = append_leading_zero(minutes);
	seconds = append_leading_zero(seconds);

	const formatted_datetime = `${day}-${month}-${year} ${hour}:${minutes}:${seconds}`;
	const data = `[${formatted_datetime}] ${msg.author.tag}: <${msg.toString()}> - ${msg.channel.name} (${msg.guild.name});`;
	console.log(data);

	const fs = require('fs');

	const file_path = 'commands_log.txt';

	fs.appendFile(file_path, `\n${data}`, function(error) {
		if (error) console.error(error);
	});
};

exports.log_commands = {
	name: 'log_commands'
};
