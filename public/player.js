export const Input = { //이동 input 블록
    keys : {
    w: false,
    a: false,
    s: false,
    d: false
    },

    init() {
        document.addEventListener('keydown', (e) => {
          const key = e.key.toLocaleLowerCase();
          if (key in this.keys) this.keys[key] = true;
        });
        document.addEventListener('keyup', (e) => {
          const key = e.key.toLocaleLowerCase();
            if (key in this.keys) this.keys[key] = false;
        });
    },
    isPressed(key) {
        return !!this.keys[key];
    }
};

function button(state,callback,dialog){
    player.state =String(state);
    player.x = playerState[state].xin;
    player.y = playerState[state].yin;
    dialog.remove();
    callback(state)
}


function showDialog(obs, callback,canvas) {
  if (document.getElementById("dialogBox")) return;

  const dialog = document.createElement("div");
  dialog.id = "dialogBox";

  
  dialog.innerHTML = `
    <p>${obs.message}</p>
    <button id="yesBtn">예</button>
    <button id="noBtn">아니오</button>
  `;

  dialog.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
  dialog.style.padding = "10px";
  dialog.style.border = "2px solid #333";
  dialog.style.borderRadius = "5px";
  dialog.style.textAlign = "center";
  dialog.style.fontSize = "10px";
  dialog.style.color = "#000";
  dialog.style.zIndex = "1000";

  // 위치 지정 (화면 중앙 고정)
  dialog.style.position = "absolute";
  const canvasRect = canvas.getBoundingClientRect(); //canvas 외곽선 검출
  dialog.style.left = `${canvasRect.left + canvasRect.width / 2}px`; //위치 지정
  dialog.style.top = `${canvasRect.top + canvasRect.height / 2}px`;
  dialog.style.transform = "translate(-50%, -50%)";

  document.body.appendChild(dialog);

  document.getElementById("yesBtn").onclick = () => {

    if(obs.action){
      dialog.remove()
      player.interaction = false
      obs.action(player,dialog)
    }
    else{    
    player.state = obs.name;
    player.x = playerState[obs.name].x;
    player.y = playerState[obs.name].y;}

    dialog.remove();
    callback(player.state)
  };

  document.getElementById("noBtn").onclick = () => {
    dialog.remove();
  };
}

function showWhereToGo(obs,callback,canvas){
    if (document.getElementById("dialogBox")) return;

  const dialog = document.createElement("div");
  dialog.id = "dialogBox";

  const study =  `<button id="studyRoom">면학실</button>`
  const dorm =  `<button id="dormHallway">기숙사</button>`
  const classroom = `<button id= "classroomHallway">교과교실</button>`
  const m = `<p>${obs.message}</p>`

  if(player.key<=1){ dialog.innerHTML = `
    <p>생활관 선생님이 부르시는것 같아!</p>`;
  }
  else if(player.key==3||(player.key==2&&player.state=='classroomHallway')){
    dialog.innerHTML = `
    <p>교실 안에서 선생님이 기다리고 계신것 같은데?</p>`;
  }
  else if(player.key===2){
    dialog.innerHTML = m+classroom
  }
  else if(player.key==4){
    dialog.innerHTML = `
    <p>선생님이 부르시는것 같아!</p>`;
  }
  else if(player.state =='classroomHallway'){
    dialog.innerHTML = m+study+dorm
  }
  else if(player.state == 'studyRoom'){
    dialog.innerHTML = m+classroom+dorm
  }
  else if(player.state =='dormHallway'){
    dialog.innerHTML = m+classroom+study
  }
  else{  
    dialog.innerHTML = m+study+dorm+classroom;}

  dialog.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
  dialog.style.padding = "10px";
  dialog.style.border = "2px solid #333";
  dialog.style.borderRadius = "5px";
  dialog.style.textAlign = "center";
  dialog.style.fontSize = "10px";
  dialog.style.color = "#000";
  dialog.style.zIndex = "1000";
  dialog.style.position = "absolute";
  const canvasRect = canvas.getBoundingClientRect(); //canvas 외곽선 검출
  dialog.style.left = `${canvasRect.left + canvasRect.width / 2}px`; //위치 지정
  dialog.style.top = `${canvasRect.top + canvasRect.height / 2}px`;
  dialog.style.transform = "translate(-50%, -50%)";
  

  document.body.appendChild(dialog);
["studyRoom", "dormHallway", "classroomHallway"].forEach(id => {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.onclick = () => button(id, callback,dialog);
});
}

