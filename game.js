const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const hud = document.getElementById('hud');
const buyWeapon1Btn = document.getElementById('buyWeapon1');
const buyWeapon2Btn = document.getElementById('buyWeapon2');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

class Player {
  constructor(){
    this.size = 30;
    this.x = WIDTH/2;
    this.y = HEIGHT/2;
    this.speed = 5;
    this.color = '#FFD700'; // złoty
    this.health = 100;
    this.bullets = [];
    this.shootCooldown = 0;
    this.score = 0; // monety
    this.level = 1;
    this.weaponLevel = 1; // poziom broni
  }
  draw(){
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
  }
  move(keys){
    if(keys['w'] && this.y - this.size/2 > 0) this.y -= this.speed;
    if(keys['s'] && this.y + this.size/2 < HEIGHT) this.y += this.speed;
    if(keys['a'] && this.x - this.size/2 > 0) this.x -= this.speed;
    if(keys['d'] && this.x + this.size/2 < WIDTH) this.x += this.speed;
  }
  shoot(targetX, targetY){
    if(this.shootCooldown <= 0){
      if(this.weaponLevel === 1){
        this.bullets.push(new Bullet(this.x, this.y, targetX, targetY, 10));
      } else if(this.weaponLevel === 2){
        this.bullets.push(new Bullet(this.x, this.y, targetX + 10, targetY, 12));
        this.bullets.push(new Bullet(this.x, this.y, targetX - 10, targetY, 12));
      } else if(this.weaponLevel >= 3){
        this.bullets.push(new Bullet(this.x, this.y, targetX, targetY, 15));
        this.bullets.push(new Bullet(this.x, this.y, targetX + 15, targetY + 5, 15));
        this.bullets.push(new Bullet(this.x, this.y, targetX - 15, targetY - 5, 15));
      }
      this.shootCooldown = 15;
    }
  }
  update(){
    if(this.shootCooldown > 0) this.shootCooldown--;
    this.draw();
    this.bullets.forEach((b, i) => {
      b.update();
      if(b.outOfBounds()) this.bullets.splice(i, 1);
    });
  }
}

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
  update(){
    this.x += this.dx;
    this.y += this.dy;
    this.draw();
  }
  draw(){
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
  }
  outOfBounds(){
    return (this.x < 0 || this.x > WIDTH || this.y < 0 || this.y > HEIGHT);
  }
}

class Enemy {
  constructor(x,y,level=1, isBoss=false){
    this.size = isBoss ? 60 : 25;
    this.x = x;
    this.y = y;
    this.speed = isBoss ? 1.5 : 2 + level*0.2;
    this.color = isBoss ? '#FF4500' : '#FF6347'; // boss i zwykły
    this.health = isBoss ? 100 + level*50 : 20 + level*10;
    this.isBoss = isBoss;
    this.level = level;
  }
  draw(){
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
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
let mouseX = 0;
let mouseY = 0;
let spawnTimer = 0;
let bossActive = false;

function spawnEnemy(level){
  let x, y;
  if(Math.random() < 0.5){
    x = Math.random() < 0.5 ? 0 : WIDTH;
    y = Math.random()*HEIGHT;
  } else {
    x = Math.random()*WIDTH;
    y = Math.random() < 0.5 ? 0 : HEIGHT;
  }
  enemies.push(new Enemy(x,y,level));
}

function spawnBoss(level){
  let x = WIDTH/2;
  let y = -80;
  enemies.push(new Enemy(x,y,level,true));
  bossActive = true;
}

function updateHUD(){
  hud.innerHTML = `HP: ${player.health} &nbsp;&nbsp; Monety: ${player.score} &nbsp;&nbsp; Level: ${player.level} &nbsp;&nbsp; Broń: ${player.weaponLevel}`;
}

function checkCollisions(){
  enemies.forEach((enemy, ei) => {
    player.bullets.forEach((bullet, bi) => {
      if(collidesRect(enemy.x, enemy.y, enemy.size, enemy.size, bullet.x, bullet.y, bullet.size, bullet.size)){
        enemy.health -= 10;
        player.bullets.splice(bi,1);
        if(enemy.health <= 0){
          if(enemy.isBoss) bossActive = false;
          enemies.splice(ei,1);
          player.score += enemy.isBoss ? 50 : 10;
        }
      }
    });
    if(collidesRect(enemy.x, enemy.y, enemy.size, enemy.size, player.x, player.y, player.size, player.size)){
      player.health -= 1;
      if(player.health <= 0){
        alert(`Game Over! Twoje monety: ${player.score}, dotarłeś do levelu ${player.level}`);
        window.location.reload();
      }
    }
  });
}

function collidesRect(x1,y1,w1,h1,x2,y2,w2,h2){
  return !(x2 > x1 + w1 ||
           x2 + w2 < x1 ||
           y2 > y1 + h1 ||
           y2 + h2 < y1);
}

function gameLoop(){
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  player.move(keys);
  player.update();

  enemies.forEach(enemy => enemy.update(player));

  checkCollisions();

  updateHUD();

  spawnTimer--;
  if(spawnTimer <= 0 && !bossActive){
    if(player.score > 0 && player.score % 50 === 0){
      spawnBoss(player.level);
      player.level++;
      spawnTimer = 600;
    } else {
      spawnEnemy(player.level);
      spawnTimer =
