import { player, Input } from "../player.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

Input.init();

let startTime = null;
let gameOver = false;
let obstacles = [];
let frameCount = 0;
let maxTime = 30000; // 30초

class Obstacle {
  constructor() {
    this.x = canvas.width + 100;
    this.y = Math.random() * (canvas.height - 100);
    this.width = 50;
    this.height = 100;
    this.speed = 6 + Math.random() * 2;
    this.amplitude = 50;
    this.freq = 0.05 + Math.random() * 0.03;
    this.baseY = this.y;
  }

  move() {
    this.x -= this.speed;
    this.y = this.baseY + Math.sin(frameCount * this.freq) * this.amplitude;
  }

  draw(ctx) {
    ctx.fillStyle = 'black';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  isCollidingWith(p) {
    return (
      p.x < this.x + this.width &&
      p.x + p.width > this.x &&
      p.y < this.y + this.height &&
      p.y + p.height > this.y
    );
  }
}

function resetGame() {
  startTime = performance.now();
  player.x = 200;
  player.y = 300;
  frameCount = 0;
  obstacles = [];
  gameOver = false;
  gameLoop();
}

function gameLoop() {
  if (gameOver) return;

  frameCount++;
  const now = performance.now();
  const elapsed = now - startTime;
  const seconds = (elapsed / 1000).toFixed(1);
  scoreDisplay.textContent = `Score: ${seconds}s`;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.move();
  player.draw(ctx);

  if (frameCount % 60 === 0) {
    obstacles.push(new Obstacle());
  }

  for (let obs of obstacles) {
    obs.move();
    obs.draw(ctx);
    if (obs.isCollidingWith(player)) {
      gameOver = true;
      window.location.href = "index.html?result=fail";
      return;
    }
  }

  if (elapsed >= maxTime) {
    const px = 300;
    const py = 280;
    window.location.href = `index.html?result=success&px=${px}&py=${py}`;
    return;
  }

  requestAnimationFrame(gameLoop);
}

resetGame();
