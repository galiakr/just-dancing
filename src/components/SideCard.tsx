import { moveImageSrc, SILHOUETTE_SRC } from '../game/constants';
import type { Feedback, Move, PredictionLabel } from '../game/types';

interface SideCardProps {
  currentMove: Move | null;
  feedback: Feedback;
  predictions: PredictionLabel[];
}

const toneClass = { ok: ' success', bad: ' fail' };

export default function SideCard({
  currentMove,
  feedback,
  predictions,
}: SideCardProps) {
  return (
    <section className="side-card glass">
      <div className="now-row">
        <span className="pill">Now do:</span>
        <img
          id="movementImage"
          src={currentMove ? moveImageSrc(currentMove) : SILHOUETTE_SRC}
          alt="current move"
        />
      </div>

      <div className={`feedback${feedback.tone ? toneClass[feedback.tone] : ''}`}>
        {feedback.text}
      </div>

      <div className="labels">
        {predictions.map((p) => (
          <div key={p.className}>
            {p.className}: {p.probability.toFixed(2)}
          </div>
        ))}
      </div>
    </section>
  );
}
