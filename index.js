'use strict';

//
//L I B R A R I E S
//
require('dotenv').config();
const fetch = require('node-fetch');
const Discord = require('discord.js');
const { Client, Collection } = require('discord.js');
const { config } = require('dotenv');
const ytdl = require('ytdl-core');
const client = new Client({
	disableEveryone: true
});
client.commands = new Collection();
client.aliases = new Collection();

config({
	path: __dirname + '/.env'
});

['command'].forEach(handler => {
	require(`./handlers/${handler}`)(client);
});
const fs = require('fs');

//
//C O N S T A N T S
//
const prefix = 'wise';
const develop_prefix = 'wised';
const main_color = '#ffd600';
const some_random_api_url = 'https://some-random-api.ml/';
const andhereismycode_url = 'https://and-here-is-my-code.glitch.me/';
const giphy_api_url = 'https://api.giphy.com/v1/gifs/';
const activity_types = ['PLAYING', 'STREAMING', 'LISTENING', 'WATCHING'];

//
//V A R I A B L E S
//
let restarting = false;
let restarting_msg = '';

let servers = {};
let queue_video_urls = [];
let queue_msg = '';
let queue_titles = [];
let queue_video_url_counter = 0;
let queue_page = 1;
let queue_loop = false;

//
//E X T R A  F U N C T I O N S  F O R  C O M M A N D S
//
/*
const check_queue = function(error, video_info) {
	if (error) return console.error(error);
	const title = video_info.title;
	queue_titles.push(title);
	queue_video_url_counter++;
	get_queue_titles();
};

const get_queue_titles = function() {
	if (queue_video_urls[queue_video_url_counter]) {
		const url = queue_video_urls[queue_video_url_counter];
		ytdl.getBasicInfo(url, check_queue);
	} else {
		if (queue_titles.length == 0) return queue_msg.reply('something went wrong. Please try again.');

		const total_pages = Math.ceil(servers[queue_msg.guild.id].queue.length / 5);
		let embed = new Discord.RichEmbed()
			.setColor(main_color)
			.setTitle('Queue:')
			.setFooter(`Page ${queue_page / 5} of ${total_pages}`);
		for (let i = 0; i < queue_titles.length; i++) {
			embed.addField(queue_titles[i], queue_video_urls[i]);
		}
		queue_msg.channel.send(embed);

		queue_titles = [];
		queue_video_urls = [];
	}
};

const get_queue = function() {
	let server = servers[queue_msg.guild.id];
	queue_page *= 5; //to get the 5 results of that page

	let queue_page_items = [];
	if (server.queue.length - queue_page >= 5) {
		queue_page_items = server.queue.slice(queue_page - 5, queue_page);
		console.log('1');
	} else queue_page_items = server.queue.slice(queue_page - server.queue.length - queue_page, queue_page);

	queue_video_urls = queue_page_items;
	get_queue_titles();
};
*/

const add_video_to_queue = async function(search_results, msg) {
	if (!search_results) return msg.reply('something went wrong. Please try again.');

	let results_per_page = search_results.pageInfo.resultsPerPage;
	if (results_per_page == 0) return msg.reply('no results were found.');

	const video_id = search_results.items[0].id.videoId;
	const video_url = `https://youtu.be/${video_id}`;

	const validate_url = await ytdl.validateURL(video_url);
	if (!validate_url) return msg.reply('something went wrong. Please try again.');

	if (!servers[msg.guild.id]) {
		servers[msg.guild.id] = {
			queue: []
		};
	} else if (!servers[msg.guild.id].queue) servers[msg.guild.id].queue = [];
	let server = servers[msg.guild.id];
	server.queue.push(video_url);

	const title = 'Added 1 video to the queue.';
	const embed = new Discord.RichEmbed().setColor(main_color).setTitle(title);
	msg.channel.send(embed);
	if (!msg.guild.voiceConnection) {
		msg.member.voiceChannel
			.join()
			.then(function(connection) {
				try {
					let command_file = require(`./functions/play.js`);
					command_file.run(connection, msg, server, queue_loop, main_color);
				} catch (error) {
					console.error(error);
				}
			})
			.catch(err => console.error('Error from ytdl: ' + err));
	}
};