export function isColliding(rect1, rect2) {
  return !(
    rect1.x + rect1.width <= rect2.x ||   // rect1이 rect2 왼쪽에 있음
    rect1.x >= rect2.x + rect2.width ||   // rect1이 rect2 오른쪽에 있음
    rect1.y + rect1.height <= rect2.y ||  // rect1이 rect2 위에 있음
    rect1.y >= rect2.y + rect2.height     // rect1이 rect2 아래에 있음
  );
}

//------------------------------------------------
//player object
//------------------------------------------------
const playerState = {//맵 별로 초기 시작 위치 다르게 설정 가능
    classroom:{x: 300, y: 100},
    robot:{x: -100, y: 100},
    classroomHallway:{x:300,y:400,xin:1000,yin:450},
    studyRoom:{xin:250,yin:550},
    dormHallway:{x:430,y:130,xin:1000,yin:360},
    dorm: { x: 580, y : 570},
    closetGame: { x: 100, y: 590 }, 
    card :{x:500,y:500},
    ending:{x:0,y:0}
}

export let player = {
    state : "classroom",
    mode: "",
    x : 1000,
    y: 600,
    width : 80,
    height: 80,
    speed : 10,
    key: 10,
    interaction:true,

    
    init(){
        this.x = playerState[this.state].x;
        this.y = playerState[this.state].y;

    },
    move(canvas, maplist,callback) {
        const prevX = this.x;
      const prevY = this.y;

    if (this.state === 'closetGame') {
    // closetGame에서는 좌우 이동만 허용
    if (Input.isPressed('a')) this.x -= this.speed;
    if (Input.isPressed('d')) this.x += this.speed;
    } else {
    // 나머지 맵에서는 모든 방향 허용
    if (Input.isPressed('w')) this.y -= this.speed;
    if (Input.isPressed('s')) this.y += this.speed;
    if (Input.isPressed('a')) this.x -= this.speed;
    if (Input.isPressed('d')) this.x += this.speed;
  }

        //캔버스 밖으로 못 나가게 처리(x)
        if (this.x < 0) this.x = 0; 
        if (this.x + this.width > canvas.width)
        this.x = canvas.width - this.width;
        //캔버스 밖으로 못 나가게 처리(y)
        if (this.y < 0) this.y = 0;
        if (this.y + this.height > canvas.height)
        this.y = canvas.height - this.height;

        //obstacles와 충돌 처리 함수 호출
        for (let obs of maplist[this.state].obstacles){
            if (isColliding(this, obs)&&(this.key == obs.key||obs.key==-1)) {
            this.x = prevX;
            this.y = prevY;
            }
        }

        //interaction 객체와 충돌시 충돌 처리는 안하고 idalog 함수 호출
        let isCollidingAny = false;
        for (let obs of maplist[this.state].interaction){
          if(isColliding(this, obs)&&obs.name=='whereToGo'){
            showWhereToGo(obs,callback,canvas)
            isCollidingAny = true;
            break;
          }
          else if (isColliding(this, obs)&&(this.key == obs.key||obs.key==-1)&&this.interaction) {
            showDialog(obs,callback,canvas);
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
    if (this.state === 'closetGame') {
        const img = imageAssets.cart;
        if (img && img.complete && img.naturalWidth > 0) {
            ctx.drawImage(img, this.x, this.y, this.width, this.height);
        } else {
            // 이미지 로드 실패 시 fallback
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    } else {
        // 기본 그리기 방식
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
,

}


