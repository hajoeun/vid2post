# API 엔드포인트 사용 가이드

이 문서는 `/api/generate-post` 엔드포인트의 사용 방법을 설명합니다.

## 기본 사용법

### 요청 형식

```ts
POST /api/generate-post

{
  "youtubeUrl": "https://www.youtube.com/watch?v=YOUTUBE_VIDEO_ID",
  "aiProvider": "ollama" // 선택 사항, 기본값은 "ollama"
}
```

### 매개변수

- `youtubeUrl` (필수): 유튜브 영상 URL. 전체 URL이나 유튜브 ID를 포함한 URL 형식이 가능합니다.
- `aiProvider` (선택): 요약에 사용할 AI 제공자. 현재 지원 값: "ollama" (기본값)

### 응답 형식

```ts
{
  "markdown": "생성된 마크다운 콘텐츠",
  "description": "한 줄 요약",
  "meta": {
    "usedMockData": Boolean, // 실제 자막을 가져오지 못해 모의 데이터를 사용했는지 여부
    "captionsCount": Number, // 처리된 자막 수
    "timestampsCount": Number, // 발견된 타임스탬프 수
    "groupsCount": Number, // 나뉜 섹션 그룹 수
    "aiProvider": String // 사용된 AI 제공자
  },
  "videoId": "YOUTUBE_VIDEO_ID"
}
```

## 오류 응답

```ts
{
  "error": "오류 메시지"
}
```

## 지원 예정 AI 제공자

현재는 "ollama"만 지원되지만, 향후 다음 제공자가 추가될 예정입니다:

- `openai`: OpenAI의 ChatGPT/GPT-4 사용
- `gemini`: Google의 Gemini 모델 사용
- `claude`: Anthropic의 Claude 모델 사용

## 사용 예시

### cURL

```bash
curl -X POST \
  https://yourdomain.com/api/generate-post \
  -H 'Content-Type: application/json' \
  -d '{
    "youtubeUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "aiProvider": "ollama"
  }'
```

### JavaScript (Fetch)

```javascript
const response = await fetch('/api/generate-post', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    aiProvider: 'ollama' // 선택 사항
  }),
});

const data = await response.json();
```

## 시스템 설계

이 API는 SOLID 원칙과 Template Method 패턴을 적용하여 설계되었습니다:

### 클래스 구조

- `AISummaryService` (인터페이스): 모든 AI 서비스가 구현해야 하는 메서드 정의
- `BaseAIService` (추상 클래스): 공통 로직을 포함하며 API 호출 부분만 추상화
- `OllamaAIService`: Ollama API를 사용하여 `BaseAIService` 구현
- 향후 지원 예정: `OpenAIService`, `GeminiService`, `ClaudeService`

### 새로운 AI 제공자 추가 방법

새로운 AI 제공자를 추가하려면:

1. `BaseAIService`를 상속받는 새 클래스 생성
2. `callAIService` 메서드 구현 (해당 API 호출 로직 구현)
3. `isAIServiceUnavailable` 메서드 구현 (해당 API 사용 가능 여부 확인)
4. `AISummaryServiceFactory.createService` 메서드에 새 case 추가

각 AI 제공자 별로 필요한 환경 변수:

- Ollama: `OLLAMA_API_URL`, `OLLAMA_API_AVAILABLE`
- OpenAI: `OPENAI_API_KEY`
- Gemini: `GEMINI_API_KEY`
- Claude: `CLAUDE_API_KEY`

## 환경 설정 예시

`.env.local` 파일에 다음 환경 변수를 설정하세요:

```
# 필수 API 키
YOUTUBE_API_KEY=your_youtube_api_key

# Ollama 설정
OLLAMA_API_URL=http://localhost:11434/api
OLLAMA_API_AVAILABLE=true

# 다른 AI 제공자 설정 (사용 시 주석 해제)
# OPENAI_API_KEY=your_openai_api_key
# GEMINI_API_KEY=your_gemini_api_key
# CLAUDE_API_KEY=your_claude_api_key
``` 