const get_video_url = function(msg, search_terms) {
	const search_url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${search_terms}&type=video&key=${process.env.YOUTUBE_DATA_API_KEY}`;
	try {
		let command_file = require('./functions/fetch_data.js');
		command_file.run(search_url, add_video_to_queue, msg);
	} catch (error) {
		console.error(error);
	}
};

const send_reddit = function(reddit, msg) {
	if (!reddit) return msg.reply('an error occurred. Please try again.');
	else if (reddit.data.children.length == 0) return msg.reply('the provided subreddit is invalid. Please try again.');

	const children = Object.values(reddit.data.children);
	let children_0 = children[0].data;

	if (!servers[msg.guild.id]) servers[msg.guild.id] = {};
	let server = servers[msg.guild.id];
	if (!server.reddit) server.reddit = {};
	const subreddit = children_0.subreddit;
	server.reddit[subreddit] = reddit.data.after;

	const nsfw = children_0.over_18;
	if (nsfw && !msg.channel.nsfw) return msg.reply('you are trying to get an NSFW image in a non-NSFW channel.');
	else if (!nsfw && msg.channel.nsfw) return msg.reply('you are trying to get a non NSFW image in an NSFW channel.');

	const subreddit_prefixed = children_0.subreddit_name_prefixed;
	const title = children_0.title;
	const image_url = children_0.url;
	const post_url = `https://reddit.com${children_0.permalink}`;
	const author = `u/${children_0.author}`;

	let embed = new Discord.RichEmbed()
		.setColor(main_color)
		.setTitle(title)
		.setFooter(subreddit_prefixed)
		.setURL(post_url)
		.setAuthor(author);

	if (children_0.is_video) {
		embed = new Discord.MessageEmbedVideo();
		embed.setURL(image_url);
	}
	if (!children_0.is_video) {
		if (children_0.post_hint != 'image') embed.setDescription(image_url);
		else embed.setImage(image_url);
	}

	msg.channel.send(embed);
};

const check_voicechannel = function(msg) {
	if (!msg.guild.voiceConnection) msg.reply("I'm not in a voice channel.");
	else if (!msg.member.voiceChannel) msg.reply('you are not in a voice channel.');
	else if (msg.guild.me.voiceChannelID != msg.member.voiceChannelID) msg.reply('we are not in the same voice channel.');
	else return true;

	return false;
};

const send_giphy = function(giphy, msg) {
	if (!giphy) return msg.reply('I was unable to get you a giphy. Try again please.');

	let giphy_data = '';
	if (giphy.data[0]) giphy_data = giphy.data[0];
	else giphy_data = giphy.data;

	const giphy_title = giphy_data.title;
	const giphy_original_url = giphy_data.images.original.url;
	const giphy_url = giphy_data.url;

	const embed = new Discord.RichEmbed()
		.setColor(main_color)
		.setTitle(giphy_title)
		.setURL(giphy_url)
		.setImage(giphy_original_url);
	msg.channel.send(embed);
};

const handle_giphy_search = function(msg, args) {
	//https://api.giphy.com/v1/gifs/search?api_key=process.env.GIPHY_API_KEY&q=query&limit=1&offset=0&rating=G&lang=en
	if (!args[2]) return msg.reply('you did not provide a search query. Try `wise giphy search query`.');

	const query = args[2];
	const giphy_url = giphy_api_url + 'search?api_key=' + process.env.GIPHY_API_KEY + '&q=' + query + '&limit=1&offset=0&rating=G&lang=en';
	try {
		let command_file = require('./functions/fetch_data.js');
		command_file.run(giphy_url, send_giphy, msg);
	} catch (error) {
		console.error(error);
	}
};

const handle_giphy_id = function(msg, args) {
	if (!args[2]) return msg.reply('you did not provide an ID. Try `wise giphy id id`.');

	//https://api.giphy.com/v1/gifs/id?api_key=process.env.GIPHY_API_KEY
	//139eZBmH1HTyRa
	const id = args[2];
	const giphy_url = giphy_api_url + '' + id + '?api_key=' + process.env.GIPHY_API_KEY;
	try {
		let command_file = require('./functions/fetch_data.js');
		command_file.run(giphy_url, send_giphy, msg);
	} catch (error) {
		console.error(error);
	}
};

