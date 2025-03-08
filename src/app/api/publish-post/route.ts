import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const { markdown, videoId } = await request.json();
    
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
    
    // 메타데이터 추가
    const postContent = `---
title: "${title}"
description: "유튜브 영상에서 생성된 게시글"
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