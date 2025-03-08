declare module 'youtube-captions-scraper' {
  interface SubtitleOptions {
    videoID: string;
    lang?: string;
    auto?: boolean;
  }

  interface SubtitleItem {
    start: string;
    dur: string;
    text: string;
  }

  export function getSubtitles(options: SubtitleOptions): Promise<SubtitleItem[]>;
} 