const handle_giphy_random = function(msg, args) {
	//https://api.giphy.com/v1/gifs/random?api_key=process.env.GIPHY_API_KEY&tag=meme&rating=G
	let tag = '';
	if (args[2]) tag = args.slice(2, args.length);

	const giphy_url = giphy_api_url + 'random?api_key=' + process.env.GIPHY_API_KEY + '&tag=' + tag + '&rating=G';
	try {
		let command_file = require('./functions/fetch_data.js');
		command_file.run(giphy_url, send_giphy, msg);
	} catch (error) {
		console.error(error);
	}
};

const handle_giphy_trending = function(msg) {
	//https://api.giphy.com/v1/gifs/random?api_key=process.env.GIPHY_API_KEY&limit=1&rating=G
	const giphy_url = giphy_api_url + 'trending?api_key=' + process.env.GIPHY_API_KEY + '&limit=1&rating=G';
	try {
		let command_file = require('./functions/fetch_data.js');
		command_file.run(giphy_url, send_giphy, msg);
	} catch (error) {
		console.error(error);
	}
};

const process_playlist = async function(playlist, [msg, video_urls_total, invalid_urls_total]) {
	if (!playlist) return msg.reply('the data could not be retrieved. Try again please.');

	const items = playlist.items;
	let video_urls = [];
	for (let i of items) {
		if (i.title != 'Deleted video' || i.title != 'This video is unavailable.') video_urls.push('https://youtu.be/' + i.contentDetails.videoId);
	}

	let server = servers[msg.guild.id];
	let invalid_urls = 0;
	for (let url of video_urls) {
		const validate_url = await ytdl.validateURL(url);
		if (!validate_url) invalid_urls++;
		else server.queue.push(url);
	}
	video_urls_total += video_urls.length;
	invalid_urls_total += invalid_urls;

	if (playlist.nextPageToken) {
		const playlist_id = items[0].snippet.playlistId;
		const page_token = playlist.nextPageToken;
		get_playlist_data(msg, playlist_id, page_token, video_urls_total, invalid_urls_total);
	} else {
		let title = `Added ${video_urls_total} videos to the queue`;
		if (invalid_urls == 0) title += '.';

		if (invalid_urls > 0) title += ` and there were ${invalid_urls_total} invalid videos.`;

		const embed = new Discord.RichEmbed().setColor(main_color).setTitle(title);
		msg.channel.send(embed);
	}
};

const get_playlist_data = function(msg, playlist_id, page_token = '', video_urls_total = 0, invalid_urls_total = 0) {
	const playlist_api_url = `https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=snippet,contentDetails&playlistId=${playlist_id}&key=${process.env.YOUTUBE_DATA_API_KEY_2}&pageToken=${page_token}`;
	//https://www.googleapis.com/youtube/v3/playlistItems?maxResults=25&part=snippet,contentDetails&playlistId=PLNpwiseK3355XzVECwP7RmIn6WddGxZrP6z&key=process.env.YOUTUBE_DATA_API_KEY&pageToken=
	try {
		let command_file = require('./functions/fetch_data.js');
		command_file.run(playlist_api_url, process_playlist, [msg, video_urls_total, invalid_urls_total]);
	} catch (error) {
		console.error(error);
	}
};

//
//C O M M A N D S
//
const handle_queue_command = function(msg, args) {
	/*
	if you uncomment this, also uncomment the following functions: get_queue, get_queue_titles, and check_queue
	let must_get_queue = false;
	let must_get_queue_with_page = false;
	if (!args[1]) must_get_queue = true;
	else if (!isNaN(args[1])) {
		must_get_queue = true;
		must_get_queue_with_page = true;
	}

	if (must_get_queue) {
		if (!servers[msg.guild.id]) return msg.reply('the queue is empty.');
		let server = servers[msg.guild.id];
		if (!server.queue) return msg.reply('the queue is empty.');
		if (!server.queue[0]) return msg.reply('the queue is empty.');

		if (must_get_queue_with_page) {
			if (!Number.isInteger(parseInt(args[1]))) return msg.reply('you provided an invalid page number.');
			if (Math.sign(args[1]) == -1) return msg.reply('you provided an invalid page number.');
			if (args[1] == 0) return msg.reply('you provided an invalid page number.');
		} else queue_page = args[1];
		queue_msg = msg;
		return get_queue();
	}*/

	switch (args[1]) {
		case 'length':
			queue_length(msg);
			break;

		case 'clear':
			clear_queue(msg);
			break;

		default:
			msg.reply('you provided an invalid argument. Try `queue length` or `queue clear`.');
	}
};

