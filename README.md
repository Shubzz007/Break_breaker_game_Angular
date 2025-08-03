🧱 Brick Breaker Game (Angular)
A responsive, modern version of the classic Brick Breaker/Arkanoid game—built with Angular, TypeScript, and HTML5 Canvas.

GitHub Repository: Shubzz007/Break_breaker_game_Angular

Live Online Demo: Play on Netlify

🚀 Features
Classic Gameplay: Break bricks with a bouncing ball and a paddle. Don’t let the ball fall!

Responsive & Mobile Friendly: Play with mouse, keyboard, or touch controls. Layout adapts to your device.

Visual Hearts for Lives: Lives are shown as animated heart icons for arcade realism.

Score & High Score: Tracks your current and historical best scores (using local storage).

Particle Effects: Colorful explosions when bricks are destroyed for extra satisfaction!

Multiple Game States: Start, Play, Pause, Win, and Game Over screens with clear feedback.

Polished UI: Modern color scheme, rounded corners, and smooth animations.

No External Game Libraries: Complete game engine (canvas rendering, collisions, physics) written from scratch for learning and customization.

Standalone Strong Typing: Uses Angular standalone components and strict TypeScript.

🎮 Play It Now
👉 brickbreakermania.netlify.app

🛠 Setup & Run Locally
Clone the repository:

bash
git clone https://github.com/Shubzz007/Break_breaker_game_Angular.git
cd Break_breaker_game_Angular
Install dependencies:

bash
npm install
Run the development server:

bash
ng serve
Then open http://localhost:4200 in your browser.

📁 Key File Structure
text
src/
  app/
    brick-breaker/
      brick-breaker.ts      # Game logic and Angular component
      brick-breaker.html    # Game UI/template
      brick-breaker.css     # Styling
  ...
README.md
angular.json, package.json, ...
🔍 Technical Decisions
Angular Standalone:
Utilizes Angular’s standalone components for modern, scalable app structure.

Canvas for Graphics:
Uses <canvas> for custom, efficient game drawing, instead of relying on the DOM or third-party game engines.

Game State Management:
Employs a clear state machine (start, playing, paused, win, game over) for UX clarity.

Particle Animation:
Bricks "explode" with animated particles using procedural TypeScript logic for polish and delight.

Device-Agnostic Controls:
Touch input and keyboard/mouse work out of the box, thanks to Angular HostListeners and responsive patterns.

No Heavy Libraries:
Only Angular and built-in browser APIs are used—no Phaser.js or similar.

🏆 How to Play
Desktop:

Move paddle with mouse or left/right arrows

Press Spacebar or the Start/Resume button to play/pause

Mobile:

Drag paddle with your finger

Tap Start/Resume to play or pause

Objective:

Break all the bricks to win!

Don’t let the ball pass your paddle—lose a heart when you do.

✨ Roadmap & Extensions
Multiple levels and increasing difficulty

Power-ups (multi-ball, paddle resize, etc.)

Sound effects

Leaderboard with global high scores

🤝 Contributing
Have an idea, found a bug, or want to help? File an issue or open a PR!

Enjoy playing 
