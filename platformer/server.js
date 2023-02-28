const express = require('express');
const { Socket } = require('socket.io');
const os = require('os');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
require('dotenv').config();

// Settings from .env file 
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';
const version = process.env.VERSION || '0.0.0';
const environment = process.env.NODE_ENV || 'development';
const maxConnections = process.env.MAX_CONNECTIONS || 40;
const maxPlayers = process.env.MAX_PLAYERS || 10;
bannedIPs = process.env.BANNED_IPS || [];

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
players = {};
userNames = [];
userInfos = {};
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
  freemode: false,
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

app.use(express.static('public'));

server.listen(port, function () {
  const ip = Object.values(os.networkInterfaces())
    .flatMap((iface) => iface.filter((info) => info.family === 'IPv4' && !info.internal))
    .map((info) => info.address)[0];
  console.log(`Server listening on http://${ip}:3000`);
});

// socket connection
io.on('connection', function (socket) {
  // detect if the ip is banned
  if (bannedIPs.includes(socket.handshake.address)) {
    console.log('banned ip tried to connect:', socket.handshake.address);
    socket.emit('forceDiscConnect', true);
    socket.disconnect();
    return;
  }
  else if (players.length >= maxPlayers) {
    console.log('max players reached:', socket.handshake.address);
    socket.disconnect();
    return;
  }
  else if (io.engine.clientsCount >= maxConnections) {
    console.log('max connections reached:', socket.handshake.address);
    socket.disconnect();
    return;
  }
  console.log('a user connected id:', socket.id, 'ip:', socket.handshake.address);
  const userAgent = socket.handshake.headers['user-agent'];
  const isMobile = /Mobile/.test(userAgent);

  // send initial data
  socket.emit('initialData', {
    'validName': validName,
    'takenNames': userNames,
  });

  // on playerUpdate
  socket.on('playerUpdate', function (player) {
    // check if the player is already in the players array
  });
    

  
  // disconnect
  socket.on('disconnect', function () {
    console.log('user disconnected id:', socket.id, 'ip:', socket.handshake.address);
    // remove player
    for (let i = 0; i < players.length; i++) {
      if (players[i].id === socket.id) {
        players.splice(i, 1);
        break;
      }
    }
    // remove user
    for (let i = 0; i < userInfos.length; i++) {
      if (userInfos[i].id === socket.id) {
        userInfos.splice(i, 1);
        break;
      }
    }
    // remove name
    for (let i = 0; i < userNames.length; i++) {
      if (userNames[i] === socket.id) {
        userNames.splice(i, 1);
        break;
      }
    }
    
    // send to all clients the player
    socket.emit('updatePack', {
      'takenNames': userNames,
    });
    socket.broadcast.emit('updatePack', {
      'takenNames': userNames,
    });
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