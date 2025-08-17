const MODEL_URL = 'https://teachablemachine.withgoogle.com/models/wQ6I5Z2ju/';
const AUDIO_OFFSET = 0.35;
const PROB_THRESHOLD = 0.8;
const STREAK_OK = 5;

let songName = 'Head Shoulders Knees And Toes';

const TIMELINE = [
  { start: 0.0, end: 9.0, move: 'getready' },
  { start: 9.0, end: 2.5, move: 'head' },
  { start: 2.5, end: 5.0, move: 'shoulders' },
  { start: 5.0, end: 7.5, move: 'knees' },
  { start: 7.5, end: 10.0, move: 'toes' },
  { start: 10.0, end: 12.5, move: 'head' },
  { start: 12.5, end: 15.0, move: 'shoulders' },
  { start: 15.0, end: 17.5, move: 'knees' },
  { start: 17.5, end: 20.0, move: 'toes' },
];

let model, webcam, ctx, labelContainer, maxPredictions;
let playing = false;
let paused = false;
let correctStreak = 0;
let lastShownMove = null;

const song = document.getElementById('song');
const canvas = document.getElementById('canvas');
const progressEl = document.getElementById('progress');
const timingEl = document.getElementById('timing');
const movementImage = document.getElementById('movementImage');
const feedbackEl = document.getElementById('feedback');

const startBtn = document.getElementById('startBtn');
const pauseResumeBtn = document.getElementById('pauseResumeBtn');
const restartBtn = document.getElementById('restartBtn');
document.getElementById('songName').textContent = `🎶 ${songName} 🎶`;

function fmt(t) {
  if (!isFinite(t)) return '00:00';
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function expectedMoveAt(timeSec) {
  const t = Math.max(0, timeSec - AUDIO_OFFSET);
  return TIMELINE.find((x) => t >= x.start && t < x.end) || null;
}

function setFeedback(ok, text) {
  feedbackEl.textContent = text;
  feedbackEl.classList.remove('success', 'fail');
  if (ok === true) feedbackEl.classList.add('success');
  if (ok === false) feedbackEl.classList.add('fail');
}

async function initModel() {
  if (model) return;
  const modelURL = MODEL_URL + 'model.json';
  const metadataURL = MODEL_URL + 'metadata.json';

  model = await tmPose.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  const size = 420;
  const flip = true;
  webcam = new tmPose.Webcam(size, size, flip);
  await webcam.setup();
  await webcam.play();
  window.requestAnimationFrame(loop);

  canvas.width = size;
  canvas.height = size;
  ctx = canvas.getContext('2d');

  labelContainer = document.getElementById('labelContainer');
  labelContainer.innerHTML = '';
  for (let i = 0; i < maxPredictions; i++) {
    labelContainer.appendChild(document.createElement('div'));
  }
}

async function loop() {
  if (webcam) {
    webcam.update();
    await predictFrame();
  }
  window.requestAnimationFrame(loop);
}

async function predictFrame() {
  if (!model || !webcam) return;
  const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
  const prediction = await model.predict(posenetOutput);

  for (let i = 0; i < maxPredictions; i++) {
    const p = prediction[i];
    labelContainer.childNodes[i].innerHTML = `${
      p.className
    }: ${p.probability.toFixed(2)}`;
  }

  ctx.drawImage(webcam.canvas, 0, 0);
  if (pose === 'getready') {
    setFeedback(null, '🚀 Get Ready...');
    return;
  }

  if (pose) {
    const minPartConfidence = 0.5;
    tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
    tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
  }

  if (!playing || paused) return;

  const top = prediction.reduce((a, b) =>
    a.probability > b.probability ? a : b
  );
  const exp = expectedMoveAt(song.currentTime);

  if (exp && exp.move !== lastShownMove) {
    movementImage.src = `resources/moves/${exp.move}.png`;
    lastShownMove = exp.move;
  }

  if (exp) {
    if (top.className === exp.move && top.probability >= PROB_THRESHOLD) {
      correctStreak++;
      if (correctStreak >= STREAK_OK) {
        setFeedback(true, `✅ Great! ${exp.move}`);
      }
    } else {
      correctStreak = 0;
      setFeedback(false, `🕺 Try: ${exp.move}`);
    }
  } else {
    setFeedback(null, '🎵 Follow the music...');
  }
}

song.addEventListener('timeupdate', () => {
  if (!song.duration) return;
  progressEl.value = (song.currentTime / song.duration) * 100;
  timingEl.textContent = `${fmt(song.currentTime)}/${fmt(song.duration)}`;
});

song.addEventListener('ended', () => {
  playing = false;
  paused = false;
  setFeedback(null, '✨ Finished! Tap Restart to play again.');
  pauseResumeBtn.textContent = 'Pause';
});

startBtn.addEventListener('click', async () => {
  await initModel();
  playing = true;
  paused = false;
  correctStreak = 0;
  song.currentTime = 0;
  await song.play();
  setFeedback(null, '🎶 Go!');
  pauseResumeBtn.textContent = 'Pause';
});

pauseResumeBtn.addEventListener('click', async () => {
  if (!playing) return;
  if (!paused) {
    paused = true;
    song.pause();
    setFeedback(null, '⏸️ Paused — press Resume.');
    pauseResumeBtn.textContent = 'Resume';
  } else {
    paused = false;
    await song.play();
    setFeedback(null, '▶️ Resumed!');
    pauseResumeBtn.textContent = 'Pause';
  }
});

restartBtn.addEventListener('click', async () => {
  await initModel();
  playing = true;
  paused = false;
  correctStreak = 0;
  song.pause();
  song.currentTime = 0;
  await song.play();
  setFeedback(null, '🔄 Restarted!');
  pauseResumeBtn.textContent = 'Pause';
});

window.addEventListener('load', () => {
  initModel().then(() => {
    setFeedback(null, 'Press Start to begin.');
  });
});
