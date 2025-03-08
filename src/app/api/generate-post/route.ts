import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { getSubtitles } from 'youtube-captions-scraper';

// 유튜브 ID 추출 함수
function extractYoutubeId(url: string): string | null {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}

// 타임스탬프 추출 함수
function extractTimestamps(description: string): { title: string; timestamp: string; seconds: number }[] {
  const timestampRegex = /(?:^|\n)([^:\n]+)(?:\s+)?(\d+:\d+(?::\d+)?)/g;
  const timestamps: { title: string; timestamp: string; seconds: number }[] = [];
  let match;

  while ((match = timestampRegex.exec(description)) !== null) {
    // 타이틀에서 끝에 있는 숫자와 공백 제거
    let title = match[1].trim();
    title = title.replace(/\s+\d+$/, '');
    
    const timestamp = match[2].trim();
    
    // 타임스탬프를 초로 변환
    const parts = timestamp.split(':').map(Number);
    let seconds = 0;
    
    if (parts.length === 2) { // MM:SS 형식
      seconds = parts[0] * 60 + parts[1];
    } else if (parts.length === 3) { // HH:MM:SS 형식
      seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    
    timestamps.push({ title, timestamp, seconds });
  }
  
  return timestamps;
}

// 자막 타입 정의
interface Caption {
  text: string;
  startTime: number;
  duration: number;
}

// 자막 그룹화 함수
function groupCaptionsByTimestamps(captions: Caption[], timestamps: { title: string; timestamp: string; seconds: number }[]): { title: string; captions: string[] }[] {
  if (!timestamps.length) {
    console.log("[자막 그룹화] 타임스탬프가 없습니다. 자동으로 섹션을 나눕니다.");
    // 비동기 함수를 동기적으로 처리하기 위해 빈 배열 반환 후 나중에 채움
    return [{ title: "콘텐츠 로딩 중...", captions: captions.map(c => c.text) }];
  }
  
  const groups: { title: string; captions: string[] }[] = [];
  
  // 타임스탬프 기준으로 자막 그룹화
  for (let i = 0; i < timestamps.length; i++) {
    const currentTimestamp = timestamps[i];
    const nextTimestamp = timestamps[i + 1];
    const startTime = currentTimestamp.seconds;
    const endTime = nextTimestamp ? nextTimestamp.seconds : Infinity;
    
    const groupCaptions = captions
      .filter(caption => {
        return caption.startTime >= startTime && caption.startTime < endTime;
      })
      .map(caption => caption.text);
    
    groups.push({
      title: currentTimestamp.title,
      captions: groupCaptions
    });
  }
  
  return groups;
}

// 자막을 자동으로 섹션으로 나누는 함수
async function autoSegmentCaptions(captions: Caption[]): Promise<{ title: string; captions: string[] }[]> {
  console.log("[자동 섹션 분할] 자막을 자동으로 섹션으로 나누는 중...");
  
  // 자막이 너무 적으면 하나의 섹션으로 처리
  if (captions.length < 20) {
    console.log("[자동 섹션 분할] 자막이 너무 적어 하나의 섹션으로 처리합니다.");
    return [{ title: "전체 내용 요약", captions: captions.map(c => c.text) }];
  }
  
  // 자막을 일정 크기의 청크로 나누기 (약 3-5분 단위)
  const CHUNK_SIZE = 30; // 약 30개의 자막을 하나의 청크로 (일반적으로 2-3분 분량)
  const chunks: Caption[][] = [];
  
  for (let i = 0; i < captions.length; i += CHUNK_SIZE) {
    chunks.push(captions.slice(i, i + CHUNK_SIZE));
  }
  
  console.log(`[자동 섹션 분할] ${chunks.length}개의 청크로 나누었습니다.`);
  
  // 각 청크에 대해 제목 생성
  const groups: { title: string; captions: string[] }[] = [];
  
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const chunkText = chunk.map(c => c.text).join(' ');
    
    // 청크에 대한 제목 생성
    const title = await generateSectionTitle(chunkText, i + 1);
    
    groups.push({
      title,
      captions: chunk.map(c => c.text)
    });
    
    console.log(`[자동 섹션 분할] 청크 ${i+1}/${chunks.length}에 대한 제목 생성: ${title}`);
  }
  
  return groups;
}

