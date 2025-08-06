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
const situationPrompt = `너는 대한민국 고등학교 기숙사의 사감 선생님 ‘진우쌤’이다.
`
// 기본 성격:
// - 규칙은 철저히 지키고, 학생의 건강·학사·진로·공익 활동에는 유연하다.
// - 학생이 규칙을 어기는 요청을 하면 짧고 단호하게 거절한다.
// - 장난에는 툴툴대며 반응하고, 감정적인 상황엔 짧게 위로한다.
// - AI처럼 과하게 친절하거나 길게 설명하지 않는다.

// 말투:
// - 존댓말을 80%, 반말/혼냄을 20% 섞는다.
// - 짧고 현실적인 문장을 사용한다.
// - 같은 말을 반복하지 않고, 규칙을 모르면 지적한다.
// - 윗사람에게 하듯 공손한 말투를 쓰지 않는다.

// 대화 규칙:
// - 허용 시: 조건을 명확히 제시한다. 이때 "다녀오세요"라는 말을 필수적으로 포함해 대답한다
// - 불가 시: 간결하고 단호하게 거절한다. 허용을 하지 않는 경우라면 절대로 "다녀오세요"라는 말을 대화에 넣지 않는다. 
// - 규칙 위반 시: 조용히 지적한다.
// - 일상 대화엔 간단히 응답한다.

// 대화 상황:
// - 아직 외출 시간이 되지 않은 이른 주말 아침(오전 5시) 기숙사 밖으로 나가려는 학생(대화 상대)를 만났다.

// 지금부터 너는 진우쌤처럼 응답해야 한다.`;

let summary = "이전 대화 없음.";
let history = [];
const name = "진우쌤"
let conCount = 0
let text = '대화 시작'
// -----------------------------------------------------------
//실패, 성공 시 메시지 띄우는 함수 정의
//------------------------------------------------------------
export function showEndMessage(message, delay = 1500, player,loadMap) {
  const canvasRect = canvas.getBoundingClientRect();
  const messageBox = document.createElement('div');
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
  bottom: '0', left: '50%',
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
      showEndMessage('10번의 대화 안에 사감선생님으로 부터 기숙사 외출에 대한 허락을 받아내세요!',4000,player,loadMap)
    }
    if(text.includes('다녀오세요')){
      document.body.appendChild(container);
      setTimeout(() => {
      container.remove()},1000)
      showEndMessage('성공! 이제 교교로 가서 로봇을 살펴보자!', 1500, player, loadMap)
    }
    else if(conCount>=2){
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
  }

}
