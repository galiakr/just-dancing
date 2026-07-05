export type Move =
  | 'getready1'
  | 'getready2'
  | 'getready3'
  | 'head'
  | 'shoulders'
  | 'knees'
  | 'toes'
  | 'eyes'
  | 'ears'
  | 'mouth'
  | 'nose'
  | 'end';

export interface TimelineEntry {
  start: number;
  end: number;
  move: Move;
}

export type GameStatus = 'idle' | 'playing' | 'paused' | 'finished';

export type FeedbackTone = 'ok' | 'bad' | null;

export interface Feedback {
  tone: FeedbackTone;
  text: string;
}

export interface PredictionLabel {
  className: string;
  probability: number;
}
