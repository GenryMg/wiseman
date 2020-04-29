exports.run = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	const random_int = Math.floor(Math.random() * (max - min + 1)) + min;
	return random_int;
};

exports.generate_random_int = {
	name: 'generate_random_int'
};
