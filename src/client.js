var socketio = require('socket.io-client');
var config = require('../config/clientConfig');
var readline = require('readline');
var argv = require('yargs')
		.default('u', "anonymous")
		.default('r', "lobby")	
		.argv;


var socket = socketio.connect(config.serverURL);
var rl = readline.createInterface(process.stdin, process.stdout);

var username = argv.u; 
var room = argv.r;

socket.on('connect', function (data) {
	joinHandler(room);
	rl.prompt(true);
	rl.on('line', function (message) {
		messageHandler(message);
		//socket.emit('chat', room, username, message);
		rl.prompt(true);
	});
});

socket.on('chat', function (data) {
	console_out(data);
});

socket.on('join-room', function (data) {
	console_out(data);
});

socket.on('leave-room', function (data) {
	console_out(data);
});



//event handlers
function joinHandler(room) {
	socket.emit('join-room', room, username);
}

function leaveHandler() {
	socket.emit('leave-room', room, username);
	process.exit();
}

/*
TODO:
	refactor chat commands maybe?
	chat commands to: change name
					  join diff room
					  private message?
*/
function messageHandler(message) {
	switch (message) {
		case '/quit':
			leaveHandler();
			break;

		default:
			socket.emit('chat', room, username, message);
			break;
	}
}

function console_out(message) {
	process.stdout.cursorTo(0);
	process.stdout.clearLine();
	console.log(message);
	rl.prompt(true);
}