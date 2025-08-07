import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-functions.js";

const firebaseConfig = {
apiKey: "AIzaSyBfY_44GOUnR56gnEXHQwh6OlUhwRV2zyE",
authDomain: "hana-ti-823aa.firebaseapp.com",
projectId: "hana-ti-823aa",
storageBucket: "hana-ti-823aa.appspot.com",
messagingSenderId: "17045800604",
appId: "1:17045800604:web:9951ad78ef8dc61d008f59",
};

const app = initializeApp(firebaseConfig);

const functions = getFunctions(app); // 기본 프로젝트 함수 인스턴스
const mainFunction = httpsCallable(functions, 'mainFunction'); // 함수명 맞춰서 지정

export const obstacles = [];
export const interaction = [];

// 🧠 진우쌤 상황 프롬프트
const situationPrompt = 
`너는 대한민국 고등학교 기숙사의 사감 선생님 ‘진우쌤’이다.

기본 성격:
- 규칙은 철저히 지킨다. 
- 학생이 규칙을 어기는 요청을 하면 짧고 단호하게 거절한다.
- 장난에는 툴툴대며 반응하고, 감정적인 상황엔 짧게 위로한다.
- AI처럼 과하게 친절하거나 길게 설명하지 않는다.

말투:
- 존댓말을 80%, 반말/혼냄을 20% 섞는다.
- 짧고 현실적인 문장을 사용한다.
- 같은 말을 반복하지 않고, 규칙을 모르면 지적한다.
- 윗사람에게 하듯 공손한 말투를 쓰지 않는다.

대화 규칙:
- 학생이 인사하면 손에 그거 라면 껍데기 뭡니까? 라고 물어본다
- 벌점을 부과하지 않기로 결정할 시: "다녀오세요"라는 말을 포함해 대답한다
- 용서 하는 경우가 아니라면 "다녀오세요"라는 말을 대화에 넣지 않는다. 
- 규칙 위반 시: 조용히 지적한다.
- 주제는 계속해서 기숙사 내 라면 취식으로 유지하며, 학생이 주제 외 이야기를 하면 혼낸다. 
- 웬만해서는 벌점을 부과한다. 벌점을 부과하면 다녀오세요라는 말을 사용하면 안된다. 
- 학생이 죄송하다고 말해도 웬만하면 벌점을 부과한다. 
- 학생이 벌점 부과를 인정하면 라면 취식이 다른 룸메이트들에게 피해가 간다는 걸 지적하며 마저 혼낸다

대화 상황:
- 원래 기숙사 내부에서 라면을 먹으면 안되지만, 라면 껍데기를 버리러 나온 학생을 발견했다. 

지금부터 너는 진우쌤처럼 응답해야 한다.`;

let summary = "이전 대화 없음.";
let history = [];
const name = "진우쌤"
let conCount = 0
let text = '대화 시작'
// -----------------------------------------------------------
//실패, 성공 시 메시지 띄우는 함수 정의
//------------------------------------------------------------
export function showEndMessage(message, delay = 1500, player,loadMap) {
  if(!document.getElementById('messageBox')){
  const canvasRect = canvas.getBoundingClientRect();
  const messageBox = document.createElement('div');
  messageBox.id = 'messageBox'
  messageBox.style.position = "absolute";
  messageBox.style.left = `${canvasRect.left + canvasRect.width / 2}px`;
  messageBox.style.top = `${canvasRect.top + canvasRect.height / 2}px`;
  messageBox.style.transform = 'translate(-50%, -50%)';
  messageBox.className = 'messageBox';
  messageBox.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
  messageBox.style.padding = "20px";
  messageBox.style.border = "2px solid #333";
  messageBox.style.borderRadius = "5px";
  messageBox.style.fontSize = "20px";
  messageBox.style.color = "#000";
  messageBox.style.zIndex = "1000";
  messageBox.textContent = message;
  document.body.appendChild(messageBox);
  
    setTimeout(() => {
        messageBox.remove(); //잠깐 기다렸다가 메시지박스 제거

        if(message=='성공! 이제 교교로 가서 로봇을 살펴보자!'){
            player.key = 2
            console.log(`player key is changed to${player.key}`)
            player.state = 'dormHallway';
            player.interaction = true;
            player.x = 500;
            player.y = 500;
            loadMap('dormHallway');
            return;
        }
        else if(message=='실패 ㅠㅠ'){
          console.log(`player key is changed to${player.key}`)
          player.state = 'cardGame';
          player.x = 650;
          player.y = 450;
          loadMap('dormHallway');
          return;
        }
    }, delay);
  }
}