const handle_reddit_command = function(msg, args) {
	if (!args[1]) return msg.reply('you did not provide any arguments. Try `wise reddit subreddit`.');

	const subreddit = args[1];
	/*let sort = '';
	if (args[2]) sort = args[2];*/

	//const reddit_api_url = `https://api.reddit.com/r/${subreddit}/${sort}`;
	let after = '';
	if (servers[msg.guild.id]) {
		if (servers[msg.guild.id].reddit) {
			if (servers[msg.guild.id].reddit[subreddit]) after = servers[msg.guild.id].reddit[subreddit];
		}
	}
	const reddit_api_url = `https://api.reddit.com/r/${subreddit}?limit=1&after=${after}`;
	try {
		let command_file = require('./functions/fetch_data.js');
		command_file.run(reddit_api_url, send_reddit, msg);
	} catch (error) {
		console.error(error);
	}
};

const handle_guilds_command = function(msg) {
	const description = client.guilds
		.array()
		.map(g => g.name)
		.sort();
	const footer = `Total: ${client.guilds.size} servers`;

	const embed = new Discord.RichEmbed()
		.setColor(main_color)
		.setTitle("Guilds I'm in")
		.setDescription(description)
		.setFooter(footer);

	msg.channel.send(embed);
};

const handle_restart_command = function(msg) {
	msg.channel
		.send("I'm restarting...")
		.then(client.destroy())
		.then(function() {
			//reset all global variables that may have been changed
			//EXCEPT RESTARTING AND RESTARTING_MSG
			servers = {};
			queue_video_urls = [];
			queue_msg = '';
			queue_titles = [];
			queue_video_url_counter = 0;
			queue_page = 1;
			queue_loop = false;
		})
		.then(function() {
			restarting = true;
			restarting_msg = msg;
		})
		.then(client.login(process.env.BOT_TOKEN));
};

const handle_status_command = function(msg, args) {
	if (!args[2]) return msg.reply('you did not provide a status type. Try `wise bot status type bot status`.');

	const type = args[2].toUpperCase();
	let url = '';
	let status = '';
	if (type == activity_types[1]) {
		if (!args[2]) return msg.reply('you did not provide a url. Try `wise bot status type url bot status`.');
		else if (!args[3]) return msg.reply('you did not provide a status. Try `wise bot status type url bot status`.');

		url = args[3];
		try {
			new URL(url);
		} catch (_) {
			return msg.reply('you provided an invalid URL. Please try again.');
		}
		status = args.slice(4, args.length);
	} else status = args.slice(3, args.length);

	if (!args[3] && type != activity_types[1]) return msg.reply('you did not provide a status. Try `wise bot status type bot status`.');

	if (!activity_types.includes(type)) return msg.reply('you provided an invalid status type. Please try again.');

	status = status.join(' ');
	if (type != activity_types[1]) client.user.setActivity(status, { type: type });
	else client.user.setActivity(status, { type: type, url: url });
};

const handle_bot_command = function(msg, args) {
	if (msg.author.id != '504198229492236309') return;
	const bot_commands = ['status', 'restart', 'guilds'];
	if (!args[1]) {
		const title = 'No argument was provided, use one of these:';
		let embed = new Discord.RichEmbed().setColor(main_color).setTitle(title);
		let description = '';
		for (let command of bot_commands) {
			description += `${command}\n`;
		}
		embed.setDescription(description);

		return msg.channel.send(embed);
	}

	switch (args[1]) {
		case bot_commands[0]:
			handle_status_command(msg, args);
			break;

		case bot_commands[1]:
			handle_restart_command(msg);
			break;

		case bot_commands[2]:
			handle_guilds_command(msg);
			break;

		default:
			return msg.reply('you provided an invalid argument.');
	}
};

