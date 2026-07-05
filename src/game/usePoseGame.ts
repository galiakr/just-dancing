import { useEffect, useRef, useState } from 'react';
import * as tmPose from '@teachablemachine/pose';
import type { Feedback, GameStatus, Move, PredictionLabel } from './types';
import { expectedMoveAt, fmt } from './expectedMoveAt';
import {
  MIN_PART_CONFIDENCE,
  MODEL_URL,
  PROB_THRESHOLD,
  SONG_SRC,
  STREAK_OK,
  WEBCAM_SIZE,
} from './constants';

export interface PoseGame {
  status: GameStatus;
  feedback: Feedback;
  currentMove: Move | null;
  predictions: PredictionLabel[];
  progress: number;
  timing: string;
  start: () => Promise<void>;
  pauseResume: () => Promise<void>;
  restart: () => Promise<void>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export function usePoseGame(): PoseGame {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelRef = useRef<tmPose.CustomPoseNet | null>(null);
  const webcamRef = useRef<tmPose.Webcam | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef(0);
  const initPromiseRef = useRef<Promise<void> | null>(null);
  const correctStreakRef = useRef(0);
  const lastShownMoveRef = useRef<Move | null>(null);
  const statusRef = useRef<GameStatus>('idle');

  const [status, setStatusState] = useState<GameStatus>('idle');
  const [feedback, setFeedbackState] = useState<Feedback>({
    tone: null,
    text: 'Press “Start” to begin',
  });
  const [currentMove, setCurrentMove] = useState<Move | null>(null);
  const [predictions, setPredictions] = useState<PredictionLabel[]>([]);
  const [progress, setProgress] = useState(0);
  const [timing, setTiming] = useState('00:00/00:00');

  const setStatus = (s: GameStatus) => {
    statusRef.current = s;
    setStatusState(s);
  };

  const setFeedback = (tone: Feedback['tone'], text: string) => {
    setFeedbackState((prev) =>
      prev.tone === tone && prev.text === text ? prev : { tone, text }
    );
  };

  async function predictFrame() {
    const model = modelRef.current;
    const webcam = webcamRef.current;
    const ctx = ctxRef.current;
    if (!model || !webcam || !ctx) return;

    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
    const prediction = await model.predict(posenetOutput);

    const labels = prediction.map((p) => ({
      className: p.className,
      probability: Math.round(p.probability * 100) / 100,
    }));
    setPredictions((prev) =>
      prev.length === labels.length &&
      prev.every(
        (l, i) =>
          l.className === labels[i].className &&
          l.probability === labels[i].probability
      )
        ? prev
        : labels
    );

    ctx.drawImage(webcam.canvas, 0, 0);
    if (pose) {
      tmPose.drawKeypoints(pose.keypoints, MIN_PART_CONFIDENCE, ctx);
      tmPose.drawSkeleton(pose.keypoints, MIN_PART_CONFIDENCE, ctx);
    }

    if (statusRef.current !== 'playing') return;
    const audio = audioRef.current;
    if (!audio) return;

    const top = prediction.reduce((a, b) =>
      a.probability > b.probability ? a : b
    );
    const exp = expectedMoveAt(audio.currentTime);

    if (exp && exp.move !== lastShownMoveRef.current) {
      setCurrentMove(exp.move);
      lastShownMoveRef.current = exp.move;
    }

    if (exp) {
      if (top.className === exp.move && top.probability >= PROB_THRESHOLD) {
        correctStreakRef.current++;
        if (correctStreakRef.current >= STREAK_OK) {
          setFeedback('ok', `✅ Great! ${exp.move}`);
        }
      } else {
        correctStreakRef.current = 0;
        setFeedback('bad', `🕺 Try: ${exp.move}`);
      }
    } else {
      setFeedback(null, '🎵 Follow the music...');
    }
  }

  function init(): Promise<void> {
    if (!initPromiseRef.current) {
      initPromiseRef.current = (async () => {
        const model = await tmPose.load(
          MODEL_URL + 'model.json',
          MODEL_URL + 'metadata.json'
        );
        modelRef.current = model;

        const webcam = new tmPose.Webcam(WEBCAM_SIZE, WEBCAM_SIZE, true);
        await webcam.setup();
        await webcam.play();
        webcamRef.current = webcam;

        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = WEBCAM_SIZE;
          canvas.height = WEBCAM_SIZE;
          ctxRef.current = canvas.getContext('2d');
        }

        const loop = async () => {
          if (webcamRef.current) {
            webcamRef.current.update();
            await predictFrame();
          }
          rafRef.current = window.requestAnimationFrame(loop);
        };
        rafRef.current = window.requestAnimationFrame(loop);
      })();
    }
    return initPromiseRef.current;
  }

  useEffect(() => {
    const audio = new Audio(SONG_SRC);
    audioRef.current = audio;

    const onTimeUpdate = () => {
      if (!audio.duration) return;
      setProgress((audio.currentTime / audio.duration) * 100);
      setTiming(`${fmt(audio.currentTime)}/${fmt(audio.duration)}`);
    };
    const onEnded = () => {
      setStatus('finished');
      setFeedback(null, '✨ Finished! Tap Restart to play again.');
    };
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    init().then(() => {
      setFeedback(null, 'Press Start to begin.');
    });

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      window.cancelAnimationFrame(rafRef.current);
      webcamRef.current?.stop();
      webcamRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = async () => {
    await init();
    correctStreakRef.current = 0;
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    await audio.play();
    setStatus('playing');
    setFeedback(null, '🎶 Go!');
  };

  const pauseResume = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (statusRef.current === 'playing') {
      setStatus('paused');
      audio.pause();
      setFeedback(null, '⏸️ Paused — press Resume.');
    } else if (statusRef.current === 'paused') {
      await audio.play();
      setStatus('playing');
      setFeedback(null, '▶️ Resumed!');
    }
  };

  const restart = async () => {
    await init();
    correctStreakRef.current = 0;
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    await audio.play();
    setStatus('playing');
    setFeedback(null, '🔄 Restarted!');
  };

  return {
    status,
    feedback,
    currentMove,
    predictions,
    progress,
    timing,
    start,
    pauseResume,
    restart,
    canvasRef,
  };
}
