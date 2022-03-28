require('dotenv').config();
const express = require('express');
const socket = require('socket.io');

const PORT = process.env.PORT || 5000;

const app = express();
const server = app.listen(PORT, function() {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

app.use(express.static("public"));

const botName = 'Socket Io Admin';

const io = socket(server, {
  allowEIO3: true
});

io.on("connection", function(socket) {

  console.log("Made socket connection");

  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to chatty app'));

    // broadcast when a user enter
    socket.broadcast
    .to(user.room)
    .emit(
      'message',
      formatMessage(botName, `${username} has joined the chat`)
    );

    // send users to room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // listened chat messages
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // leave chat per user
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      io.to(user.room).emit('roomUsers', {
        room: user.room, 
        users: getRoomUsers(user.room)
      });
    

    }

  });


});
