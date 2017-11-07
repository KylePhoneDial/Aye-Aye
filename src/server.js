var socketio = require('socket.io');
var config = require('../config/serverConfig');
var moment = require('moment');

var io = socketio.listen(config.port);


io.sockets.on('connection', function (socket) {

	socket.on('join-room', function (room, username) {
		socket.join(room);
		socket.broadcast.to(room).emit('join-room', `${getTimestamp()}: ${username} has joined the chat.`);
	});

	socket.on('leave-room', function (username) {
		socket.leave(room, function(err) {
		});

	});

	socket.on('chat', function (room, username, message) {
		io.in(room).emit('chat', `${getTimestamp()} - ${username}: ${message}`);
		console.log("chat");
	});

});

function getTimestamp() {
	return moment().calendar();
}