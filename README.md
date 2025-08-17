# Head, Shoulders, Knees & Toes – Dance Game 🎶🕺

An interactive dance-along game built with **Teachable Machine**, **TensorFlow.js**, and your webcam.  
Players follow the classic children’s song *“Head, Shoulders, Knees and Toes”*, while the game gives real-time feedback if they match the moves correctly.

---

## ✨ Features
- Plays the **Head, Shoulders, Knees & Toes** song  
- Shows the current move with an image cue (`resources/moves/`)  
- Uses your webcam + Teachable Machine pose model to detect if the move is correct  
- Live feedback: ✅ Success or 🔁 Try again  
- Buttons for **Start**, **Pause/Resume**, and **Restart**  
- Glassy UI with animated feedback messages  

---

## 🛠️ How to Run
1. Clone or download this project  
2. Place the assets:
   - `Head Shoulders Knees And Toes.mp3` in the project root  
   - Move images (`head.png`, `shoulders.png`, `knees.png`, `toes.png`, and optionally `getready.png`) in `resources/moves/`  
3. Open `index.html` in a browser (Chrome recommended)  
4. Allow webcam access when prompted  
5. Hit **Start** and dance! 🎉  

---

## ⚙️ Customization
- **Timeline**: adjust `TIMELINE` in `script.js` to match your song timing.  
  ```js
  const TIMELINE = [
    { start: 0.0, end: 9.0, move: 'getready' },
    { start: 9.0, end: 11.5, move: 'head' },
    { start: 11.5, end: 14.0, move: 'shoulders' },
    // ...
  ];
  ```
- **Audio Offset**: fine-tune sync with `AUDIO_OFFSET` (default `0.35s`).  
- **Assets**: add or replace images in `resources/moves/`.  
- **Feedback Styling**: edit `style.css` (look for `.feedback.success` and `.feedback.fail`).  

---

## 📦 Tech Stack
- [TensorFlow.js](https://www.tensorflow.org/js)  
- [Teachable Machine](https://teachablemachine.withgoogle.com/) (pose model)  
- Vanilla JS + HTML + CSS  

---

## 🙏 Credits
- Song: *“Head, Shoulders, Knees and Toes”* (Traditional children’s song)  
- Pose model trained with [Teachable Machine](https://teachablemachine.withgoogle.com/)  
- UI/Code by [Your Name]  
