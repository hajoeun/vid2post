# Vid2Post

Vid2Post는 YouTube 영상을 블로그 게시글로 자동 변환해주는 웹 애플리케이션입니다. 영상의 자막을 분석하고 AI를 활용하여 구조화된 블로그 게시글을 생성합니다.

## 주요 기능

- YouTube URL을 입력하여 자막 추출
- 타임스탬프 기반 콘텐츠 구조화
- AI를 활용한 자막 요약 및 블로그 게시글 생성
- 마크다운 형식의 게시글 저장
- 다크 모드 지원
- 반응형 디자인

## 기술 스택

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- ShadCN UI 컴포넌트
- Ollama API (로컬 AI 모델)
- YouTube API

## 설치 및 실행

1. 저장소 클론:
```bash
git clone https://github.com/yourusername/vid2post.git
cd vid2post
```

2. 의존성 설치:
```bash
npm install
```

3. 환경 변수 설정:
   - `.env.example` 파일을 `.env.local`로 복사하고 필요한 값을 입력합니다.
   - YouTube API 키는 [Google Cloud Console](https://console.cloud.google.com/apis/credentials)에서 생성할 수 있습니다.
   - Ollama API URL은 로컬 개발 환경에서는 `http://localhost:11434/api`입니다.
   - `OLLAMA_API_AVAILABLE`은 로컬 개발 환경에서는 `true`로 설정합니다.

4. 개발 서버 실행:
```bash
npm run dev
```

5. 브라우저에서 `http://localhost:3000`으로 접속합니다.

## Vercel 배포

1. [Vercel](https://vercel.com)에 가입하고 GitHub 계정을 연결합니다.
2. "New Project" 버튼을 클릭하고 이 저장소를 선택합니다.
3. 환경 변수 설정:
   - `YOUTUBE_API_KEY`: YouTube API 키
   - `OLLAMA_API_URL`: Ollama API URL (Vercel에서는 외부 호스팅된 Ollama 서버 URL이 필요합니다)
   - `OLLAMA_API_AVAILABLE`: Ollama API를 사용할 수 없는 경우 `false`로 설정합니다.
4. "Deploy" 버튼을 클릭하여 배포합니다.

## 주의사항

- Ollama API는 기본적으로 로컬에서 실행되므로, Vercel에 배포할 때는 외부에서 접근 가능한 Ollama 서버가 필요합니다.
- YouTube API 키는 공개 저장소에 포함하지 마세요. 항상 환경 변수로 관리하세요.

## 라이선스

MIT
