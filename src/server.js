var socketio = require('socket.io');
var config = require('./serverConfig');
var moment = require('moment');

var io = socketio.listen(config.port);


io.sockets.on('connection', function (socket) {

	//create a new chatroom
	socket.on('create-room', function (room, username) {
		socket.join(room);
		socket.broadcast.to(room).emit('join-room', '${getTimestamp()}: ${username} has joined the chat.');
	});

	socket.on('join-room', function (room, username) {
		socket.join(room);
		socket.broadcast.to(room).emit('join-room', '${getTimestamp()}: ${username} has joined the chat.');
	});

	socket.on('leave-room', function (room, username) {
		socket.leave(room, function(err) {
			console.log(err);
		});
	});

	socket.on('send', function (room, username, message) {
		io.in(room).emit('message', "${getTimestamp} - ${username}: ${message}");
	});

});

function getTimestamp(){
	return moment.format('MMMM Do YYYY h:mm:ss a');
}