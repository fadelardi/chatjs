var socket = io('/chatroom');

document.addEventListener('DOMContentLoaded', function() {
  var usersList = document.getElementById('users');
  var messages = document.getElementById('messages');
  var messageForm = document.getElementById('messageForm');
  var messageBox = document.getElementById('messageBox');
  messageForm.addEventListener('submit', function(e) {
    socket.emit('chat message', messageBox.value)
    messageBox.value = '';
    e.preventDefault();
    return false;
  });

  socket.on('chat message', function(m) {
    messages.innerHTML += '<li>' + m + '</li>';
  });

  socket.on('refresh users', function(users) {
    usersList.innerHTML = '';
    for (var i=0;i<users.length;i++) {
      usersList.innerHTML += '<li>' + users[i].name + '</li>';
    }
    usersList.innerHTML += '<li>Total users connected: ' + users.length + '</li>';
  })
});
