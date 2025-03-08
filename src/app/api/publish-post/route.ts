import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// 문자열을 YAML 메타데이터에 안전하게 저장하기 위한 함수
function escapeYamlString(str: string): string {
  // 줄바꿈 제거
  let result = str.replace(/\n/g, ' ');
  
  // 여러 공백을 하나로 치환
  result = result.replace(/\s+/g, ' ');
  
  // 따옴표 이스케이프
  result = result.replace(/"/g, '\\"');
  
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const { markdown, videoId, description } = await request.json();
    
    if (!markdown) {
      return NextResponse.json({ error: "마크다운 내용이 없습니다." }, { status: 400 });
    }
    
    if (!videoId) {
      return NextResponse.json({ error: "비디오 ID가 없습니다." }, { status: 400 });
    }
    
    // 마크다운에서 제목 추출
    const titleMatch = markdown.match(/^# (.+)$/m);
    const title = titleMatch ? titleMatch[1] : "Untitled Post";
    
    // 현재 날짜 생성
    const now = new Date();
    
    // 파일명 생성 (videoId 사용)
    const filename = `${videoId}.md`;
    
    // description 처리
    let safeDescription = description || "유튜브 영상에서 생성된 게시글";
    
    // 안전한 YAML 문자열로 변환
    safeDescription = escapeYamlString(safeDescription);
    
    // 메타데이터 추가
    const postContent = `---
title: "${escapeYamlString(title)}"
description: "${safeDescription}"
date: "${now.toISOString()}"
videoId: "${videoId}"
---

${markdown}`;
    
    // posts 디렉토리가 없으면 생성
    const postsDir = path.join(process.cwd(), "posts");
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
    }
    
    // 파일 저장
    const filePath = path.join(postsDir, filename);
    fs.writeFileSync(filePath, postContent, "utf-8");
    
    return NextResponse.json({ success: true, filename, videoId });
  } catch (error) {
    console.error("Error publishing post:", error);
    return NextResponse.json({ error: "게시글 발행 중 오류가 발생했습니다." }, { status: 500 });
  }
} 