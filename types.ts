
export interface LyricLine {
  time: number;
  text: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  audioUrl: string;
  duration: number; // in seconds
  lyrics: LyricLine[];
}

export interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  isLiked: boolean;
  isHot: boolean;
  eqActive: boolean;
  fxActive: boolean;
}
