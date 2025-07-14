export const Input = { //이동 input 블록
    keys : {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false
    },

    init() {
        document.addEventListener('keydown', (e) => {
            if (e.key in this.keys) this.keys[e.key] = true;
        });
        document.addEventListener('keyup', (e) => {
            if (e.key in this.keys) this.keys[e.key] = false;
        });
    },
    isPressed(key) {
        return !!this.keys[key];
    }
};

function showDialog(obs, callback) {
  if (document.getElementById("dialogBox")) return;

  const dialog = document.createElement("div");
  dialog.id = "dialogBox";

  dialog.innerHTML = `
    <p>${obs.name}</p>
    <button id="yesBtn">예</button>
    <button id="noBtn">아니오</button>
  `;

  document.body.appendChild(dialog);

  document.getElementById("yesBtn").onclick = () => {
    player.state = String(obs.name);
    player.x = playerState[obs.name].x;
    player.y = playerState[obs.name].y;
    dialog.remove()
    callback(player.state)
  };

  document.getElementById("noBtn").onclick = () => {
    dialog.remove();
  };
}

//------------------------------------------------
//player object
//------------------------------------------------
const playerState = {//맵 별로 초기 시작 위치 다르게 설정 가능
    classRoom:{x: 1010, y: 60},
    robot:{x: -100, y: -100}
}

export function isColliding(rect1, rect2) {
  return !(
    rect1.x + rect1.width <= rect2.x ||   // rect1이 rect2 왼쪽에 있음
    rect1.x >= rect2.x + rect2.width ||   // rect1이 rect2 오른쪽에 있음
    rect1.y + rect1.height <= rect2.y ||  // rect1이 rect2 위에 있음
    rect1.y >= rect2.y + rect2.height     // rect1이 rect2 아래에 있음
  );
}


export let player = {
    state : "classRoom",
    x :150,
    y: 150,
    width : 80,
    height: 80,
    speed : 15,

    init(){
        this.x = playerState[this.state].x;
        this.y = playerState[this.state].y;

    },
    move(canvas, maplist,callback) {
        const prevX =this.x;
        const prevY = this.y;
        if (Input.isPressed('ArrowUp')) this.y -= this.speed;
        if (Input.isPressed('ArrowDown')) this.y += this.speed;
        if (Input.isPressed('ArrowLeft')) this.x -= this.speed;
        if (Input.isPressed('ArrowRight')) this.x += this.speed;

        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvas.width)
        this.x = canvas.width - this.width;
    
        if (this.y < 0) this.y = 0;
        if (this.y + this.height > canvas.height)
        this.y = canvas.height - this.height;

        for (let obs of maplist[this.state].obstacles){
            if (isColliding(this, obs)) {
            this.x = prevX;
            this.y = prevY;
            }
        }

        let isCollidingAny = false;

        for (let obs of maplist[this.state].interaction){
          if (isColliding(this, obs)) {
            // this.x = prevX;
            // this.y = prevY;
            showDialog(obs,callback);
            isCollidingAny = true;
            break;
          }
        }
        if (!isCollidingAny) {
          const dialog = document.getElementById("dialogBox");
          if (dialog) dialog.remove();
        }

    },

    draw(ctx){
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height)
    },

}


