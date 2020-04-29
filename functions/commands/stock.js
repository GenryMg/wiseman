exports.run = (client, msg, args, main_color) => {
	const Discord = require('discord.js');

	const send_stock = function(stock_data) {
		if (!stock_data) return msg.reply("I'm sorry, but I could not get the stock data. Try again please.");
		if (stock_data['Error Message']) return msg.reply('something went wrong.');

		const meta_data = stock_data['Meta Data'];
		const meta_data_values = Object.values(meta_data);
		const time_series = stock_data[`Time Series (${args[2]})`];
		const time_series_values = Object.values(time_series);

		const latest_values = Object.values(time_series_values[0]);
		const open = latest_values[0];
		const high = latest_values[1];
		const low = latest_values[2];
		const close = latest_values[3];
		const volume = latest_values[4];

		const embed_title = 'Stock information for __' + meta_data_values[1] + '__';

		const embed = new Discord.RichEmbed()
			.setColor(main_color)
			.setTitle(embed_title)
			.setDescription(`Information: ${meta_data_values[0]}\nLast Refreshed: ${meta_data_values[2]}\nInterval: ${meta_data_values[3]}\nTime zone: ${meta_data_values[5]}`)
			.addField('Open', open)
			.addField('High', high)
			.addField('Low', low)
			.addField('Close', close)
			.addField('Volume', volume);
		msg.channel.send(embed);
	};

	if (!args[1] || !args[2]) return msg.reply("enter a stock and period, try `wise stock 'stock symbol' 'period'`.\n**stock symbol** example: msft\n**period** example: 1min");

	//https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=1min&apikey=demo
	const stock_api_url = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=' + args[1] + '&interval=' + args[2] + '&apikey=' + process.env.STOCK_API_KEY;

	try {
		let command_file = require('../fetch_data.js');
		return command_file.run(stock_api_url, send_stock);
	} catch (error) {
		//console.error(error);
	}
};

exports.meme = {
	name: 'meme',
	description: 'meme command'
};