const handle_loop_command = function(msg) {
	if (!servers[msg.guild.id]) return msg.reply('the queue is empty.');

	if (!check_voicechannel(msg)) return;

	queue_loop = !queue_loop;

	let title = 'Loop enabled.';
	if (!queue_loop) title = 'Loop disabled.';

	const embed = new Discord.RichEmbed().setColor(main_color).setTitle(title);
	msg.channel.send(embed);
};

const handle_pause_command = function(msg) {
	if (!check_voicechannel(msg)) return;

	if (!servers[msg.guild.id]) return msg.reply('the queue is empty.');

	let server = servers[msg.guild.id];
	if (!server.dispatcher) return msg.reply("I'm not playing anything.");

	if (server.dispatcher.paused) return msg.reply('the song is already paused.');

	server.dispatcher.pause();

	const title = 'Paused the current song.';
	const embed = new Discord.RichEmbed().setColor(main_color).setTitle(title);
	msg.channel.send(embed);
};

const handle_resume_command = function(msg) {
	if (!check_voicechannel(msg)) return;

	if (!servers[msg.guild.id]) return msg.reply('the queue is empty.');

	let server = servers[msg.guild.id];
	if (!server.dispatcher) return msg.reply("I'm not playing anything.");

	if (!server.dispatcher.paused) return msg.reply('the current song is not paused.');

	server.dispatcher.resume();

	const title = 'Playing again.';
	const embed = new Discord.RichEmbed().setColor(main_color).setTitle(title);
	msg.channel.send(embed);
};

const handle_nowplaying_command = function(msg) {
	if (!servers[msg.guild.id]) return msg.reply('the queue is empty.');

	const server = servers[msg.guild.id];
	if (!server.nowPlaying) return msg.reply("I'm not playing anything.");

	const video_url = server.nowPlaying;
	ytdl
		.getBasicInfo(video_url)
		.then(function(video_info) {
			const video_details = video_info.player_response.videoDetails;

			const length_seconds = video_details.lengthSeconds;
			let video_length = 0;
			try {
				let command_file = require(`./functions/seconds_to_time.js`);
				video_length = command_file.run(length_seconds);
			} catch (error) {
				console.error(error);
			}
			let dispatcher_time = 0;
			try {
				let command_file = require(`./functions/seconds_to_time.js`);
				dispatcher_time = command_file.run(Math.ceil(server.dispatcher.time / 1000));
			} catch (error) {
				console.error(error);
			}

			const title = video_details.title;
			const description = `${dispatcher_time} / ${video_length}`;
			/*const footer = `${video_details.viewCount} views`;
			const author = video_details.author;
			const image = video_info.thumbnail_url.replace('default', 'maxresdefault');*/

			const embed = new Discord.RichEmbed()
				.setColor(main_color)
				.setTitle(title)
				.setDescription(description)
				.setURL(video_url);
			/*.setFooter(footer)
				.setAuthor(author)
			.setImage(image);*/
			msg.channel.send(embed);
		})
		.catch(console.error);
};

const queue_length = function(msg) {
	if (!servers[msg.guild.id]) return msg.reply('the queue is empty.');

	const server = servers[msg.guild.id];
	if (server.queue.length == 0 && !server.nowPlaying) msg.reply('the queue is empty.');
	else {
		let queue_length = server.queue.length;

		const title = `Queue length: ${queue_length}`;
		const embed = new Discord.RichEmbed().setColor(main_color).setTitle(title);
		msg.channel.send(embed);
	}
};

const handle_giphy_command = function(msg, args) {
	if (!args[1]) return msg.reply('you did not provide an endpoint. Try providing one of the following arguments: `trending`, `random [tag]`, `id "id"`, `search "query"`.');

	const endpoint = args[1];
	switch (endpoint) {
		case 'trending':
			handle_giphy_trending(msg);
			break;

		case 'random':
			handle_giphy_random(msg, args);
			break;

		case 'id':
			handle_giphy_id(msg, args);
			break;

		case 'search':
			handle_giphy_search(msg, args);
			break;

		default:
			msg.reply('you provided an invalid argument.');
	}
};

