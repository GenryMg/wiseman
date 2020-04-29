exports.run = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	const random_number = Math.round(Math.random() * (max - min) + min);
	return random_number;
};

exports.generate_random_number = {
	name: 'generate_random_number'
};
