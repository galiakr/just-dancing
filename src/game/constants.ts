// Other trained models:
// https://teachablemachine.withgoogle.com/models/cUcZ_lUtD/ point your finger up
// https://teachablemachine.withgoogle.com/models/wQ6I5Z2ju/ head shoulders knees & toes (partially trained)
export const MODEL_URL = 'https://teachablemachine.withgoogle.com/models/LBoqUCB3c/';
export const AUDIO_OFFSET = 0.35;
export const PROB_THRESHOLD = 0.8;
export const STREAK_OK = 5;
export const SONG_NAME = 'Head Shoulders Knees And Toes';
export const WEBCAM_SIZE = 420;
export const MIN_PART_CONFIDENCE = 0.5;

const BASE = import.meta.env.BASE_URL;
export const SONG_SRC = `${BASE}resources/head-shoulders-knees-and-toes.mp3`;
export const SILHOUETTE_SRC = `${BASE}resources/silhouette.png`;
export const moveImageSrc = (move: string) => `${BASE}resources/moves/${move}.png`;