const handle_join_command = function(msg) {
	const voice_channel = msg.member.voiceChannel;
	if (!voice_channel) return msg.reply('you are not in a voice channel.');

	if (!msg.guild.voiceConnection) {
		voice_channel
			.join()
			.then(function() {
				const title = `I joined __${voice_channel.name}__.`;
				let embed = new Discord.RichEmbed().setColor(main_color).setTitle(title);

				let server = '';
				if (servers[msg.guild.id]) server = servers[msg.guild.id];

				let description = '';
				if (!server.queue) description = `The queue is empty.`;

				if (queue_loop) description += '\nLoop enabled.';
				else description += '\nLoop disabled.';

				embed.setDescription(description);

				msg.channel.send(embed);
			})
			.catch(console.error);
	} else return msg.reply("I'm already in a voice channel!");
};

const clear_queue = function(msg) {
	if (!check_voicechannel(msg)) return;

	if (!servers[msg.guild.id]) return msg.reply('the queue is already empty.');

	let server = servers[msg.guild.id];
	server.queue = [];
	if (!server.queue[0]) {
		const title = 'The queue has been cleared.';
		const embed = new Discord.RichEmbed().setColor(main_color).setTitle(title);
		msg.channel.send(embed);
	} else msg.reply('something went wrong, please try again.');
};

const handle_shuffle_command = function(msg) {
	if (!check_voicechannel(msg)) return;

	let server = servers[msg.guild.id];
	let queue = server.queue;
	var j, x, i;
	for (i = queue.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		x = queue[i];
		queue[i] = queue[j];
		queue[j] = x;
	}

	const title = 'Shuffled the queue.';
	const embed = new Discord.RichEmbed().setColor(main_color).setTitle(title);
	msg.channel.send(embed);
};

const handle_promote_command = function(msg) {
	if (!check_voicechannel(msg)) return;

	if (!servers[msg.guild.id]) return msg.reply('the queue is empty.');

	let server = servers[msg.guild.id];
	let queue = server.queue;
	if (!queue[0]) return msg.reply('the queue is empty.');
	else if (queue.length == 1) return msg.reply('there is only one song in the queue.');
	queue.unshift(queue[queue.length - 1]);
	queue.pop();

	const title = 'Promoted the last song from the queue.';
	const embed = new Discord.RichEmbed().setColor(main_color).setTitle(title);
	msg.channel.send(embed);
};

const handle_leave_command = function(msg) {
	if (!check_voicechannel(msg)) return;

	msg.guild.me.voiceChannel.leave();
	if (servers[msg.guild.id]) servers[msg.guild.id].nowPlaying = null;

	const title = `I left __${msg.member.voiceChannel.name}__.`;
	const embed = new Discord.RichEmbed().setColor(main_color).setTitle(title);
	msg.channel.send(embed);
};

const handle_skip_command = async function(msg) {
	if (!check_voicechannel(msg)) return;

	if (!servers[msg.guild.id]) return msg.reply('the queue is empty.');

	let server = servers[msg.guild.id];
	if (!server.queue) return msg.reply('the queue is empty.');
	else if (!server.queue[0]) msg.reply('the queue is empty.');
	if (server.dispatcher) await server.dispatcher.end();

	let title = 'Skipped the current song.';
	let embed = new Discord.RichEmbed().setColor(main_color).setTitle(title);
	/*if (!server.queue[0]) {
		title = 'The queue is now empty.';
		embed.setTitle(title);
	}*/
	msg.channel.send(embed);
};