// 섹션 제목 생성 함수
async function generateSectionTitle(text: string, sectionNumber: number): Promise<string> {
  try {
    console.log(`[섹션 제목 생성] 섹션 ${sectionNumber} 제목 생성 중...`);
    
    // Ollama API가 사용 불가능한 환경(예: Vercel)에서는 기본 제목 반환
    if (process.env.OLLAMA_API_AVAILABLE === 'false') {
      console.log(`[섹션 제목 생성] Ollama API 사용 불가능 - 기본 제목 반환`);
      return `주요 내용 파트 ${sectionNumber}`;
    }
    
    const response = await fetch(process.env.OLLAMA_API_URL + "/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "exaone3.5",
        prompt: `당신은 유튜브 영상의 자막을 분석하여 적절한 섹션 제목을 생성하는 전문가입니다. 
        
        다음은 유튜브 영상 자막의 일부입니다. 이 내용을 가장 잘 표현하는 짧은 제목(5-7단어 이내)을 생성해주세요.
        
        중요한 규칙:
        1. 제목은 5-7단어 이내로 짧고 간결하게 작성하세요.
        2. 내용의 핵심 주제나 개념을 포함해야 합니다.
        3. "소개", "결론" 같은 일반적인 단어는 피하고 구체적인 내용을 담으세요.
        4. 번호를 포함하지 마세요 (예: "파트 1" 같은 표현 금지).
        5. 제목만 작성하고 다른 설명은 포함하지 마세요.
        6. 따옴표나 기타 특수문자를 포함하지 마세요.
        7. 제목 끝에 마침표를 넣지 마세요.
        8. 숫자만으로 된 제목은 절대 사용하지 마세요.
        9. 의미 있는 단어로 구성된 제목을 만드세요.
        
        자막 내용:
        ${text.length > 1000 ? text.substring(0, 1000) + "..." : text}
        
        제목 (5-7단어 이내):`,
        temperature: 0.3,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error("Ollama API 요청 실패");
    }

    const data = await response.json();
    
    // 결과 후처리: 따옴표 제거, 마침표 제거
    let title = data.response.trim();
    
    // 따옴표 제거
    title = title.replace(/["']/g, '');
    
    // 마침표 제거
    title = title.replace(/\.$/, '');
    
    // 숫자만 있는 제목인 경우 기본 제목으로 대체
    if (/^\d+$/.test(title)) {
      title = `주요 내용 파트 ${sectionNumber}`;
    }
    
    // 빈 제목인 경우 기본 제목으로 대체
    if (!title || title.trim() === '') {
      title = `주요 내용 파트 ${sectionNumber}`;
    }
    
    console.log(`[섹션 제목 생성 완료] 결과: ${title}`);
    return title;
  } catch (error) {
    console.error("섹션 제목 생성 중 오류 발생:", error);
    return `주요 내용 파트 ${sectionNumber}`;
  }
}

// 유튜브 자막 가져오기 (youtube-captions-scraper 패키지 사용)
async function fetchTranscript(videoId: string): Promise<Caption[]> {
  try {
    console.log(`[자막 추출 시작] 비디오 ID: ${videoId}`);
    
    // youtube-captions-scraper 패키지를 사용하여 자막 가져오기
    console.log("[자막 추출] 한국어 자막 시도 중...");
    let subtitles;
    try {
      subtitles = await getSubtitles({
        videoID: videoId,
        lang: 'ko' // 한국어 자막 요청
      });
      console.log("[자막 추출 성공] 한국어 자막을 찾았습니다.");
    } catch {
      console.log("[자막 추출] 한국어 자막을 찾지 못했습니다. 자동 생성된 한국어 자막 시도 중...");
      try {
        subtitles = await getSubtitles({
          videoID: videoId,
          lang: 'ko',
          auto: true
        });
        console.log("[자막 추출 성공] 자동 생성된 한국어 자막을 찾았습니다.");
      } catch {
        console.log("[자막 추출] 자동 생성된 한국어 자막을 찾지 못했습니다. 영어 자막 시도 중...");
        try {
          subtitles = await getSubtitles({
            videoID: videoId,
            lang: 'en'
          });
          console.log("[자막 추출 성공] 영어 자막을 찾았습니다.");
        } catch {
          console.log("[자막 추출] 영어 자막을 찾지 못했습니다. 자동 생성된 영어 자막 시도 중...");
          subtitles = await getSubtitles({
            videoID: videoId,
            lang: 'en',
            auto: true
          });
          console.log("[자막 추출 성공] 자동 생성된 영어 자막을 찾았습니다.");
        }
      }
    }
    
    // 자막 형식 변환
    const captions = subtitles.map((item: { text: string; start: string; dur: string }) => ({
      text: item.text,
      startTime: parseFloat(item.start),
      duration: parseFloat(item.dur)
    }));
    
    console.log(`[자막 추출 완료] 총 ${captions.length}개의 자막을 가져왔습니다.`);
    console.log("[자막 샘플]", captions.slice(0, 5));
    
    return captions;
  } catch (error) {
    console.error("[자막 추출 실패]", error);
    throw error;
  }
}

// 대체 자막 생성 함수 - 더 풍부한 예시 데이터
function getMockCaptions(): Caption[] {
  return [
    { text: "안녕하세요 여러분", startTime: 0, duration: 2 },
    { text: "오늘은 재미있는 주제에 대해 이야기해보려고 합니다", startTime: 2, duration: 3 },
    { text: "시작하기 전에 구독과 좋아요 부탁드립니다", startTime: 5, duration: 2.5 },
    { text: "오늘의 주제는 인공지능과 미래 기술입니다", startTime: 7.5, duration: 3 },
    { text: "인공지능은 우리 생활의 많은 부분을 변화시키고 있습니다", startTime: 10.5, duration: 3.5 },
    { text: "특히 자연어 처리 분야에서 큰 발전이 있었죠", startTime: 14, duration: 3 },
    { text: "이제 컴퓨터가 인간의 언어를 이해하고 생성할 수 있게 되었습니다", startTime: 17, duration: 4 },
    { text: "이런 기술은 번역, 요약, 질의응답 등 다양한 분야에 활용됩니다", startTime: 21, duration: 4 },
    { text: "앞으로 더 발전된 기술이 우리 삶을 어떻게 변화시킬지 기대됩니다", startTime: 25, duration: 4 },
    { text: "여러분의 의견도 댓글로 남겨주세요", startTime: 29, duration: 3 },
    { text: "다음 영상에서 또 만나요!", startTime: 32, duration: 2 }
  ];
}

// Ollama API를 사용하여 텍스트 요약
async function summarizeText(text: string, title: string): Promise<string> {
  try {
    console.log(`[요약 시작] 제목: ${title}, 자막 길이: ${text.length}자`);
    
    // 자막 샘플 로깅 (너무 길면 일부만)
    const sampleText = text.length > 200 ? text.substring(0, 200) + "..." : text;
    console.log(`[요약 자막 샘플] ${sampleText}`);
    
    // Ollama API가 사용 불가능한 환경(예: Vercel)에서는 모의 데이터 반환
    if (process.env.OLLAMA_API_AVAILABLE === 'false') {
      console.log(`[요약] Ollama API 사용 불가능 - 모의 데이터 반환`);
      return `${title}에 관한 내용입니다. 이 부분은 실제 배포 환경에서 Ollama API가 사용 불가능할 때 표시됩니다. 로컬 개발 환경에서는 실제 API를 사용하여 요약을 생성합니다.`;
    }
    
    const response = await fetch(process.env.OLLAMA_API_URL + "/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "exaone3.5",
        prompt: `당신은 유튜브 영상의 자막을 요약하여 블로그 게시글로 만드는 전문가입니다. 
        
        다음은 유튜브 영상의 자막입니다. 이 내용을 정확하게 요약해서 블로그 게시글 형식으로 작성해주세요.
        
        중요한 규칙:
        1. 자막에 없는 내용은 절대 추가하지 마세요.
        2. 자막의 핵심 내용만 간결하게 요약하세요.
        3. 원래 자막의 의미를 왜곡하지 마세요.
        4. 자막에서 언급된 주요 개념과 아이디어만 포함하세요.
        5. 블로그 형식으로 작성하되, 내용의 정확성을 최우선으로 하세요.
        6. 절대로 "이 요약은..." 또는 "이 게시글은..." 같은 메타 설명을 포함하지 마세요.
        7. 요약의 정확성이나 작성 방식에 대한 설명을 추가하지 마세요.
        8. 오직 자막 내용만 요약하고, 요약 자체에 대한 설명은 하지 마세요.
        9. 게시글과 무관한 내용(예: "이 요약은 유튜브 자막에서 제시된 핵심 아이디어를 반영합니다")을 추가하지 마세요.
        10. 직접적으로 내용만 작성하고, 메타 정보나 설명은 완전히 제외하세요.
        11. 제목이나 소제목을 포함하지 마세요. 제목은 이미 별도로 추가됩니다.
        12. 절대로 "### 제목" 형식의 마크다운 제목을 포함하지 마세요.
        13. 요약 내용만 작성하고, 제목이나 소제목은 완전히 제외하세요.
        
        제목: ${title}
        
        자막:
        ${text}
        
        요약(제목 없이 내용만 작성):`,
        temperature: 0.5,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error("Ollama API 요청 실패");
    }

    const data = await response.json();
    
    // 요약 결과 샘플 로깅
    const responseSample = data.response.length > 200 ? data.response.substring(0, 200) + "..." : data.response;
    console.log(`[요약 결과 샘플] ${responseSample}`);
    console.log(`[요약 완료] 제목: ${title}, 결과 길이: ${data.response.length}자`);
    
    // 요약 텍스트에서 제목이 포함되어 있는지 확인하고 제거
    let cleanedText = data.response;
    
    // 요약 텍스트가 제목으로 시작하는 경우 제거 (### 형식)
    const titlePattern1 = new RegExp(`^###\\s*${title}\\s*\n`, 'i');
    cleanedText = cleanedText.replace(titlePattern1, '');
    
    // 요약 텍스트가 제목으로 시작하는 경우 제거 (## 형식)
    const titlePattern2 = new RegExp(`^##\\s*${title}\\s*\n`, 'i');
    cleanedText = cleanedText.replace(titlePattern2, '');
    
    // 요약 텍스트가 제목으로 시작하는 경우 제거 (일반 텍스트 형식)
    const titlePattern3 = new RegExp(`^${title}\\s*\n`, 'i');
    cleanedText = cleanedText.replace(titlePattern3, '');
    
    return cleanedText;
  } catch (error) {
    console.error("텍스트 요약 중 오류 발생:", error);
    return text; // 오류 발생 시 원본 텍스트 반환
  }
}

// 한 줄 요약 생성 함수
async function generateOneLineSummary(text: string, title: string): Promise<string> {
  try {
    console.log(`[한 줄 요약 시작] 제목: ${title}, 텍스트 길이: ${text.length}자`);
    
    // Ollama API가 사용 불가능한 환경(예: Vercel)에서는 모의 데이터 반환
    if (process.env.OLLAMA_API_AVAILABLE === 'false') {
      console.log(`[한 줄 요약] Ollama API 사용 불가능 - 모의 데이터 반환`);
      return `${title}에 관한 유튜브 영상 요약`;
    }
    
    const response = await fetch(process.env.OLLAMA_API_URL + "/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "exaone3.5",
        prompt: `다음은 유튜브 영상의 내용입니다. 이 내용을 정확히 한 문장으로 요약해주세요.
        
        중요한 규칙:
        1. 반드시 한 문장으로만 작성하세요 (최대 60자 이내).
        2. 핵심 내용만 간결하게 담아주세요.
        3. "이 영상은..." 또는 "이 콘텐츠는..." 같은 표현은 사용하지 마세요.
        4. 직접적으로 내용만 요약하세요.
        5. 문장 끝에 마침표를 포함하세요.
        6. 절대로 줄바꿈을 포함하지 마세요.
        7. 절대로 번호 매기기나 목록을 포함하지 마세요.
        8. 절대로 여러 문장으로 나누지 마세요.
        9. 한 줄의 짧은 문장으로만 작성하세요.
        
        제목: ${title}
        
        내용:
        ${text}
        
        한 줄 요약 (60자 이내, 줄바꿈 없이):`,
        temperature: 0.3,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error("Ollama API 요청 실패");
    }

    const data = await response.json();
    
    // 결과 후처리: 줄바꿈 제거, 길이 제한, 마침표 확인
    let summary = data.response.trim();
    
    // 줄바꿈 제거
    summary = summary.replace(/\n/g, ' ');
    
    // 여러 공백을 하나로 치환
    summary = summary.replace(/\s+/g, ' ');
    
    // 길이 제한 (60자)
    if (summary.length > 60) {
      summary = summary.substring(0, 57) + '...';
    }
    
    // 마침표 확인
    if (!summary.endsWith('.')) {
      summary = summary + '.';
    }
    
    console.log(`[한 줄 요약 완료] 결과: ${summary}`);
    return summary;
  } catch (error) {
    console.error("한 줄 요약 생성 중 오류 발생:", error);
    return `${title}에 관한 유튜브 영상.`;
  }
}

// 마크다운 생성 함수
async function generateMarkdown(videoTitle: string, groups: { title: string; captions: string[] }[]): Promise<string> {
  console.log(`[마크다운 생성 시작] 제목: ${videoTitle}, 그룹 수: ${groups.length}`);
  
  let markdown = `# ${videoTitle}\n\n`;
  
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    console.log(`[마크다운 생성] 그룹 ${i+1}/${groups.length} 처리 중: ${group.title}`);
    
    // 섹션 제목 추가 (## 형식)
    markdown += `## ${group.title}\n\n`;
    
    const captionText = group.captions.join(' ');
    console.log(`[마크다운 생성] 그룹 ${i+1} 자막 길이: ${captionText.length}자`);
    
    // Ollama를 사용하여 자막 요약 (제목 제외)
    const summarizedText = await summarizeText(captionText, group.title);
    
    markdown += summarizedText + '\n\n';
  }
  
  console.log(`[마크다운 생성 완료] 최종 길이: ${markdown.length}자`);
  return markdown;
}

// YouTube API 초기화
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

export async function POST(request: NextRequest) {
  try {
    const { youtubeUrl } = await request.json();
    console.log(`[요청 시작] URL: ${youtubeUrl}`);
    
    const videoId = extractYoutubeId(youtubeUrl);
    
    if (!videoId) {
      console.log("[오류] 유효한 유튜브 URL이 아닙니다.");
      return NextResponse.json({ error: "유효한 유튜브 URL이 아닙니다." }, { status: 400 });
    }
    
    console.log(`[영상 정보 요청] 비디오 ID: ${videoId}`);
    
    // YouTube Data API를 통해 영상 정보 가져오기
    const videoResponse = await youtube.videos.list({
      part: ['snippet'],
      id: [videoId]
    });
    
    if (!videoResponse.data.items || videoResponse.data.items.length === 0) {
      console.log("[오류] 영상 정보를 가져올 수 없습니다.");
      return NextResponse.json({ error: "영상 정보를 가져올 수 없습니다." }, { status: 400 });
    }
    
    const videoData = videoResponse.data.items[0];
    const videoTitle = videoData.snippet?.title || "제목 없음";
    const videoDescription = videoData.snippet?.description || "";
    
    console.log(`[영상 정보 성공] 제목: ${videoTitle}`);
    
    // 자막 가져오기 시도
    let captions: Caption[];
    let usedMockData = false;
    try {
      captions = await fetchTranscript(videoId);
    } catch (error) {
      console.warn("[경고] 자막을 가져오는데 실패했습니다. 예시 데이터를 사용합니다.", error);
      captions = getMockCaptions();
      usedMockData = true;
    }
    
    // 타임스탬프 추출
    const timestamps = extractTimestamps(videoDescription);
    console.log(`[타임스탬프 추출] ${timestamps.length}개의 타임스탬프를 찾았습니다.`);
    if (timestamps.length > 0) {
      console.log("[타임스탬프 샘플]", timestamps.slice(0, 3));
    }
    
    // 자막 그룹화 (타임스탬프가 있는 경우)
    let captionGroups = groupCaptionsByTimestamps(captions, timestamps);
    console.log(`[자막 그룹화] 초기 그룹화: ${captionGroups.length}개의 그룹으로 나누었습니다.`);
    
    // 타임스탬프가 없는 경우 자동으로 섹션 나누기
    if (timestamps.length === 0) {
      console.log("[자막 그룹화] 타임스탬프가 없어 자동으로 섹션을 나눕니다.");
      captionGroups = await autoSegmentCaptions(captions);
      console.log(`[자막 그룹화] 자동 섹션 분할 완료: ${captionGroups.length}개의 그룹으로 나누었습니다.`);
    }
    
    // 마크다운 생성 (Ollama를 사용한 요약 포함)
    console.log("[마크다운 생성 시작]");
    const markdown = await generateMarkdown(videoTitle, captionGroups);
    console.log("[마크다운 생성 완료]");
    
    // 전체 자막을 하나의 텍스트로 합치기
    const allCaptionsText = captions.map(caption => caption.text).join(' ');
    
    // 한 줄 요약 생성
    console.log("[한 줄 요약 생성 시작]");
    const description = await generateOneLineSummary(allCaptionsText, videoTitle);
    console.log("[한 줄 요약 생성 완료]");
    
    return NextResponse.json({ 
      markdown,
      description,
      meta: {
        usedMockData,
        captionsCount: captions.length,
        timestampsCount: timestamps.length,
        groupsCount: captionGroups.length
      },
      videoId
    });
  } catch (error) {
    console.error("[오류] 게시글 생성 중 오류 발생:", error);
    return NextResponse.json({ error: "게시글 생성 중 오류가 발생했습니다." }, { status: 500 });
  }
} 