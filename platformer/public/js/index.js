//--------------------------------------------------------------------------------
// IMPORT
//--------------------------------------------------------------------------------
// import { Rect } from "./rect.js";

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

//debug display
const nameDebug = document.getElementById('nameInput');
const fps = document.getElementById('fps');
const position = document.getElementById('position');
const velocity = document.getElementById('velocity');
const acceleration = document.getElementById('acceleration');
const grounded = document.getElementById('grounded');
const jumping = document.getElementById('jumping');
const doubleJumping = document.getElementById('doubleJumping');
const wallJumpingLeft = document.getElementById('wallJumpingLeft');
const wallJumpingRight = document.getElementById('wallJumpingRight');
const colisionDisplay = document.getElementById('colisionDisplay');

// settings
const settingsContainer = document.querySelector('.settings-container');
const options = document.querySelectorAll('.settings-options li');

// name form
const landingPage = document.getElementById('landing-page-container');
const nameInput = document.getElementById('name');
const singlePlayerButton = document.getElementById('singlePlayer');
const multiPlayerButton = document.getElementById('multiPlayer');

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
  {x: -3000, y: -3000, width: 7000, height: 7000, color: 'gray'},
]
var platforms = [
  {x: 0, y: 700, width: 1000, height: 100, color: 'green'},
  {x: -500, y: 450, width: 1000, height: 100, color: 'green'},
  {x: -1000, y: 200, width: 1000, height: 100, color: 'green'},
  {x: -600, y: -400, width: 100, height: 500, color: 'white'},
  {x: -300, y: -400, width: 100, height: 500, color: 'white'},
  {x: 580, y: 600, width: 100, height: 100, color: 'white'},
  {x: 50, y: 300, width: 100, height: 100, color: 'white'},
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
  gravity: 9.8 * 40.5, // gravity
  maxDX: 1300, // max horizontal speed
  maxDY: 1300, // max falling speed
  jumpForce: 1500 * 5, // big burst of speed
  acceleration: 300 ,
  friction: 900,
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
mode = 'lobby';

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
  camera.width = canvas.width;
  camera.height = canvas.height;
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

// name input  
singlePlayerButton.addEventListener('click', function() {
  if (nameInput.value.length > 0) {
    mode = 'singlePlayer';
    myName = nameInput.value;
    player.name = myName;
    console.log('my name is ' + myName);
    landingPage.style.display = 'none'  ;
    game.style.display = 'block';
    frame();
  }
});

multiPlayerButton.addEventListener('click', function() {
  // check if name is valid
  if (nameInput.value.length > nameRules.minLength) {
    if (nameInput.value.length < nameRules.maxLength) {
      // check if name only contains letters and numbers
      if (nameInput.value.match(/^[a-zA-Z0-9]+$/)) {
        myName = nameInput.value;
        myId = socket.id;
        // send name to server
        socket.emit('setName', myName);
        mode = 'multiPlayer';
      } else {
        console.log('name contains invalid characters');
        nameInput.value = 'name contains invalid characters';
      }
    } else {
      console.log('name is too long');
      nameInput.value = 'name is too long';
    }
  } else {
    console.log('name is too short');
    nameInput.value = 'name is too short';
  }
});

// settings
settingsContainer.addEventListener('click', () => {
  settingsContainer.classList.toggle('open');
});
  

options.forEach(option => {
  option.addEventListener('click', () => {
    options.forEach(o => o.classList.remove('selected'));
    option.classList.add('selected');
    const optionText = option.textContent.trim();
    switch (optionText) {
      case 'Option 1':
        runOption1Function();
        break;
      case 'Option 2':
        runOption2Function();
        break;
      case 'Option 3':
        runOption3Function();
        break;
      case 'Option 4':
        runOption4Function();
        break;
    }
  });
});

function runOption1Function() {
  console.log('Option 1 was clicked!');
  // Add your code to run for Option 1 here
}

function runOption2Function() {
  console.log('Option 2 was clicked!');
  // Add your code to run for Option 2 here
}

function runOption3Function() {
  console.log('Option 3 was clicked!');
  // Add your code to run for Option 3 here
}

function runOption4Function() {
  console.log('Option 4 was clicked!');
  // Add your code to run for Option 4 here
}

//--------------------------------------------------------------------------------
// SOCKET LISTENERS
//--------------------------------------------------------------------------------
// listen for initialData
socket.on('initialData', function(data) {
  console.log('initialData received');
  nameRules = data.validName;
});

// listen for start the game
socket.on('startGame', function(data) {
  console.log('startGame received');
  landingPage.style.display = 'none';
  game.style.display = 'block';
  frame();
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

  // steal smart stuff from oindex.js
  let wasleft = player.dX < 0;
  let wasright = player.dX > 0;

  // move the player according to the input
  if (player.left) { // left
    player.ddX -= player.acceleration;
  } else if (wasleft) {
    player.ddX += player.friction;
  }
  if (player.right) { // right
    player.ddX += player.acceleration;
  } else if (wasright) {
    player.ddX -= player.friction;
  } 

  // if (!player.left && !player.right) { // no horizontal input
  //   player.ddX = -player.prevDirection * player.friction * (player.falling ? 0.5 : 1);
  // }
    
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
  // Check if direction is fluctuating frame by frame
  // Meaning player reached "sticky friction"
  if ((wasleft && player.dX > 0) || (wasright && player.dX < 0)) {
    player.dX = 0;
    player.ddX = 0;
  }
  
  // check and handle if the player is colliding with a platform
  collisionCheck();

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
    // player's coordinates cannot be buffered
    // because otherwise 2 different collision check might want to 
    // set its coordinate to 2 different values
    let platX = platform.x;
    let platY = platform.y;
    let platW = platform.width;
    let platH = platform.height;
    
    // Helper expressions
    let interceptX = () => {return player.x + player.width > platX && player.x < platX + platW};
    let interceptY = () => {return player.y + player.height > platY && player.y < platY + platH};

    // check bottom collision
    let pBottom = player.y + player.height;
    if (pBottom > platY && pBottom < platY + 10 && interceptX()) { // HACKY way of creating a nonexistent groundlayer on top of every platform, because it counts touching too which in this simple phase is almost the same as a resolved collision
      player.collision.bottom = true;
      player.y = platY - player.height;
      player.dY = 0;
      player.ddY = 0;
      player.grounded = true;
      player.doubleJumping = false;
      player.wallJumping = false;
    }
    
    // check top collision
    let platBottom = platY + platH;
    if (player.y >= platBottom - 10 && player.y <= platBottom && interceptX()) {
      player.collision.top = true;
      player.y = platY + platH;
      // Early stage implementation of not falling
      if (player.dY < 0) {
        player.dY = 0;
        player.ddY = 0
      }
    }
    
    // check right collision
    let pRight = player.x + player.width;
    if (pRight <= platX + 10 && pRight >= platX && interceptY()) {
      player.collision.right = true;
      player.x = platX - player.width;
      // player.dX = 0;

    }
    
    // check left collision
    let platRight = platX + platW;
    if (player.x >= platRight - 10 && player.x <= platRight && interceptY()) {
      player.collision.left = true;
      player.x = platX + platW;
      // player.dX = 0;
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
  ctx.font = '15px Arial';
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
  // username text above player center myName
  drawText(myName, player.x - myName.length * 2.5, player.y - 5, player.color);
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
  // check if mode is single player or multiplayer
  if (mode === 'singlePlayer') {
    nameDebug.innerHTML = myName;// + ' id:  ' + myId; //+ 'ip: ' + myIp;
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
} else if (mode === 'multiPlayer') {
  nameDebug.innerHTML = myName + ' id:  ' + myId; //+ 'ip: ' + myIp;
  position.innerHTML = 'x: ' + player.x + ', y: ' + player.y + '';
  fps.innerHTML = 'fps: ' + (1 / deltaTime).toFixed(0);
  velocity.innerHTML = 'dX: ' + player.dX.toFixed(2) + ', dY: ' + player.dY.toFixed(2) + '';
  acceleration.innerHTML = 'ddX: ' + player.ddX.toFixed(2) + ', ddY: ' + player.ddY.toFixed(2) + '';
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
    toConsume -= fixedDeltatime;
  }
  
  // Update debug display's state
  updateDebugDisplay(deltaTime + toConsume);
  
  // Update camera's state
  updateCamera();
  
  // Do the render stuff
  draw();
  requestAnimationFrame(frame);

};


