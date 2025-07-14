const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Player {
  constructor() {
    this.x = canvas.width/2;
    this.y = canvas.height/2;
    this.radius = 20;
    this.speed = 5;
    this.color = 'lime';
    this.health = 100;
    this.bullets = [];
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fill();
  }
  move(keys) {
    if(keys['w'] && this.y - this.radius > 0) this.y -= this.speed;
    if(keys['s'] && this.y + this.radius < canvas.height) this.y += this.speed;
    if(keys['a'] && this.x - this.radius > 0) this.x -= this.speed;
    if(keys['d'] && this.x + this.radius < canvas.width) this.x += this.speed;
  }
  shoot(targetX, targetY) {
    this.bullets.push(new Bullet(this.x, this.y, targetX, targetY));
  }
  update() {
    this.draw();
    this.bullets.forEach((b, i) => {
      b.update();
      if(b.outOfBounds()) this.bullets.splice(i,1);
    });
  }
}

class Bullet {
  constructor(x,y,targetX,targetY){
    this.x = x;
    this.y = y;
    this.radius = 5;
    this.speed = 10;
    const angle = Math.atan2(targetY - y, targetX - x);
    this.dx = Math.cos(angle) * this.speed;
    this.dy = Math.sin(angle) * this.speed;
    this.color = 'yellow';
  }
  update() {
    this.x += this.dx;
    this.y += this.dy;
    this.draw();
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fill();
  }
  outOfBounds() {
    return this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height;
  }
}

class Enemy {
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.radius = 18;
    this.color = 'red';
    this.speed = 2;
    this.health = 20;
  }
  draw(){
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
    ctx.fill();
  }
  update(player){
    const angle = Math.atan2(player.y - this.y, player.x - this.x);
    this.x += Math.cos(angle)*this.speed;
    this.y += Math.sin(angle)*this.speed;
    this.draw();
  }
}

const player = new Player();
const enemies = [];
const keys = {};
let mouseX=0, mouseY=0;

function spawnEnemy() {
  const x = Math.random() < 0.5 ? 0 : canvas.width;
  const y = Math.random() * canvas.height;
  enemies.push(new Enemy(x,y));
}

setInterval(spawnEnemy, 2000);

window.addEventListener('keydown', e => { keys[e.key.toLowerCase()] = true; });
window.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });

window.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

window.addEventListener('click', () => {
  player.shoot(mouseX, mouseY);
});

function checkCollisions(){
  enemies.forEach((enemy, i) => {
    // Bullets hit enemy
    player.bullets.forEach((bullet,j) => {
      const dx = enemy.x - bullet.x;
      const dy = enemy.y - bullet.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if(dist < enemy.radius + bullet.radius){
        enemy.health -= 10;
        player.bullets.splice(j,1);
        if(enemy.health <= 0){
          enemies.splice(i,1);
        }
      }
    });
    // Enemy hits player
    const dxp = enemy.x - player.x;
    const dyp = enemy.y - player.y;
    const distp = Math.sqrt(dxp*dxp + dyp*dyp);
    if(distp < enemy.radius + player.radius){
      player.health -= 1;
      if(player.health <= 0){
        alert('Game Over!');
        window.location.reload();
      }
    }
  });
}

function gameLoop(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  player.move(keys);
  player.update();
  enemies.forEach(e => e.update(player));
  checkCollisions();

  // Draw HUD
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`HP: ${player.health}`, 20, 30);

  requestAnimationFrame(gameLoop);
}

gameLoop();

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
