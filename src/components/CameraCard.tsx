import { SILHOUETTE_SRC } from '../game/constants';
import type { GameStatus } from '../game/types';

interface CameraCardProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  progress: number;
  timing: string;
  status: GameStatus;
  onStart: () => void;
  onPauseResume: () => void;
  onRestart: () => void;
}

export default function CameraCard({
  canvasRef,
  progress,
  timing,
  status,
  onStart,
  onPauseResume,
  onRestart,
}: CameraCardProps) {
  return (
    <section className="camera-card glass">
      <canvas
        id="canvas"
        ref={canvasRef}
        style={{ backgroundImage: `url(${SILHOUETTE_SRC})` }}
      />

      <div className="hud">
        <div className="progress-row">
          <progress value={progress} max={100} />
          <span id="timing">{timing}</span>
        </div>

        <div className="controls">
          <button onClick={onStart}>Start</button>
          <button onClick={onPauseResume}>
            {status === 'paused' ? 'Resume' : 'Pause'}
          </button>
          <button onClick={onRestart}>Restart</button>
        </div>
      </div>
    </section>
  );
}
