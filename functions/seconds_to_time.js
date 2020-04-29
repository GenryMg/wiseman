exports.run = total_seconds => {
	let days = Math.floor(total_seconds / 86400);
	let hours = Math.floor(total_seconds / 3600);
	total_seconds %= 3600;
	let minutes = Math.floor(total_seconds / 60);
	let seconds = Math.floor(total_seconds % 60);
	let time = '';
	if (days != 0) {
		if (days / 10 < 1) days = `0${days}`;
		time += `${days}:`;
	}
	if (hours != 0) {
		if (hours / 10 < 1) hours = `0${hours}`;
		time += `${hours}:`;
	}
	if (minutes / 10 < 1) minutes = `0${minutes}`;
	if (seconds / 10 < 1) seconds = `0${seconds}`;
	time += `${minutes}:${seconds}`;

	return time;
};

exports.seconds_to_time = {
	name: 'seconds_to_time'
};
