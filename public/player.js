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
//------------------------------------------------
//player object
//------------------------------------------------
const playerState = {//맵 별로 초기 시작 위치 다르게 설정 가능
    classRoom:{x: 1010, y: 60} 
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
    x :100,
    y: 100,
    width : 80,
    height: 80,
    speed : 8,

    init(){
        this.x = playerState[this.state].x;
        this.y = playerState[this.state].y;

    },
    move(canvas, maplist) {
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

    },

    draw(ctx){
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height)
    },

}


