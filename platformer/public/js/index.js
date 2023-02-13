//--------------------------------------------------------------------------------
// IMPORT
//--------------------------------------------------------------------------------
// import { Rect } from "./rect.js";

//--------------------------------------------------------------------------------
// SETUP
//--------------------------------------------------------------------------------
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
  y: 640,
  dX: 0,
  dY: 0,
  ddX: 0,
  ddY: 0,
  left: false,
  right: false,
  jump: false,
  collision : {
    top: false,
    bottom: false,
    left: false,
    right: false
  },
  gravity: 9.8 * 4, // gravity
  maxDX: 300, // max horizontal speed
  maxDY: 300, // max falling speed
  prevDirection: 0, // buffer for direction of X and its a sign (-1, 0, 1)
  jumpForce: 1500 * 5, // big burst of speed
  acceleration: 30,
  friction: 20, // 1 = 100% friction
  // Vertical states
  grounded: false,
  jumping: false,
  falling: false,
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
  }
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
  // check if current position is valid
  // while (!checkIFValidPosition(player)) {
  //   player.x -= (player.dX);
  //   player.y -= (player.dY);
  //   player.dX *= 0.9;
  //   player.dY *= 0.9;
  //   console.log(!(checkIFValidPosition(player)));
  // }


  
  // move the player according to the input
  if (player.left) { // left
    player.ddX -= player.acceleration;
    // player.ddX += player.friction * (0.5 * player.falling) // friction is less in air
  }
  if (player.right) { // right
    player.ddX += player.acceleration;
    // player.ddX -= player.friction * (0.5 * player.falling) // friction is less in air
  } 
  if (!player.left && !player.right) { // no horizontal input
    // player.dX *= player.friction;
    player.ddX = -player.prevDirection * player.friction * (player.falling ? 0.5 : 1);
  }
  
  player.ddY += player.gravity;
  if (player.jump && player.grounded) { // jump
    player.ddY -= player.jumpForce;
    player.jumping = true;
    player.doubleJumpingAllowed = true;
    player.grounded = false;
  }
  // } else if (player.jump && player.doubleJumpingAllowed) { // double jump
  //   player.ddY -= player.jumpForce;
  //   player.doubleJumping = true;
  //   player.doubleJumpingAllowed = false;
  // }
  // Idont understand how this works yet
  // if (player.jumpCooldown > 0) { // jump cooldown
  //   player.jumpCooldown -= deltaTime;
  // } else { // reset jump cooldown
  //   player.jumping = false;
  //   player.doubleJumping = false;
  // }

  // Update velocities
  player.dX += player.ddX * deltaTime
  player.dY += player.ddY * deltaTime
  // Put a cap/Clamp max speed in both direciton
  player.dX = clamp(player.dX, -player.maxDX, player.maxDX)
  player.dY = clamp(player.dY, -player.maxDY, player.maxDY)
  // Update position
  player.x += player.dX * deltaTime
  player.y += player.dY * deltaTime
  // Handle terminal friction
  currentDirection = Math.sign(player.dX)
  if (player.prevDirection * currentDirection == -1) {
    player.dX = 0;
    player.ddX = 0;
    currentDirection = 0;
  }
  player.prevDirection = currentDirection
  
  // check and handle if the player is colliding with a platform
  collisionCheck();
  checkIFValidPosition

}

function checkIFValidPosition(enity) { 
  for (let platform of platforms) {
    if (collisionAABB(enity, platform)) {
      return false;
    }
  }
  return true;
}

function collisionAABB(rect1, rect2) {
  return (
    rect1.x < rect2.x+rect2.width &&
    rect1.x+rect1.width > rect2.x &&
    rect1.y < rect2.y+rect2.height &&
    rect1.y+rect1.height > rect2.y)
}

function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}

function collisionCheck() { // <----- The problem is here probably
  player.collision.bottom = false;
  player.collision.top = false;
  player.collision.left = false;
  player.collision.right = false;
  player.grounded = false
  
  for (let platform of platforms) {
    // Only check platform that have collision with player
    if (!collisionAABB(player, platform)) {
      continue;
    }

    // buffered positional datas
    let pX = player.x;
    let pY = player.y;
    let pW = player.width;
    let pH = player.height;
    let platX = platform.x;
    let platY = platform.y;
    let platW = platform.width;
    let platH = platform.height;
    
    // Helper expressions
    let interceptX = pX + pW > platX && pX < platX + platW;
    let interceptY = pY + pH > platY && pY < platY + platH;

    // check bottom collision
    let pBottom = pY + pH; 
    if (pBottom+1 > platY && pBottom < platY + 10 && interceptX) { // HACKY way of creating a nonexistent groundlayer on top of every platform, because it counts touching too which in this simple phase is almost the same as a resolved collision
      player.collision.bottom = true;
      player.y = platY - pH;
      player.dY = 0;
      player.grounded = true;
      player.doubleJumping = false;
      player.wallJumping = false;
      console.log('bottom collision')
    }
    
    // check top collision
    let platBottom = platY + platH;
    if (pY >= platBottom - 10 && pY <= platBottom && interceptX) {
      player.collision.top = true;
      player.y = platY + platH;
      player.dY = 0;
      console.log('top collision');
    }
    
    // check right collision
    let pRight = pX + pW;
    if (pRight <= platX + 10 && pRight >= platX && interceptY) {
      player.collision.right = true;
      player.x = platX - pW;
      player.dX = 0;
      console.log('right collision');
    }
    
    // check left collision
    let platRight = platX + platW;
    if (pX >= platRight - 10 && pX <= platRight && interceptY) {
      player.collision.left = true;
      player.x = platX + platW;
      player.dX = 0;
      console.log('left collision');
    }
  }
}


//------------------------------------------------------------
// RENDERING
//------------------------------------------------------------

function draw() {
  ctx.clearRect(0, 200, 1000, 1000);
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

// Fixed Fps - almost the same as in Unity

const fixedDeltatime = 1 / 60;
var deltaTime;
var currentTime;
var lastTime = Date.now();
var toConsume = 0;

function frame() {
  currentTime = Date.now();
  // Date.now() gives miliseconds -> conversion into seconds
  deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  // Update controlls
  updateInput();
  
  toConsume += deltaTime;
  while (toConsume >= fixedDeltatime) {
    updatePlayer(fixedDeltatime);
    updateDebugDisplay(deltaTime);
    toConsume -= fixedDeltatime;
  }
  
  
  // Update camera's state
  updateCamera();
  
  // Do the render stuff
  draw();
  requestAnimationFrame(frame);

}

frame();