// -----------------------------------------------------------
//본 함수
//------------------------------------------------------------
export function showConversation(player, loadMap) {
  if (!document.getElementById("startContainer")) {

    const container = document.createElement("div");
    container.id = "startContainer";
container.innerHTML = `
  <div id="dialogueBox">
    <div id="nameTag">사감 선생님</div>
    <div id="dialogueText">${text}</div>
    <div id="inputArea">
      <input type="text" id="myInput" placeholder="내용을 입력하세요">
      <button id="sendBtn">▶</button>
    </div>
  </div>
`;
    console.log('stt')

Object.assign(container.style, {
  position: 'absolute',
  bottom: '15%', left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: 'rgba(0,0,0,0.7)',
  color: 'white',
  width: '80%',
  padding: '20px',
  borderRadius: '10px',
  fontSize: '18px',
  zIndex: '1000',
  fontFamily: 'sans-serif',
});

// 이름 태그
const nameTag = container.querySelector('#nameTag');
Object.assign(nameTag.style, {
  fontWeight: 'bold',
  fontSize: '20px',
  marginBottom: '8px',
  color: '#ffd700',
});

// 대화 텍스트
const dialogueText = container.querySelector('#dialogueText');
Object.assign(dialogueText.style, {
  marginBottom: '12px',
  lineHeight: '1.5',
});

// 입력창 + 버튼
const inputArea = container.querySelector('#inputArea');
Object.assign(inputArea.style, {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '10px',
});

const inputBox = container.querySelector('#myInput');
Object.assign(inputBox.style, {
  flex: '1',
  padding: '8px',
  marginRight: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
});

const sendBtn = container.querySelector('#sendBtn');
Object.assign(sendBtn.style, {
  padding: '8px 12px',
  backgroundColor: '#444',
  color: '#fff',
  borderRadius: '5px',
  cursor: 'pointer',
});


    document.body.appendChild(container);

        if(conCount==0){
      showEndMessage('사감선생님께 라면 껍데기를 들켰다! 5번의 대화 안에 기숙사 내 라면 취식에 대해 해명하세요!',4000,player,loadMap)
    }
    if(text.includes('다녀오세요')){
      document.body.appendChild(container);
      setTimeout(() => {
      container.remove()},1000)
      showEndMessage('성공! 이제 교교로 가서 로봇을 살펴보자!', 3500, player, loadMap)
    }
    else if(conCount>=5){
     document.body.appendChild(container);
      setTimeout(() => {
      container.remove()},1000)    
      showEndMessage('실패 ㅠㅠ', 1500, player,loadMap)
    }

   //대화 입력 버튼 클릭시:
    document.getElementById("sendBtn").addEventListener("click", async () => {

      const input = document.getElementById("myInput");
      const userText = input.value;
      if (!userText) return;
      input.value = "";

      try {
        const answer = await mainFunction({
          history: history,
          summary: summary,
          name: name,
          situationPrompt: situationPrompt,
          inputText: userText,
          }
        );
        // Firebase callable 함수 응답은 .data에 담겨 있음
        const result = answer.data;
        history = result.history;
        summary = result.summary;
        text = result.reply;
        container.remove()
        conCount++
        console.log(conCount)

      } catch (error) {
        console.error("함수 호출 에러:", error);
        alert("서버 호출 중 오류가 발생했습니다.");
      }
    });
        document.getElementById("myInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        document.getElementById("sendBtn").click();
    }
    });
  }

}
