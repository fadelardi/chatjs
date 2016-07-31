var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on('connection', function(socket) {
  io.emit('refresh users', getUsers());
  socket.broadcast.emit('chat message', 'a user has connected');
  socket.on('disconnect', function() {
    io.emit('chat message', 'a user has disconnected');
  });

  socket.on('chat message', function(m) {
    io.emit('chat message', m);
  });
})

http.listen(3000, function() {
  console.log('listening on *:3000');
});

function getUsers() {
    var users = [];
    for (var prop in io.sockets.connected) {
      users.push(prop);
    }
    return users;
}
