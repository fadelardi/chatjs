var socket = io('/chatroom');

document.addEventListener('DOMContentLoaded', function() {
  //Get all elements in the chat that will be manipulated
  var usersList = document.getElementById('users');
  var messages = document.getElementById('messages');
  var messageForm = document.getElementById('messageForm');
  var messageBox = document.getElementById('messageBox');
  //Action for when we type a message
  messageForm.addEventListener('submit', function(e) {
    socket.emit('chat message', { data: messageBox.value, type: '' });
    messageBox.value = '';
    e.preventDefault();
    return false;
  });

  //Message handling logic
  socket.on('chat message', function(messageObj) {
    var messageClass = '';
    var messagePreffix = '';
    var messageSuffix = '';

    switch(messageObj.type) {
      case 'join':
        messageClass = 'class="join"';
        messageSuffix = ' has joined.';
        break;
      case 'leave':
        messageClass = 'class="leave"';
        messageSuffix = ' has left.';
        break;
      default:
        messagePreffix = '<span class="message-header">' + messageObj.username + ':</span> ';
    }
    messages.innerHTML += '<li ' + messageClass  +'>' + messagePreffix + messageObj.data + messageSuffix + '</li>';
  });

  //Refreshing the user list
  socket.on('refresh users', function(users, current) {
    var userClass = '';
    usersList.innerHTML = '';
    usersList.innerHTML += '<li class="total">ACTIVE USERS (' + users.length + ')</li>';
    for (var i=0;i<users.length;i++) {
      userClass = (users[i].name == current) ? 'class="current"' : '';
      usersList.innerHTML += '<li ' + userClass + '>' + users[i].name + '</li>';
    }
  })
});
