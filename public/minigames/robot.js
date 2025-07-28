import { Block } from "../maps/block.js";

const canvas = document.getElementById('canvas');
const canvasRect = canvas.getBoundingClientRect();
const ctx = canvas.getContext("2d");

// -----------------------------------------------------------
//게임 시작 버튼 html DOM으로 표시
//------------------------------------------------------------
const startContainer = document.createElement("div");
startContainer.id = "startContainer";
startContainer.innerHTML = `
    <p id ='title'>로봇 조립을 방해하는 방해꾼들을 찾아야합니다!</p>
    <p class = 'text'>로봇을 조립하려려던 당신.</p>
    <p class = 'text'>지금까지의 로봇 조립에서 오류가 있다는 것을 알아냈습니다. </p>
    <p class = 'text'>설계도와 로봇의 다른 점을 찾아 클릭하세요!</p>
    <button id="startGameBtn">Start</button>`;
startContainer.classList.add("scoreDisplay")
startContainer.style.position = "absolute";
startContainer.style.left = `${canvasRect.left + canvasRect.width /2}px`;
startContainer.style.top = `${canvasRect.top + canvasRect.height /2}px`;
startContainer.style.transform = 'translate(-50%, -50%)';
startContainer.style.zIndex = 10;
//창 배경 설정
startContainer.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
startContainer.style.padding = "10px";
startContainer.style.border = "2px solid #333";
startContainer.style.borderRadius = "10px";
startContainer.style.textAlign = "center";
// -----------------------------------------------------------
//게임 실패, 성공 시 메시지 띄우는 함수 정의
//------------------------------------------------------------
export function showEndMessage(message, delay = 1500) {
    const canvasRect = canvas.getBoundingClientRect(); //canvas 외곽선 검출
    const messageBox = document.createElement('div'); //메시지 박스 DOM 생성
    messageBox.style.left = `${canvasRect.left + canvasRect.width / 2}px`; //위치 지정
    messageBox.style.top = `${canvasRect.top + canvasRect.height / 2}px`;
    messageBox.style.transform = 'translate(-50%, -50%)';
    messageBox.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    messageBox.style.padding = "10px";
    messageBox.style.border = "2px solid #333";
    messageBox.style.borderRadius = "10px";
    messageBox.style.textAlign = "center";
    messageBox.style.fontSize = "10px";  
    messageBox.style.color = "#000";     // 글씨 색 설정
    messageBox.style.zIndex = "1000"; 
    messageBox.className = 'messageBox';  // CSS 클래스 지정
    messageBox.textContent = message; //메시지는 인수로 전달
    document.body.appendChild(messageBox); //DOM 화면에 표시

    setTimeout(() => {
        messageBox.remove(); //잠깐 기다렸다가 메시지박스 제거
    }, 1500);
}


// -----------------------------------------------------------
//게임 기본 변수 설정
//------------------------------------------------------------

export let isInitialized = false; //초기와 여부 표시 변수
export let frameCount = 0; //시간 카운트용 프레임 카운트 변수

let startTime = null; 
let gameOver = false; //게임 실패 여부 표시 변수
let maxTime = 5000; // 5초

export let obstacles = [];
//found 요소를 새로 정의하기 위해 상속받아서
export class HiddenObject extends Block {
    constructor(x, y, width, height, name,imageSrc,message) {
        super(x, y, width, height, name,imageSrc);
        this.found = false;
        this.message = message;
    }
}


export let interaction = [
    new HiddenObject(940, 300, 100,100,'sahur',"/images/sahur.jpg", '로봇 조립을 방해하던 "퉁퉁퉁퉁퉁퉁 사후르"를 찾았습니다!'),
    new HiddenObject(860,500,50,100,'tralalelo','/images/tralalelo.jpg','로봇 조립을 방해하던 "트랄라레로 트랄랄라"를 찾았습니다!'),
    new HiddenObject(1020, 450, 50, 100, 'hambook','/images/hambook.jpg', '로봇 조립을 방해하던"햄부기햄북 햄북어 햄북스딱스 함부르크햄부가우가 햄비기햄부거 햄부가티햄부기온앤 온"을 차려왔습니다!')
];

// -----------------------------------------------------------
//게임 설정 초기화 함수
//------------------------------------------------------------
export function init(player) {
      for (let obs of interaction){
      obs.loadObj()
    }
    if (!document.getElementById("startContainer")) { //시작 버튼 표시
        document.body.appendChild(startContainer);
        // 제목 스타일
        document.getElementById("title").style.fontSize = "20px";
        document.getElementById("title").style.fontWeight = "bold";

        // 설명 텍스트 스타일
        document.querySelectorAll(".text").forEach(el => {
        el.style.fontSize = "14px";
});
    }
    registerClickListener()
    frameCount = 0;
    player.x = -100;
    player.y = 300;
    obstacles = [];
    startTime = performance.now();
    gameOver = false;



    const startBtn = document.getElementById("startGameBtn");
    startBtn.onclick = () => {
        isInitialized = true;
        startContainer.remove(); // 안내창 제거
    };
}


// -----------------------------------------------------------
//클릭 여부 판별
//------------------------------------------------------------

// 클릭 리스너를 한 번만 등록
let clickListenerRegistered = false;

function registerClickListener() {
  if (clickListenerRegistered) return; // 중복 방지
  clickListenerRegistered = true;
  console.log(`registered`)
  const canvas = document.getElementById("canvas");
  
  canvas.addEventListener("click", (e) => {
    const canvasRect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / canvasRect.width;    // x축 비율 보정
    const scaleY = canvas.height / canvasRect.height;  // y축 비율 보정

    const clickX = (e.clientX - canvasRect.left)*scaleX;
    const clickY =( e.clientY - canvasRect.top)*scaleY;
    console.log(`${clickX}${clickY}clicked`)
    checkHiddenObjects(clickX, clickY);
  });
}

// 클릭한 좌표와 숨은 그림들 비교
function checkHiddenObjects(x, y) {
  interaction.forEach((obj) => {
    if (!obj.found &&
        x >= obj.x && x <= obj.x + obj.width &&
        y >= obj.y && y <= obj.y + obj.height) {
      obj.found = true;
      showEndMessage(obj.message)
      // 점수 증가, 효과음 재생 등 추가 가능
    }
  });
}
// -----------------------------------------------------------
//메인 루프
//------------------------------------------------------------
export function gameLoop(player,_,loadMap){ //이걸 main.js에서 불러서 분기해서 루프 사용
    if (!isInitialized) return;

    for (let obs of interaction){
        obs.drawObj(ctx)
    }

    if (interaction.every(block => block.found === true)) {
        setTimeout(() => {
            showEndMessage("성공!");
        }, 1500); // 1초 후에 메시지 표시

        setTimeout(() => {       
            player.state = 'classroom';
            loadMap('classroom');
            player.x = 650;
            player.y = 450;
            return;
        }, 6000); // 메시지 표시 이후 0.5초 후에 맵 전환
    }


}