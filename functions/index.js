/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// V2 API에서 onCall과 runWith 불러오기
const {onCall} = require("firebase-functions/v2/https");

// 비밀 키 불러오기
const {defineSecret} = require("firebase-functions/params");

// fetch 사용
const fetch = require("node-fetch");

// Firebase V1에서 전역 옵션 세팅할 때만 사용
const {setGlobalOptions} = require("firebase-functions");
setGlobalOptions({maxInstances: 10});

// 비밀 키 정의
const openaiKey = defineSecret("OPENAI_KEY");
const {HttpsError} = require("firebase-functions/v2/https");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({maxInstances: 10});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
/**
//  * 대화 내역을 요약하는 함수입니다.
 * @param {string} name - 사용자 이름
 * @param {Array} history - 사용자의 이전 활동 기록
 * @param {string} summary - 간단한 요약 정보
 * @param {string} key - 인증 키 또는 식별자
//  * @param {SecretParam} key - OpenAI API 키 시크릿 객체
//  * @return {Promise<string>} 요약된 텍스트를 반환합니다.
//  */
async function updateSummary(name, history, summary, key) {
  if (history.length < 4) return;

  const messages = [
    {role: "system",
      content: `다음 대화를 ${name} 관점에서 요약해줘. 규칙 위반 여부나 요청 승인 중심으로 간결히.`},
    ...history.slice(-6),
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`, // ← 본인 키로 대체
    },
    body: JSON.stringify({
      model: "gpt-4-1106-preview", // 또는 gpt-4o
      messages,
      temperature: 0.3,
    }),
  });
  if (!response.ok) {
    console.error("OpenAI API 오류:", await response.text());
    throw new HttpsError("internal", "OpenAI 호출 실패");
  }

  const result = await response.json();
  const newSummary = result.choices?.[0]?.message?.content || summary;
  return newSummary;
}

//
//
//
//
exports.mainFunction =
onCall({secrets: [openaiKey]}, async (data, context) => {
  const name = data.data.name;
  const history = data.data.history;
  const summary = data.data.summary;
  const situationPrompt = data.data.situationPrompt;
  const inputText = data.data.inputText;

  history.push({role: "user", content: inputText});
  const fullPrompt = [
    {role: "system", content: situationPrompt},
    {role: "system", content: `이전 대화 요약: ${summary}`},
    ...history.slice(-4),
    // {role: "system", content: "안녕"},
  ];
  const key = openaiKey.value();
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "gpt-4-1106-preview",
      messages: fullPrompt,
      temperature: 0.7,
    }),
  });
  if (!response.ok) {
    console.error("OpenAI API 오류:", await response.text());
    throw new HttpsError("internal", "OpenAI 호출 실패");
  }

  const aiData = await response.json();
  const reply = aiData.choices?.[0]?.message?.content || "응답 실패";
  history.push({role: "assistant", content: reply});
  const newSummary = await updateSummary(name, history, summary, key);
  const conversation = {
    reply: reply,
    history: history,
    summary: newSummary};
  return conversation;
});