const handle_play_command = async function(msg, args) {
	if (!msg.member.voiceChannel) return msg.reply('you are not in a voice channel.');
	if (!args[1]) {
		/*handle_join_command(msg);
		return;*/
		/*handle_resume_command(msg);
		return;
		*/
		msg.reply('please provide a URL or search terms.');
		return;
	}
	let url = args[1];

	const playlist_url = url.substring(0, 38);
	const playlist_id_length = 34;
	let is_playlist = false;
	if (playlist_url == 'https://www.youtube.com/playlist?list=') {
		if (url.length != playlist_url.length + playlist_id_length) return msg.reply('the provided URL is incorrect.');

		is_playlist = true;
	}
	let is_url = false;
	if (is_playlist) {
		const title = 'Adding videos to the queue...';
		const embed = new Discord.RichEmbed().setColor(main_color).setTitle(title);
		msg.channel.send(embed);
		const playlist_id = url.substring(url.length - playlist_id_length, url.length);
		await get_playlist_data(msg, playlist_id);
	} else {
		const validate_url = await ytdl.validateURL(url);
		if (!validate_url) {
			is_url = false;

			let search_terms_array = args.slice(1, args.length);
			let search_terms = '';
			for (let i of search_terms_array) {
				search_terms += i + ' ';
			}

			await get_video_url(msg, search_terms);
		} else is_url = true;
	}

	if (!servers[msg.guild.id]) {
		servers[msg.guild.id] = {
			queue: []
		};
	} else if (!servers[msg.guild.id].queue) servers[msg.guild.id].queue = [];

	let server = servers[msg.guild.id];

	if (!is_playlist) {
		if (!is_url) return;

		server.queue.push(url);
		const title = 'Added 1 video to the queue.';
		const embed = new Discord.RichEmbed().setColor(main_color).setTitle(title);
		msg.channel.send(embed);
	}
	if (!msg.guild.voiceConnection) {
		msg.member.voiceChannel
			.join()
			.then(function(connection) {
				try {
					let command_file = require(`./functions/play.js`);
					command_file.run(connection, msg, server, queue_loop, main_color);
				} catch (error) {
					console.error(error);
				}
			})
			.catch(err => console.error('Error from ytdl: ' + err));
	}
};

//
//M A I N  B O T  C O D E
//
client.on('ready', () => {
	console.info(`Logged in as ${client.user.tag}!\nRunning on ${client.guilds.size} server(s)!`);
	client.user.setActivity('Wiseman, Developed by GenryMg. v0.5 Beta. Wise Help', { type: activity_types[4] });
	if (restarting) {
		restarting_msg.channel.send("I'm back!");
		restarting = false;
	}
});

client.on('guildCreate', guild => {
	console.log(`I joined a new guild: <${guild.name}>. The total amount of guilds I'm in is now ${client.guilds.size}.`);
});

client.on('guildDelete', guild => {
	console.log(`I left a guild: <${guild.name}>. The total amount of guilds I'm in is now ${client.guilds.size}.`);
});

