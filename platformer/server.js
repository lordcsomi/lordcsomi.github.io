const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

server.listen(3000, function () {
  console.log('listening on *:3000');
});

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

// socket connection
io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
  socket.on('invalidPositions', function (invalidPositions) {
    invalidPositionsToFile('./temporary/invalidPositions.txt', invalidPositions, ';');
  });
});