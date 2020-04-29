exports.run = (client, msg, args) => {
	if (args.length < 3) return msg.reply('you need to provide at least 2 numbers. Try `wise multiply number number [number] ...`.');

	const numbers = args.slice(1, args.length);
	let result = numbers[0];
	for (let i of numbers.slice(1)) {
		if (isNaN(parseFloat(i))) return msg.reply('you provided a non numeric argument. Try again please.');

		result *= parseFloat(i.replace(',', '.'));
	}
	let numbers_readable = '';
	for (let i of numbers) {
		numbers_readable += parseFloat(i) + ' * ';
	}
	numbers_readable = numbers_readable.slice(0, numbers_readable.length - 2);
	let answer = `${numbers_readable} = ${result}`;
	if (answer.length >= 1965) answer = `the result is ${result}`;
	msg.reply(answer);
};

exports.multiply = {
	name: 'multiply',
	description: 'multiply command'
};
