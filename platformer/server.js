const express = require('express');
const { Socket } = require('socket.io');
const os = require('os');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

server.listen(3000, function () {
  const ip = Object.values(os.networkInterfaces())
    .flatMap((iface) => iface.filter((info) => info.family === 'IPv4' && !info.internal))
    .map((info) => info.address)[0];

  console.log(`Server listening on http://${ip}:3000`);
});
//---------------------------------
// SETTINGS
//---------------------------------
validName = {
  'minLength': 3,
  'maxLength': 20,
  'anonymous': false,
  'allowedCharacters': 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_ -'
};
// server settings
const serverSettings = {
  'maxPlayers': 10,
  'maxSpectators': 10,
  'maxPlayersPerRoom': 4,
};

//---------------------------------
// GLOBAL VARIABLES
//---------------------------------
players = [];
userNames = [];
userInfos = [];
spectators = [];
rooms = [];
exampleplayer = {
  name: 'example',
  id: '0123456789',
  room: 'exampleRoom',
  width: 20,
  height: 20,
  color: 'red',
  x: 600,
  y: 0,
  dX: 0,
  dY: 0,
  left: false,
  right: false,
  jump: false,
  collision : {
    top: false,
    bottom: false,
    left: false,
    right: false
  },
  gravity: 9.81*0.1, 
  maxDX: 9, 
  maxDY: 50, 
  jumpForce: 10,
  acceleration: 0.8,
  friction: 0.9,
  grounded: false,
  jumping: false,
  doubleJumpingAllowed: true,
  doubleJumping: false,
  jumpCooldown: 0.3,
  wallJumpingLeft: false,
  wallJumpingRight: false,
  wallJumping: false,
  freemode: true,
};

exmapleUser = {
  name: 'example',
  id: '0123456789',
  ip: '123.456.789.012',
  screen: {
    width: 1920,
    height: 1080,
  },
    
};

// socket connection
io.on('connection', function (socket) {
  console.log('a user connected id:', socket.id, 'ip:', socket.handshake.address);
  const userAgent = socket.handshake.headers['user-agent'];
  const isMobile = /Mobile/.test(userAgent);
  console.log(`User-Agent: ${userAgent}`);
  console.log(`Is mobile: ${isMobile}`);

  // send initial data
  socket.emit('initialData', {
    'validName': validName,
  });

  // on setName
  socket.on('setName', function (name) {
    userNames.push(name);
    socket.emit('setName', name);
    players.push({
      name: name,
      id: socket.id,
      ip: socket.handshake.address,
      room: 'main',
      width: 20,
      height: 20,
      color: 'red',
      x: 600,
      y: 0,
      dX: 0,
      dY: 0,
      left: false,
      right: false,
      jump: false,
      collision : {
        top: false,
        bottom: false,
        left: false,
        right: false
      },
      gravity: 9.81*0.1,
      maxDX: 9,
      maxDY: 50,
      jumpForce: 10,
      acceleration: 0.8,
      friction: 0.9,
      grounded: false,
      jumping: false,
      doubleJumpingAllowed: true,
      doubleJumping: false,
      jumpCooldown: 0.3,
      wallJumpingLeft: false,
      wallJumpingRight: false,
      wallJumping: false,
      freemode: true,
    });
    //socket.join('main');
    //socket.emit('joinRoom', 'main');
    socket.emit('updatePlayers', players);
    socket.broadcast.emit('updatePlayers', players);
    socket.emit('startGame'); // for now testing
    console.log('user with id:', socket.id, 'and name:', name, 'and ip:', socket.handshake.address, 'connected');
  });

  
  // disconnect
  socket.on('disconnect', function () {
    if (players[socket.id] && players[socket.id].name && players[socket.id].ip) {
      console.log('user disconnected with id:', socket.id, 'and name:', players[socket.id].name, 'and ip:', players[socket.id].ip);
      userNames.splice(userNames.indexOf(players[socket.id].name), 1);
      players.splice(players.indexOf(players[socket.id]), 1);
      socket.broadcast.emit('updatePlayers', players);
    } else {
      console.log('user disconnected with id:', socket.id);
    }
  });

  // invalid positions
  socket.on('invalidPositions', function (invalidPositions) {
    invalidPositionsToFile('./temporary/invalidPositions.txt', invalidPositions, ';');
  });
});

//---------------------------------
// ERROR HANDLING
//---------------------------------
function invalidPositionsToFile(outputPath, invalidPositions, separator) {
  // example of invalidPositions: [{x:1, y:2, dX:3, dY:4, grounded:true, jumping:false, doubleJumping:false, wallJumpingLeft:false, wallJumpingRight:false, wallJumping:false, collision:{left:false, right:false, top:false, bottom:false}}, ...]
  const fs = require('fs');
  let output = '';
  output += `x${separator}y${separator}dX${separator}dY${separator}grounded${separator}jumping${separator}doubleJumping${separator}wallJumpingLeft${separator}wallJumpingRight${separator}wallJumping${separator}collision.left${separator}collision.right${separator}collision.top${separator}collision.bottom \n`;
  invalidPositions.forEach((pos) => {
    output += `${pos.x}${separator}${pos.y}${separator}${pos.dX}${separator}${pos.dY}${separator}${pos.grounded}${separator}${pos.jumping}${separator}${pos.doubleJumping}${separator}${pos.wallJumpingLeft}${separator}${pos.wallJumpingRight}${separator}${pos.wallJumping}${separator}${pos.collision.left}${separator}${pos.collision.right}${separator}${pos.collision.top}${separator}${pos.collision.bottom}
`;
  });
  fs.writeFileSync('./errors.txt', output);
}