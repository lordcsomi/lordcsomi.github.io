const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

server.listen(3000, function () {
  console.log('listening on *:3000');
});


// teszt passed
