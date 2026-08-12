import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST 요청만 허용됩니다." });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: "서버에 OPENAI_API_KEY 환경변수가 설정되지 않았습니다."
    });
  }

  try {
    const {
      product, goal, process, temp, time, change,
      difficulty, selfCause, issues, score, imageDataUrl
    } = req.body || {};

    const instruction = `
너는 대한민국 특성화고 외식조리과 3학년 학생을 지도하는
'B-디저트 실무 AI 실습코치'이다.

목적은 학생에게 정답을 대신 주는 것이 아니라,
학생의 실습기록과 사진을 근거로 스스로 원인을 찾고
다음 실습에서 개선 행동을 선택하도록 코칭하는 것이다.

[평가 원칙]
- 사진에서 실제로 보이는 특징과 학생 기록을 구분한다.
- 사진에서 확인할 수 없는 맛, 향, 내부 조직, 정확한 수분감은 단정하지 않는다.
- 원인은 "가능성이 있다" 수준으로 표현하며 확정적으로 단정하지 않는다.
- 같은 내용을 반복하지 않는다.
- 학생이 기록한 온도/시간/공정과 사진의 특징을 연결해 설명한다.
- 안전 문제가 있으면 가장 먼저 언급한다.
- 학생 수준에 맞는 쉬운 문장으로 쓴다.
- 마지막에는 다음 실습에서 바꿀 변수는 원칙적으로 1개만 제안한다.
- 제품 사진이 없으면 사진 분석을 했다고 말하지 않는다.

다음 JSON 형식만 반환한다. 마크다운 코드블록은 사용하지 않는다.
{
  "good": "잘된 점 1~3개",
  "cause": "가능한 원인 1~3개. 줄바꿈으로 구분",
  "fix": "구체적인 개선 방법 1~3개. 줄바꿈으로 구분",
  "question": "학생이 스스로 생각하도록 만드는 질문 1개",
  "mission": "다음 실습에서 실행할 한 가지 미션",
  "metrics": {
    "process_record": 0~100,
    "cause_reasoning": 0~100,
    "reflection": 0~100
  }
}`;

    const studentText = `
[제품명]
${product || "미입력"}

[오늘의 목표]
${goal || "미입력"}

[표준 배합/공정 기록]
${process || "미입력"}

[실제 오븐 온도]
${temp || "미입력"} ℃

[실제 굽기 시간]
${time || "미입력"} 분

[실습 중 달라진 점]
${change || "없음"}

[가장 어려웠던 점]
${difficulty || "없음"}

[학생이 선택한 문제 항목]
${Array.isArray(issues) && issues.length ? issues.join(", ") : "선택 없음"}

[학생 만족도]
${score || "미입력"} / 5

[학생이 스스로 생각한 실패 원인]
${selfCause || "미입력"}
`;

    const content = [
      { type: "input_text", text: instruction + "\n\n" + studentText }
    ];

    if (imageDataUrl && typeof imageDataUrl === "string" && imageDataUrl.startsWith("data:image/")) {
      content.push({
        type: "input_image",
        image_url: imageDataUrl
      });
    }

    const response = await client.responses.create({
      // 필요하면 Vercel 환경변수 OPENAI_MODEL에서 다른 모델명으로 교체할 수 있습니다.
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input: [{
        role: "user",
        content
      }]
    });

    const text = (response.output_text || "").trim();
    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("AI 응답을 JSON으로 해석할 수 없습니다.");
      parsed = JSON.parse(match[0]);
    }

    return res.status(200).json(parsed);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error?.message || "AI 코칭 처리 중 오류가 발생했습니다."
    });
  }
}
