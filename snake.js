const BG_COLOUR = '#231f20';
const SNAKE_COLOUR = '#c2c2c2';
const FOOD_COLOUR = '#e66916';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = canvas.height = 400;

const FR = 10; // frame rate
const S = 20; // size of each grid cell
const T = canvas.width / S;

let pos, vel, food, snake, lastVel;

function init() {
  pos = { x: 10, y: 10 };
  vel = { x: 0, y: 0 };
  lastVel = { x: 0, y: 0 }; // Store the last valid velocity to prevent reverse movement

  snake = [
    { x: 8, y: 10 },
    { x: 9, y: 10 },
    { x: 10, y: 10 },
  ];

  randomFood();
}

init();

function randomFood() {
  food = {
    x: Math.floor(Math.random() * T),
    y: Math.floor(Math.random() * T),
  };

  for (let cell of snake) {
    if (cell.x === food.x && food.y === cell.y) {
      return randomFood();
    }
  }
}

document.addEventListener('keydown', keydown);

function keydown(e) {
  switch (e.keyCode) {
    case 37: // Left arrow
      if (lastVel.x !== 1) { // Prevent reversing to the right
        vel = { x: -1, y: 0 };
      }
      break;
    case 38: // Up arrow
      if (lastVel.y !== 1) { // Prevent reversing downward
        vel = { x: 0, y: -1 };
      }
      break;
    case 39: // Right arrow
      if (lastVel.x !== -1) { // Prevent reversing to the left
        vel = { x: 1, y: 0 };
      }
      break;
    case 40: // Down arrow
      if (lastVel.y !== -1) { // Prevent reversing upward
        vel = { x: 0, y: 1 };
      }
      break;
  }
}

setInterval(() => {
  requestAnimationFrame(gameLoop);
}, 1000 / FR);

function gameLoop() {
  ctx.fillStyle = BG_COLOUR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = SNAKE_COLOUR;
  for (let cell of snake) {
    ctx.fillRect(cell.x * S, cell.y * S, S, S);
  }

  ctx.fillStyle = FOOD_COLOUR;
  ctx.fillRect(food.x * S, food.y * S, S, S);

  pos.x += vel.x;
  pos.y += vel.y;

  // Check if snake hits the wall
  if (pos.x < 0 || pos.x >= T || pos.y < 0 || pos.y >= Math.floor(canvas.height / S)) {
    init();
  }

  // Check if snake eats food
  if (food.x === pos.x && food.y === pos.y) {
    snake.push({ ...pos });
    pos.x += vel.x;
    pos.y += vel.y;
    randomFood();
  }

  // Check if the snake runs into itself
  if (vel.x || vel.y) {
    for (let cell of snake) {
      if (cell.x === pos.x && cell.y === pos.y) {
        return init();
      }
    }

    // Move the snake and update its position
    snake.push({ ...pos });
    snake.shift();

    // Store the current velocity for direction checking in the next loop
    lastVel = { ...vel };
  }
}
