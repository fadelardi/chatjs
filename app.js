var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

//Declaring some base actions for the app
app.use(bodyParser.urlencoded({ extended: false }))
app.set('views', './views');
app.set('view engine', 'pug');
app.use('/static', express.static(__dirname + '/static'));

//Object to handle aggregation/removal of users
var userList = {
  users : [],
  add: function(userObj) {
    this.users.push(userObj);
  },
  remove: function(name) {
    var foundIndex = -1;
    for (var i=0; i<this.users.length;i++) {
      if (this.users[i].name == name) {
        foundIndex = i;
        break;
      }
      this.users.splice(foundIndex, 1);
    }
  },
  get : function() { return this.users;  }
};

//Current username
var username;

// Setting up chatroom and related actions
var chatroom = io.of('/chatroom');
chatroom.on('connection', function(socket) {
  userList.add({id: socket.id, name: username});
  chatroom.emit('refresh users', userList.get(), username);
  socket.broadcast.emit('chat message', { data: username, type: 'join' });
  socket.on('disconnect', function() {
    userList.remove(username);
    chatroom.emit('refresh users', userList.get(), username);
    chatroom.emit('chat message', { data: username , type: 'leave' });
});

socket.on('chat message', function(messageObj) {
    messageObj.username = username;
    chatroom.emit('chat message', messageObj);
  });
});

//Routes
app.post('/chat', function(req, res, next) {
  username = req.body.username;
  next();
}, function(req, res) {
    res.render('chat');
});

app.get('/', function(req, res) {
  res.render('index');
});

//Setting up server
http.listen(3000, function() {
  console.log('Chat started on *:3000');
});

