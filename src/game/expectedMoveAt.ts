import TIMELINE from './timeline';
import { AUDIO_OFFSET } from './constants';
import type { TimelineEntry } from './types';

export function expectedMoveAt(timeSec: number): TimelineEntry | null {
  const t = Math.max(0, timeSec - AUDIO_OFFSET);
  return TIMELINE.find((x) => t >= x.start && t < x.end) ?? null;
}

export function fmt(t: number): string {
  if (!isFinite(t)) return '00:00';
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
