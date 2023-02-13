//--------------------------------------------------------------------------------
// SETUP
//--------------------------------------------------------------------------------
const socket = io();
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';
ctx.scale(1, 1);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fps = document.getElementById('fps');
const nameInput = document.getElementById('nameInput');
const position = document.getElementById('position');
const velocity = document.getElementById('velocity');
const grounded = document.getElementById('grounded');
const jumping = document.getElementById('jumping');
const doubleJumping = document.getElementById('doubleJumping');
const wallJumpingLeft = document.getElementById('wallJumpingLeft');
const wallJumpingRight = document.getElementById('wallJumpingRight');
const colisionDisplay = document.getElementById('colisionDisplay');

var invalidPositions = [];
var keys = [];
var KEYS = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  SPACE: 32,
  SHIFT: 16,
  CTRL: 17,
};
var mouse = {
  x: undefined,
  y: undefined,
  click: false,
  clickX: undefined,
  clickY: undefined
};

var background = [
  {x: -3000, y: -3000, width: 7000, height: 7000, color: 'black'}
]
var platforms = [
  {x: 0, y: 700, width: 1000, height: 100, color: 'green'},
  {x: -500, y: 450, width: 1000, height: 100, color: 'green'},
  {x: -1000, y: 200, width: 1000, height: 100, color: 'green'},
  {x: -600, y: -400, width: 100, height: 500, color: 'white'},
  {x: -300, y: -400, width: 100, height: 500, color: 'white'},
  {x: 580, y: 600, width: 100, height: 100, color: 'white'},
  {x: 1000, y: 600, width: 1000, height: 100, color: 'green'},
  {x: 2000, y: 500, width: 1000, height: 100, color: 'green'},
  {x: 3000, y: 400, width: 1000, height: 100, color: 'green'},
  {x: 4000, y: 300, width: 1000, height: 100, color: 'green'},
  {x: 5000, y: 200, width: 1000, height: 100, color: 'green'},
  {x: 6000, y: 100, width: 1000, height: 100, color: 'green'},
  {x: 7000, y: 0, width: 1000, height: 100, color: 'green'},
  {x: 8000, y: -100, width: 1000, height: 100, color: 'green'},
  {x: 9000, y: -200, width: 1000, height: 100, color: 'green'},
  {x: 10000, y: -300, width: 1000, height: 100, color: 'green'},
  {x: 11000, y: -400, width: 1000, height: 100, color: 'green'},
  {x: 12000, y: -500, width: 1000, height: 100, color: 'green'},
  {x: 13000, y: -600, width: 1000, height: 100, color: 'green'},
  {x: 14000, y: -700, width: 1000, height: 100, color: 'green'},
  {x: 15000, y: -800, width: 1000, height: 100, color: 'green'},
  {x: 16000, y: -900, width: 1000, height: 100, color: 'green'},
]

var player = {
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
  gravity: 9.81*0.1, // gravity
  maxDX: 9, // max horizontal speed
  maxDY: 50, // max falling speed
  jumpForce: 10, // big burst of speed
  acceleration: 0.8,
  friction: 0.9, // 1 = 100% friction
  grounded: false,
  jumping: false,
  doubleJumpingAllowed: true,
  doubleJumping: false,
  jumpCooldown: 0.3, // seconds
  wallJumpingLeft: false,
  wallJumpingRight: false,
  wallJumping: false,
  freemode: true,
}

var camera = {
  x: 0,
  y: 0,
  width: canvas.width,
  height: canvas.height,
  effects: {
    shake: {
      active: false,
      intensity: 0,
      duration: 0,
      time: 0,
      x: 0,
      y: 0
    },
    zoom: {
      active: false,
      intensity: 0,
      duration: 0,
      time: 0,
      x: 0,
      y: 0
    }
  },
  renderWidth: canvas.width,
  renderHeight: canvas.height,
}

//--------------------------------------------------------------------------------
// EVENT LISTENERS
//--------------------------------------------------------------------------------
  
window.addEventListener('keydown', function(e) {
  keys[e.keyCode] = true;
});
window.addEventListener('keyup', function(e) {
  keys[e.keyCode] = false;
});

window.addEventListener('mousemove', function(e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  if (mouse.click === true) {
    mouse.clickX = e.clientX;
    mouse.clickY = e.clientY;
  }
});
window.addEventListener('mousedown', function(e) {
  if (!canvas.contains(e.target)) {
    keys = [];
    console.log('mouse down outside canvas');
  } else {
    mouse.click = true;
    mouse.clickX = e.clientX;
    mouse.clickY = e.clientY;
  }
});
window.addEventListener('mouseup', function(e) {
  mouse.click = false;
});
window.addEventListener("resize", function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawCamera();
  console.log('resized');
});

