# Move with the music

An interactive dance-along game built with **Teachable Machine**, **TensorFlow.js**, and your webcam.  
Players follow the classic children’s song _“Head, Shoulders, Knees and Toes”_, while the game gives real-time feedback if they match the moves correctly.

## How to Play

- Open [_Move with the Music_](https://galiakr.github.io/just-dancing/)
- Allow webcam access when prompted
- Hit Start and dance!

## Tech Stack

- [_TensorFlow.js_](https://www.tensorflow.org/js)
- [_Teachable Machine_](https://teachablemachine.withgoogle.com/) (pose model)
- React + TypeScript, built with [_Vite_](https://vitejs.dev/)

## Development

```bash
npm install
npm run dev      # local dev server
npm run build    # typecheck + production build to dist/
npm run preview  # serve the production build locally
```

## Credits

- Song and Images: _“Head, Shoulders, Knees and Toes”_ [_Super Simple Songs_](https://supersimple.com/super-simple-songs/)
- Pose model trained with [_Teachable Machine_](https://teachablemachine.withgoogle.com/)
