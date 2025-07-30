export const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');

const tutorialImages = [
  "/images/dorm.jpg",
  "/images/card.jpg",
  "/images/robot.jpg", // 마지막 이미지
];

let currentImageIndex = 0;

// 이미지 표시용 DOM 생성
const tutorialPage = document.getElementById("tutorialPage");
const tutorialImage = document.createElement("img");
tutorialImage.style.width = "110%";
tutorialImage.style.height = "auto";
tutorialImage.src = tutorialImages[currentImageIndex];
tutorialPage.innerHTML = ""; // 기존 튜토리얼 텍스트 제거
tutorialPage.appendChild(tutorialImage);

// 다음 버튼 생성
const nextBtn = document.createElement("button");
nextBtn.id = "nextBtn";
nextBtn.innerText = "다음";
nextBtn.style.position = "absolute";
nextBtn.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
nextBtn.style.padding = "10px";
nextBtn.style.border = "2px solid #333";
nextBtn.style.borderRadius = "0px";
nextBtn.style.textAlign = "center";
nextBtn.style.fontSize = "17px";
nextBtn.style.zIndex = "1000";
tutorialPage.appendChild(nextBtn);

// 버튼 위치 갱신 함수
function updateButtonPosition() {
  const tutorialRect = tutorialPage.getBoundingClientRect();
  nextBtn.style.position = "absolute";
  nextBtn.style.left = `${tutorialRect.left + tutorialRect.width - 120}px`;
  nextBtn.style.top = `${tutorialRect.top + tutorialRect.height - 100}px`;
}


// 이미지 로딩 완료 후 버튼 위치 갱신
tutorialImage.onload = updateButtonPosition;

// 창 리사이즈 시에도 버튼 위치 갱신
window.addEventListener("resize", updateButtonPosition);

nextBtn.onclick = () => {
  if (currentImageIndex < tutorialImages.length - 1) {
    currentImageIndex++;
    tutorialImage.src = tutorialImages[currentImageIndex];

    // 마지막 이미지면 버튼 텍스트 변경
    if (currentImageIndex === tutorialImages.length - 1) {
      nextBtn.innerText = "튜토리얼 완료";
    }
  } else {
    completeTutorial();
  }
};