document.addEventListener("contextmenu", function(event) {
  event.preventDefault();
}, false);
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    keys = [];
    console.log('tab hidden');
  } else {
    console.log('tab visible');
  }
});

//--------------------------------------------------------------------------------
// UPDATE FUNCTIONS
//--------------------------------------------------------------------------------

function updateInput() {
  if (keys[37] || keys[65]) { // left
    player.left = true;
  } else {
    player.left = false;
  }
  if (keys[39] || keys[68]) { // right
    player.right = true;
  } else {
    player.right = false;
  }
  if (keys[38] || keys[87] || keys[32]) { // up
    player.jump = true;
  } else {
    player.jump = false;
  }
}

function update() {
  updateInput();
  updatePlayer(deltaTime);
  updateCamera();
}

function updatePlayer(deltaTime) {
  
  // ---------------------------- Error Checking ----------------------------
  if (checkIFValidPosition(player.x, player.y)===false) {
    console.log('invalid position', 'x:',player.x, 'y:',player.y, 'dX:',player.dX, 'dY:',player.dY, 'grounded:',player.grounded, 'jumping:',player.jumping, 'doubleJumping:',player.doubleJumping, 'wallJumpingLeft:',player.wallJumpingLeft, 'wallJumpingRight:',player.wallJumpingRight, 'wallJumping:',player.wallJumping, 'collision:',player.collision); 
    invalidPositions.push({
      x: player.x,
      y: player.y,
      dX: player.dX,
      dY: player.dY,
      grounded: player.grounded,
      jumping: player.jumping,
      doubleJumping: player.doubleJumping,
      wallJumpingLeft: player.wallJumpingLeft,
      wallJumpingRight: player.wallJumpingRight,
      wallJumping: player.wallJumping,
      collision: player.collision
    });
    while (checkIFValidPosition(player.x, player.y)===false) {
      player.x -= player.dX;
      player.y -= player.dY;
      player.dX *= 0.9;
      player.dY *= 0.9;
    }
  }

  // move the player according to the input
  if (player.left) { // left
    player.dX -= player.acceleration;
  } else if (player.right) { // right
    player.dX += player.acceleration;
  } else { // no horizontal input
    player.dX *= player.friction;
  }
  if (player.jump && player.grounded) { // jump
    player.dY -= player.jumpForce;
    player.jumping = true;
    player.doubleJumpingAllowed = true;
  } else if (player.jump && player.doubleJumpingAllowed) { // double jump
    player.dY -= player.jumpForce;
    player.doubleJumping = true;
    player.doubleJumpingAllowed = false;
  }
  if (player.jumpCooldown > 0) { // jump cooldown
    player.jumpCooldown -= deltaTime;
  } else { // reset jump cooldown
    player.jumping = false;
    player.doubleJumping = false;
  }
  if (player.dX > player.maxDX) { // max speed
    player.dX = player.maxDX;
  }
  if (player.dX < -player.maxDX) { // max speed
    player.dX = -player.maxDX;
  }
  if (player.dY > player.maxDY) { // max falling speed
    player.dY = player.maxDY;
  }
  if (player.dY < -player.maxDY) { // max falling speed
    player.dY = -player.maxDY;
  }
  player.dY += player.gravity;
  player.x += player.dX;
  player.x = Math.round(player.x);
  player.y += player.dY;

  // check if the player is colliding with a platform
  collisionCheck();
}

// ---------------------------- Error Checking ----------------------------
function checkIFValidPosition(x, y) { 
  for (var i = 0; i < platforms.length; i++) {
    if (x + player.width > platforms[i].x && x < platforms[i].x + platforms[i].width) {
      if (y + player.height > platforms[i].y && y < platforms[i].y + platforms[i].height) {
        return false;
      }
    }
  }
  return true;
}

function sendInvalidPositions() {
  console.log('sending invalid positions');
  socket.emit('invalidPositions', invalidPositions);
  invalidPositions = [];
}


function collisionCheck() { // <----- The problem is here probably
  player.collision.bottom = false;
  player.collision.top = false;
  player.collision.left = false;
  player.collision.right = false;
  player.grounded = false;
  
  for (let i = 0; i < platforms.length; i++) {
    let platform = platforms[i];
    let pX = player.x;
    let pY = player.y;
    let pW = player.width;
    let pH = player.height;
    let platX = platform.x;
    let platY = platform.y;
    let platW = platform.width;
    let platH = platform.height;
    
    // check bottom collision
    if (pY + pH >= platY && pY + pH <= platY + 10 &&
      pX >= platX && pX <= platX + platW) {
      player.collision.bottom = true;
      player.y = platY - pH;
      player.dY = 0;
      player.grounded = true;
      player.doubleJumping = false;
      player.wallJumping = false;
    }
    
    // check top collision
    if (pY <= platY + platH && pY >= platY + platH - 10 &&
        pX >= platX && pX <= platX + platW) {
      player.collision.top = true;
      player.y = platY + platH;
      player.dY = 0;
    }
    
    // check right collision
    if (pX + pW >= platX && pX + pW <= platX + 10 &&
        pY + pH >= platY && pY <= platY + platH) {
      player.collision.right = true;
      player.x = platX - pW;
      player.dX = 0;
      player.collision.right = true;
    }
    
    // check left collision
    if (pX <= platX + platW && pX >= platX + platW - 10 &&
        pY + pH >= platY && pY <= platY + platH) {
      player.collision.left = true;
      player.x = platX + platW;
      player.dX = 0;
      player.collision.left = true;
    }
  }
}


