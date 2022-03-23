const express = require('express');
const socket = require('socket.io');

const PORT = 5000;
const app = express();
const server = app.listen(PORT, function() {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

app.use(express.static("public"));

const io = socket(server, {
  allowEIO3: true
});

const activeUsers = new Set();

io.on("connection", function(socket) {
  console.log("Made socket connection");

  // join chat per user
  socket.on("new user", function(data) {   
    socket.userId = data;
    activeUsers.add(data);
    io.emit("new user", [...activeUsers]);
  });

  // leave chat per user
  socket.on("disconnect", () => {
    activeUsers.delete(socket.userId);
    io.emit("user disconnected", socket.userId);
  });

  // chat message
  socket.on("chat message", function(data) {
    io.emit("chat message", data);
  });

  // live typing
  socket.on("typing", function(data) {
    socket.broadcast.emit("typing", data);
  });

});
