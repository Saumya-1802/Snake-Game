const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const gameOverMsg = document.getElementById("gameOverMessage");
const eatSound = document.getElementById("eatSound");
const gameOverSound = document.getElementById("gameOverSound");

canvas.width = 800;
canvas.height = 500;

const gridSize = 20;
let snake = [{ x: gridSize * 5, y: gridSize * 5 }];
let direction = { x: gridSize, y: 0 };
let food = spawnFood();
let score = 0;
let lives = 2;
let showTongue = false;
let tongueTimer = null;
let gameInterval = setInterval(gameLoop, 160);

function spawnFood() {
  return {
    x: Math.floor(Math.random() * canvas.width / gridSize) * gridSize,
    y: Math.floor(Math.random() * canvas.height / gridSize) * gridSize
  };
}

function gameLoop() {
  let head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  if (
    head.x < 0 || head.y < 0 ||
    head.x >= canvas.width || head.y >= canvas.height ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    lives--;
    livesEl.textContent = lives;
    if (lives < 0) {
      gameOverSound.play();
      clearInterval(gameInterval);
      gameOverMsg.style.display = "block";
      return;
    } else {
      snake = [{ x: gridSize * 5, y: gridSize * 5 }];
      direction = { x: gridSize, y: 0 };
      return;
    }
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = score;
    eatSound.play();
    food = spawnFood();
    triggerTongueFlick();
  } else {
    snake.pop();
  }

  ctx.fillStyle = "#1e272e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawApple(food.x, food.y);
  drawSnake();
}

function triggerTongueFlick() {
  showTongue = true;
  if (tongueTimer) clearTimeout(tongueTimer);
  tongueTimer = setTimeout(() => {
    showTongue = false;
  }, 200);
}

function drawApple(x, y) {
  ctx.font = `${gridSize + 4}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🍎", x + gridSize / 2, y + gridSize / 2);
}

function drawSnake() {
  for (let i = 0; i < snake.length; i++) {
    if (i === 0) {
      ctx.fillStyle = "#66bb6a";
      ctx.beginPath();
      ctx.arc(snake[i].x + gridSize / 2, snake[i].y + gridSize / 2, gridSize / 2, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(snake[i].x + gridSize / 2 - 4, snake[i].y + gridSize / 2 - 2, 2, 0, Math.PI * 2);
      ctx.arc(snake[i].x + gridSize / 2 + 4, snake[i].y + gridSize / 2 - 2, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.arc(snake[i].x + gridSize / 2 - 4, snake[i].y + gridSize / 2 - 2, 1, 0, Math.PI * 2);
      ctx.arc(snake[i].x + gridSize / 2 + 4, snake[i].y + gridSize / 2 - 2, 1, 0, Math.PI * 2);
      ctx.fill();

      if (showTongue) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(snake[i].x + gridSize / 2, snake[i].y);
        ctx.lineTo(snake[i].x + gridSize / 2, snake[i].y - 8);
        ctx.stroke();
      }
    } else {
      let shade = 200 - i * 5;
      ctx.fillStyle = `rgb(76, ${shade}, 80)`;
      ctx.beginPath();
      ctx.arc(snake[i].x + gridSize / 2, snake[i].y + gridSize / 2, gridSize / 2 - 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

document.addEventListener("keydown", e => {
  switch (e.key) {
    case "ArrowUp":
      if (direction.y === 0) direction = { x: 0, y: -gridSize };
      break;
    case "ArrowDown":
      if (direction.y === 0) direction = { x: 0, y: gridSize };
      break;
    case "ArrowLeft":
      if (direction.x === 0) direction = { x: -gridSize, y: 0 };
      break;
    case "ArrowRight":
      if (direction.x === 0) direction = { x: gridSize, y: 0 };
      break;
  }
});

document.getElementById("restartBtn").addEventListener("click", () => {
  location.reload();
});
