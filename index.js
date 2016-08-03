var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var chatroom = io.of('/chatroom');
chatroom.on('connection', function(socket) {
chatroom.emit('refresh users', getUsers());
socket.broadcast.emit('chat message', 'a user has connected');
socket.on('disconnect', function() {
  chatroom.emit('chat message', 'a user has disconnected');
});

socket.on('chat message', function(m) {
  chatroom.emit('chat message', m);
});
});

function getUsers() {
    var users = [];
    for (var prop in chatroom.connected) {
      users.push(prop);
    }
    return users;
}

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get('/chat', function(req, res) {
  res.sendFile(__dirname + "/chat.html");
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});

