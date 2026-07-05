# Move with the music

An interactive dance-along game built with **Teachable Machine**, **TensorFlow.js**, and your webcam.  
Players follow the classic children’s song _“Head, Shoulders, Knees and Toes”_, while the game gives real-time feedback if they match the moves correctly.

## How to Play

- Open [Move with the Music](https://galiakr.github.io/just-dancing/)
- Allow webcam access when prompted
- Hit Start and dance!

## Tech Stack

- [TensorFlow.js](https://www.tensorflow.org/js)
- [Teachable Machine](https://teachablemachine.withgoogle.com/) (pose model)
- React + TypeScript, built with [Vite](https://vitejs.dev/)

## Development

```bash
npm install
npm run dev      # local dev server
npm run build    # typecheck + production build to dist/
npm run preview  # serve the production build locally
```

Deployed to GitHub Pages automatically on every push to `main` (see `.github/workflows/deploy.yml`).

## Credits

- Song and Images: _“Head, Shoulders, Knees and Toes”_ [Super Simple Songs](https://supersimple.com/super-simple-songs/)
- Pose model trained with [Teachable Machine](https://teachablemachine.withgoogle.com/)
- UI/Code by [Galia Kropach](https://www.linkedin.com/in/galiakr/)
