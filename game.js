class Player {
  constructor(){
    // ... reszta pól
    this.weaponLevel = 1;  // poziom broni
  }
  shoot(targetX, targetY){
    if(this.shootCooldown <= 0){
      // W zależności od poziomu broni, różna ilość pocisków / prędkość
      if(this.weaponLevel === 1){
        this.bullets.push(new Bullet(this.x, this.y, targetX, targetY, 10));
      } else if(this.weaponLevel === 2){
        // np. 2 pociski z lekkim rozrzutem
        this.bullets.push(new Bullet(this.x, this.y, targetX + 10, targetY, 12));
        this.bullets.push(new Bullet(this.x, this.y, targetX - 10, targetY, 12));
      } else if(this.weaponLevel >= 3){
        // 3 pociski
        this.bullets.push(new Bullet(this.x, this.y, targetX, targetY, 15));
        this.bullets.push(new Bullet(this.x, this.y, targetX + 15, targetY + 5, 15));
        this.bullets.push(new Bullet(this.x, this.y, targetX - 15, targetY - 5, 15));
      }
      this.shootCooldown = 15;
    }
  }
  // reszta metod bez zmian
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
class Bullet {
  constructor(x,y,targetX,targetY,speed=10){
    this.x = x;
    this.y = y;
    this.size = 8;
    this.speed = speed;
    const angle = Math.atan2(targetY - y, targetX - x);
    this.dx = Math.cos(angle)*this.speed;
    this.dy = Math.sin(angle)*this.speed;
    this.color = 'yellow';
  }
  // reszta jak było
}
const shop = document.getElementById('shop');
const buyWeapon1Btn = document.getElementById('buyWeapon1');
const buyWeapon2Btn = document.getElementById('buyWeapon2');

buyWeapon1Btn.onclick = () => {
  if(player.score >= 100 && player.weaponLevel < 2){
    player.score -= 100;
    player.weaponLevel = 2;
    alert('Kupiono Broń 2!');
  } else {
    alert('Nie masz wystarczająco monet lub już posiadasz tę broń!');
  }
};

buyWeapon2Btn.onclick = () => {
  if(player.score >= 250 && player.weaponLevel < 3){
    player.score -= 250;
    player.weaponLevel = 3;
    alert('Kupiono Broń 3!');
  } else {
    alert('Nie masz wystarczająco monet lub już posiadasz tę broń!');
  }
};
function updateHUD(){
  hud.innerHTML = `HP: ${player.health} &nbsp;&nbsp; Monety: ${player.score} &nbsp;&nbsp; Level: ${player.level} &nbsp;&nbsp; Broń: ${player.weaponLevel}`;
}
