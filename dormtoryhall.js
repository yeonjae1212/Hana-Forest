let objects = [];
let jinwoo = null;

class TrashCan {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 100;
  }

  draw(ctx) {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Wall {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 600;
    this.height = 10;
  }

  draw(ctx) {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Jinwoo {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 40;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.stroke();
  }
}

export function setupMapObjects() {
  objects = [];

  // 쓰레기통
  objects.push(new TrashCan(50, 200));
  objects.push(new TrashCan(50, 300));
  objects.push(new TrashCan(50, 400));

  // 벽
  objects.push(new Wall(0, 0));
  objects.push(new Wall(800, 0));

  // 진우 캐릭터
  jinwoo = new Jinwoo(250, 350);
  objects.push(jinwoo);
}

export function drawMap(ctx) {
  for (const obj of objects) {
    obj.draw(ctx);
  }
}

export function getJinwoo() {
  return jinwoo;
}
