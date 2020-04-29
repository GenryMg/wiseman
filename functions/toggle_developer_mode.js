exports.run = function(callback) {
	const fs = require('fs');

	const file_path = 'developer_mode.txt';

	const after_reading = function(error, data) {
		if (error) return console.error(error);

		let developer_mode_enabled = 'false';

		if (data == 'false') developer_mode_enabled = 'true';
		else developer_mode_enabled = 'false';

		fs.writeFile(`${file_path}`, developer_mode_enabled, function(error) {
			if (error) console.error(error);
			callback(developer_mode_enabled);
		});
	};

	fs.readFile(`${file_path}`, 'utf8', after_reading);
};

exports.toggle_developer_mode = {
	name: 'toggle_developer_mode'
};
