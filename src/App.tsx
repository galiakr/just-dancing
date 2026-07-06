import CameraCard from './components/CameraCard';
import SideCard from './components/SideCard';
import { SONG_NAME } from './game/constants';
import { usePoseGame } from './game/usePoseGame';

export default function App() {
  const game = usePoseGame();

  return (
    <>
      <header className="app-header">
        <h1>Move with the music</h1>
        <p className="subtitle">🎶 {SONG_NAME} 🎶</p>
      </header>

      <main className="layout">
        <CameraCard
          canvasRef={game.canvasRef}
          progress={game.progress}
          timing={game.timing}
          status={game.status}
          onStart={game.start}
          onPauseResume={game.pauseResume}
          onRestart={game.restart}
        />
        <SideCard
          currentMove={game.currentMove}
          feedback={game.feedback}
          predictions={game.predictions}
        />
      </main>
    </>
  );
}