//------------------------------------------------------------
// RENDERING
//------------------------------------------------------------

function draw() {
  ctx.clearRect(camera.x, camera.y, camera.width, camera.height);
  drawBackground();
  drawPlatforms();
  drawPlayer();
}

function drawRect(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}
function drawCircle(x, y, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  ctx.fill();
}
function drawText(text, x, y, color) {
  ctx.fillStyle = color;
  ctx.font = '30px Arial';
  ctx.fillText(text, x, y);
}
function drawImage(image, x, y, width, height) {
  ctx.drawImage(image, x, y, width, height);
}
function drawBackground() {
  for (var i = 0; i < background.length; i++) {
    drawRect(background[i].x, background[i].y, background[i].width, background[i].height, background[i].color);
  }  
}
function drawPlatforms() {
  for (var i = 0; i < platforms.length; i++) {
    drawRect(platforms[i].x, platforms[i].y, platforms[i].width, platforms[i].height, platforms[i].color);
  }
}
function drawPlayer() {
  drawRect(player.x, player.y, player.width, player.height, player.color);
}
function drawProjectiles() {
  for (var i = 0; i < projectiles.length; i++) {
    drawCircle(projectiles[i].x, projectiles[i].y, projectiles[i].size, projectiles[i].color);
  }
}

function updateCamera() {
  drawCamera();
  camera.x = player.x - canvas.width / 2;
  camera.y = player.y - canvas.height / 2;
  ctx.setTransform(1, 0, 0, 1, -camera.x, -camera.y);
  //console.log('camera:',camera.x, camera.y);
}

function drawCamera() {
  if (camera.effects.shake === true) {
    ctx.translate(Math.random() * camera.effects.shakeIntensity, Math.random() * camera.effects.shakeIntensity);
    camera.effects.shakeDuration--;
    if (camera.effects.shakeDuration <= 0) {
      camera.effects.shake = false;
    }
  }
  if (camera.effects.zoom === true) {
    ctx.scale(camera.effects.zoomIntensity, camera.effects.zoomIntensity);
    camera.effects.zoomDuration--;
    if (camera.effects.zoomDuration <= 0) {
      camera.effects.zoom = false;
    }
  }
}

function updateDebugDisplay(deltaTime) {
  position.innerHTML = 'x: ' + player.x + ', y: ' + player.y + '';
  fps.innerHTML = 'fps: ' + (1 / deltaTime).toFixed(0);
  velocity.innerHTML = 'dX: ' + player.dX.toFixed(2) + ', dY: ' + player.dY.toFixed(2) + '';
  grounded.innerHTML = 'grounded: ' + player.grounded + '';
  jumping.innerHTML = 'jumping: ' + player.jumping + '';
  doubleJumping.innerHTML = 'doubleJumping: ' + player.doubleJumping + '';
  wallJumpingLeft.innerHTML = 'wallJumpingLeft: ' + player.wallJumpingLeft + '';
  wallJumpingRight.innerHTML = 'wallJumpingRight: ' + player.wallJumpingRight + '';
  var collision = [];
  if (player.collision.right === true) {
    collision.push('right');
  }
  if (player.collision.left === true) {
    collision.push('left');
  }
  if (player.collision.top === true) {
    collision.push('top');
  }
  if (player.collision.bottom === true) {
    collision.push('bottom');
  }
  colisionDisplay.innerHTML = 'collisions: ' + collision + '';
}

//------------------------------------------------------------
// GAME LOOP
//------------------------------------------------------------

var maxFps = 60;
var step = 1 / maxFps;
var deltaTime = 0;
var now, last = Date.now();
let frameRates = [];
let sumFrameRates = 0;

function frame() {
  now = Date.now();
  deltaTime = deltaTime + Math.min(1, (now - last) / 1000);
  updateDebugDisplay(deltaTime);
  while (deltaTime > step) {
    deltaTime -= step;
    update(deltaTime);
  }
  draw();
  last = now;
  requestAnimationFrame(frame);
}

frame();