# B-디저트 실무 AI 실습코치 — OpenAI API 연결 방법

## 가장 중요한 원칙
API 키를 `index.html`에 직접 넣지 마세요.
학생 브라우저에서 키가 노출될 수 있습니다.
키는 Vercel의 Environment Variables에 저장합니다.

---

## 1. OpenAI API 키 만들기
1. OpenAI Platform에 로그인합니다.
2. API Keys 메뉴에서 새 API 키를 만듭니다.
3. 발급된 키를 복사해 안전한 곳에 잠시 보관합니다.
4. 이 키를 학생에게 공유하지 않습니다.

※ ChatGPT Plus 구독과 API 사용요금은 별도일 수 있으므로
API Platform의 결제/사용량 설정도 확인하세요.

---

## 2. GitHub에 폴더 올리기
이 폴더의 다음 파일을 하나의 GitHub 저장소에 올립니다.

- index.html
- api/coach.js
- package.json

`.env.example`에는 실제 키가 없으므로 올려도 되지만,
실제 `.env` 파일이나 실제 API 키는 절대로 GitHub에 올리지 않습니다.

---

## 3. Vercel에 배포하기
1. Vercel에 로그인합니다.
2. `Add New` → `Project`
3. 방금 만든 GitHub 저장소를 선택합니다.
4. Deploy 합니다.

---

## 4. Vercel에 API 키 넣기
Vercel 프로젝트에서:

Settings
→ Environment Variables
→ Add

Name:
OPENAI_API_KEY

Value:
발급받은 실제 OpenAI API 키

저장 후 다시 Deploy 합니다.

선택사항:
OPENAI_MODEL

모델명을 바꾸고 싶을 때만 추가합니다.
모델 가용성은 OpenAI Platform에서 현재 계정에 사용 가능한 모델을 확인하세요.

---

## 5. 실행
배포가 끝나면 Vercel에서 사이트 주소가 생성됩니다.

예:
https://내프로젝트이름.vercel.app

학생은 이 주소만 접속하면 됩니다.
API 키는 서버에서만 사용됩니다.

---

## 6. 작동 순서
학생 입력
→ index.html
→ /api/coach
→ OpenAI API
→ JSON 코칭 결과
→ 학생 화면

사진이 있으면 이미지와 기록을 함께 전송합니다.
사진이 없으면 텍스트 기록만 분석합니다.

---

## 7. 테스트 방법
1. 학생 이름 입력
2. 동백 마들렌 선택
3. 완제품 사진 업로드
4. 온도/시간 입력
5. 자기평가 체크
6. "코칭 받기" 클릭

정상 작동하면:
- 잘한 점
- 가능한 원인
- 개선 방법
- 코치 질문
- 다음 실습 미션
이 표시됩니다.

---

## 8. 오류가 날 때
### "OPENAI_API_KEY 환경변수가 설정되지 않았습니다."
Vercel Environment Variables에 키가 없는 상태입니다.

### "Incorrect API key"
키를 다시 발급하거나 복사 상태를 확인하세요.

### 모델 관련 오류
Vercel에 `OPENAI_MODEL`을 추가하여
현재 계정에서 사용 가능한 이미지 입력 지원 모델로 바꾸세요.

### 사진이 너무 큰 경우
현재 index.html에서 업로드 전에 긴 변을 1280px로 줄여 전송하도록 설정되어 있습니다.

---

## 보안상 절대 하지 말 것
- API 키를 index.html에 적기
- API 키를 학생에게 보내기
- 실제 키가 든 .env 파일을 GitHub에 업로드하기
- 카카오톡/공개 게시판 등에 API 키 올리기