client.on('message', async msg => {
	if (msg.author.bot) return; //if the message is from another bot

	if (!msg.guild) return;

	if (!msg.member) msg.member = await msg.guild.fetchMember(msg);

	if (msg.channel.type == 'dm') return; //if the message is from dm

	if (!msg.guild.available) return msg.channel.send('There is a problem with this server.');

	//random funny replies
	const msgString = msg.toString();
	if (msgString.includes('wiseman is stupid')) msg.reply('not like you are any smarter <:wiseman:704855213630160957>');
	if (msgString.includes('wiseman is dumb')) msg.reply('<a:617645169038196757:704855939437690971>');
	if (msgString.includes('wiseman is not wise')) msg.reply('why is my name wiseman then? <:facesmack:692611285329772574>');
	if (msgString.includes('is genry a superpowered genius')) msg.reply('duh');

	const message = msgString
		.replace(/\s+/g, ' ')
		.split(' ');
	const check_prefix = message[0].toLowerCase();

	let developer_mode_enabled = 'false';

	const after_checking_developer_mode = function(error, data) {
		if (error) {
			console.error(error);
			return msg.reply('an error occurred.');
		}

		if (data) developer_mode_enabled = data;
		if (developer_mode_enabled == 'true' && check_prefix == prefix) return;
		else if (developer_mode_enabled == 'false' && check_prefix == develop_prefix) return;
		//console.log(developer_mode_enabled);

		if (!message[1]) return; //if the message is just 'wise' or 'wise ' or something like that

		if (!msg.guild.me.hasPermission('SEND_MESSAGES')) return msg.reply('I do not have send messages permission. Enable this at **Server Settings** > **Roles** > **Wiseman** > **Send Messages**.');
		if (!msg.guild.me.hasPermission('EMBED_LINKS')) return msg.reply('I do not have embed links permission. Enable this at **Server Settings** > **Roles** > **Wiseman** > **Embed Links**.');
		if (!msg.guild.me.hasPermission('ATTACH_FILES')) return msg.reply('I do not have attach files permission. Enable this at **Server Settings** > **Roles** > **Wiseman** > **Attach Files**.');
		//if (!msg.guild.me.hasPermission('READ_MESSAGE_HISTORY')) return msg.reply('I do not have read message history permission. Enable this at **Server Settings** > **Roles** > **Wiseman** > **Read Message History**.');
		if (!msg.guild.me.hasPermission('CONNECT')) return msg.reply('I do not have connect permission. Enable this at **Server Settings** > **Roles** > **Wiseman** > **Connect**.');
		if (!msg.guild.me.hasPermission('SPEAK')) return msg.reply('I do not have speak permission. Enable this at **Server Settings** > **Roles** > **Wiseman** > **Speak**.');

		const command = message[1].toLowerCase();
		let args = message.slice(1);
		args = msg.content
			.slice(prefix.length)
			.trim()
			.split(/ +/g);

		//log message
		try {
			let command_file = require('./functions/log_commands.js');
			command_file.run(msg);
		} catch (error) {
			console.error(error);
		}

		//developer commands
		if (developer_mode_enabled == 'true' && check_prefix == develop_prefix && msg.author.id == '157877645801947137') {
			//commands in seperate files
			try {
				let command_file = require(`./functions/commands/work_in_progress/${command}.js`);
				return command_file.run(client, msg, args, main_color);
			} catch (error) {
				//console.error(error);
			}

			//commands not in seperate files
			try {
				switch (command) {
					case 'test2':
						msg.reply('the developer test2 command works!');
						break;

					case 'develop':
						try {
							let command_file = require('./functions/commands/develop.js');
							return command_file.run(client, msg, args, main_color);
						} catch (error) {
							//console.error(error);
						}
						break;

					/*default:
					msg.reply('unknown command.');*/
				}
			} catch (error) {
				console.error(error);
			}

			return; //end of developer mode commands
		} else {
			//non developer mode commands
			//commands in seperate files
			const new_commands = ['ban', 'kick', 'rps'];
			if (new_commands.includes(command)) {
				try {
					const cmd = args.shift().toLowerCase();
					if (cmd.length === 0) return;
					let commandd = client.commands.get(cmd);
					if (!commandd) commandd = client.commands.get(client.aliases.get(cmd));
					if (commandd) return commandd.run(client, msg, args, main_color);
				} catch (error) {
					//console.error(error);
				}
			} else {
				try {
					let command_file = require(`./functions/commands/${command}.js`);
					return command_file.run(client, msg, args, main_color, some_random_api_url);
				} catch (error) {
					//console.error(error);
				}
			}

			//commands not in seperate files
			try {
				switch (command) {
					//BOT MODERATION COMMANDS
					case 'bot':
						handle_bot_command(msg, args);
						break;

					//MAIN COMMANDS
					case 'play':
						handle_play_command(msg, args);
						break;

					case 'skip':
						handle_skip_command(msg);
						break;

					case 'leave':
						handle_leave_command(msg);
						break;

					case 'promote':
						handle_promote_command(msg);
						break;

					case 'shuffle':
						handle_shuffle_command(msg);
						break;

					case 'join':
						handle_join_command(msg);
						break;

					case 'giphy':
						handle_giphy_command(msg, args);
						break;

					case 'nowplaying':
						handle_nowplaying_command(msg);
						break;

					case 'pause':
						handle_pause_command(msg);
						break;

					case 'resume':
						handle_resume_command(msg);
						break;

					case 'loop':
						handle_loop_command(msg);
						break;

					case 'reddit':
						handle_reddit_command(msg, args);
						break;

					case 'queue':
						handle_queue_command(msg, args);
						break;

					/*default:
						msg.reply('unknown command.');*/
				}
			} catch (error) {
				console.error(error);
			}
		}
	};

	if (check_prefix == develop_prefix || check_prefix == prefix) {
		fs.readFile('developer_mode.txt', 'utf8', after_checking_developer_mode);
	}
});

client.login(process.env.BOT_TOKEN);
