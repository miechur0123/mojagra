const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  r: 20,
  speed: 2,
};

let food = [];

function spawnFood() {
  for (let i = 0; i < 50; i++) {
    food.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 5 + Math.random() * 5,
    });
  }
}
spawnFood();

let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function movePlayer() {
  if (keys["w"]) player.y -= player.speed;
  if (keys["s"]) player.y += player.speed;
  if (keys["a"]) player.x -= player.speed;
  if (keys["d"]) player.x += player.speed;
}

function checkCollision() {
  food = food.filter(f => {
    let dx = f.x - player.x;
    let dy = f.y - player.y;
    let dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < player.r + f.r) {
      player.r += 0.3;
      return false;
    }
    return true;
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
  ctx.fillStyle = "lime";
  ctx.fill();

  food.forEach(f => {
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
  });
}

function gameLoop() {
  movePlayer();
  checkCollision();
  draw();
  requestAnimationFrame(gameLoop);
}
gameLoop();
