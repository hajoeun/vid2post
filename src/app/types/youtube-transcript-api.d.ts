declare module 'youtube-transcript-api' {
  export interface TranscriptItem {
    text: string;
    offset: number;
    duration: number;
    start: number;
  }

  export class YoutubeTranscript {
    static fetchTranscript(videoId: string): Promise<TranscriptItem[]>;
  }
} 