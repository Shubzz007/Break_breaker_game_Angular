import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, NgZone, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Ball { 
  x: number; 
  y: number; 
  dx: number; 
  dy: number; 
  radius: number; 
}

interface Paddle { x: number; 
  y: number;
  width: number; 
  height: number;
}

interface Brick { 
  x: number; 
  y: number;
   width: number;
   height: number; 
   color: string;
    destroyed: boolean; 
    points: number;
  }

interface Particle
 { x: number;
   y: number;
   dx: number;
   dy: number; 
   life: number;
   color: string;
}

type GameState = 'start' | 'playing' | 'paused' | 'gameOver' | 'win';

const CANVAS_WIDTH = 800, CANVAS_HEIGHT = 600, BALL_RADIUS = 8;
const PADDLE_WIDTH = 100, PADDLE_HEIGHT = 10,
 BRICK_WIDTH = 75, BRICK_HEIGHT = 20;
const BRICK_ROWS = 5, BRICK_COLS = 10,
BALL_SPEED = 5;
const brickColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];


@Component({
  selector: 'app-brick-breaker',
  imports: [CommonModule],
  templateUrl: './brick-breaker.html',
  styleUrl: './brick-breaker.css'
})
export class BrickBreaker implements OnInit, AfterViewInit {
  @ViewChild('gameCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  highScore = 0;
  score = 0;
  lives = 3;
  gameState: GameState = 'start';
  ball: Ball = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 50, dx: BALL_SPEED * 0.6, dy: -BALL_SPEED * 0.8, radius: BALL_RADIUS };
  paddle: Paddle = { x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2, y: CANVAS_HEIGHT - 30, width: PADDLE_WIDTH, height: PADDLE_HEIGHT };
  bricks: Brick[] = [];
  particles: Particle[] = [];
  animationRef: number | null = null;
  isResetting = false;
  keysPressed = new Set<string>();

  constructor(private ngZone: NgZone,) { 
    
  }

  ngOnInit() {
    this.loadHighScore();
    this.initializeBricks();
  }

  loadHighScore() {
    const storedHighScore = localStorage.getItem('brickBreakerHighScore');
    if (storedHighScore) {
      this.highScore = parseInt(storedHighScore, 10);
    }
  }

  ngAfterViewInit() {
    this.draw();
  }

  initializeBricks() {
    const newBricks: Brick[] = [];
    const offsetX = (CANVAS_WIDTH - BRICK_COLS * BRICK_WIDTH) / 2, offsetY = 60;
    for (let row = 0; row < BRICK_ROWS; row++)
      for (let col = 0; col < BRICK_COLS; col++)
        newBricks.push({
          x: offsetX + col * BRICK_WIDTH,
          y: offsetY + row * (BRICK_HEIGHT + 5),
          width: BRICK_WIDTH, height: BRICK_HEIGHT,
          color: brickColors[row], destroyed: false, points: (BRICK_ROWS - row) * 10
        });
    this.bricks = newBricks;
    this.draw();
  }

  resetGame() {
    this.score = 0; this.lives = 3; this.isResetting = false;
    this.ball = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 50, dx: BALL_SPEED * 0.6, dy: -BALL_SPEED * 0.8, radius: BALL_RADIUS };
    this.paddle = { x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2, y: CANVAS_HEIGHT - 30, width: PADDLE_WIDTH, height: PADDLE_HEIGHT };
    this.particles = [];
    this.gameState = 'start';
    this.initializeBricks();
    this.draw();
  }

  gameLoop(): void {
    if (this.gameState !== 'playing') return;
    this.checkCollisions();
    const remaining = this.bricks.filter(b => !b.destroyed);
    if (remaining.length === 0) {
      this.gameState = 'win';

        this.saveHighScore();
      if (this.animationRef) cancelAnimationFrame(this.animationRef);
      this.draw();
      return;
    }
    if (this.ball.y > CANVAS_HEIGHT && !this.isResetting) {
      this.isResetting = true; this.lives--;
      if (this.lives <= 0) {
        this.gameState = 'gameOver';
        this.saveHighScore();
        if (this.animationRef) cancelAnimationFrame(this.animationRef);
        this.draw();
        return;
      }
      setTimeout(() => {
        this.ball = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 50, dx: BALL_SPEED * 0.6, dy: -BALL_SPEED * 0.8, radius: BALL_RADIUS };
        this.isResetting = false;
      }, 1000);
    }
    this.movePaddle();
    this.draw();
    this.animationRef = requestAnimationFrame(() =>
      this.ngZone.runOutsideAngular(() => this.gameLoop())
    );
  }

  handlePlayPause() {
    if (this.gameState === 'start' || this.gameState === 'gameOver' || this.gameState === 'win') {
      this.resetGame();
      this.gameState = 'playing';
      this.ngZone.runOutsideAngular(() => this.gameLoop());
    } else if (this.gameState === 'playing') {
      this.gameState = 'paused';
      if (this.animationRef) cancelAnimationFrame(this.animationRef);
    } else if (this.gameState === 'paused') {
      this.gameState = 'playing';
      this.ngZone.runOutsideAngular(() => this.gameLoop());
    }
  }

  checkCollisions(): void {
    let ball = this.ball;
    ball.x += ball.dx; ball.y += ball.dy;
    // Walls
    if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= CANVAS_WIDTH) {
      ball.dx = -ball.dx;
      ball.x = Math.max(ball.radius, Math.min(CANVAS_WIDTH - ball.radius, ball.x));
    }
    if (ball.y - ball.radius <= 0) {
      ball.dy = -ball.dy; ball.y = ball.radius;
    }
    // Paddle
    if (
      ball.y + ball.radius >= this.paddle.y &&
      ball.y - ball.radius <= this.paddle.y + this.paddle.height &&
      ball.x >= this.paddle.x &&
      ball.x <= this.paddle.x + this.paddle.width &&
      ball.dy > 0
    ) {
      ball.dy = -Math.abs(ball.dy);
      ball.y = this.paddle.y - ball.radius;
      const hitPos = (ball.x - this.paddle.x) / this.paddle.width;
      ball.dx = BALL_SPEED * (hitPos - 0.5) * 1.5; if (Math.abs(ball.dx) < 1) ball.dx = ball.dx < 0 ? -1 : 1;
    }
    // Brick collisions/particles
    for (const brick of this.bricks) {
      if (!brick.destroyed) {
        const ballLeft = ball.x - ball.radius, ballRight = ball.x + ball.radius, ballTop = ball.y - ball.radius, ballBottom = ball.y + ball.radius;
        if (
          ballRight >= brick.x &&
          ballLeft <= brick.x + brick.width &&
          ballBottom >= brick.y &&
          ballTop <= brick.y + brick.height
        ) {
          brick.destroyed = true; this.score += brick.points;
          // Particles
          for (let i = 0; i < 14; i++) {
            const angle = (2 * Math.PI * i) / 14;
            this.particles.push({
              x: brick.x + brick.width / 2,
              y: brick.y + brick.height / 2,
              dx: Math.cos(angle) * (1.5 + Math.random() * 2),
              dy: Math.sin(angle) * (1.5 + Math.random() * 2),
              life: 24 + Math.random() * 10,
              color: brick.color
            });
          }
          // Ball bounce
          const overlapLeft = ballRight - brick.x, overlapRight = (brick.x + brick.width) - ballLeft,
            overlapTop = ballBottom - brick.y, overlapBottom = (brick.y + brick.height) - ballTop,
            minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
          if (minOverlap === overlapTop || minOverlap === overlapBottom) { ball.dy = -ball.dy; }
          else { ball.dx = -ball.dx; }
        }
      }
    }
  }

  movePaddle() {
    const speed = 8;
    if (this.keysPressed.has('ArrowLeft')) this.paddle.x = Math.max(0, this.paddle.x - speed);
    if (this.keysPressed.has('ArrowRight')) this.paddle.x = Math.min(CANVAS_WIDTH - PADDLE_WIDTH, this.paddle.x + speed);
  }

  @HostListener('mousemove', ['$event'])
  handleMouseMove(e: MouseEvent) {
    if (this.gameState !== 'playing' && this.gameState !== 'paused') return;
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const mouseX = (e.clientX - rect.left) * scaleX;
    this.paddle.x = Math.max(0, Math.min(mouseX - PADDLE_WIDTH / 2, CANVAS_WIDTH - PADDLE_WIDTH));
    this.draw();
  }
  @HostListener('touchmove', ['$event'])
  onTouchMove(e: TouchEvent) {
    if (this.gameState !== 'playing' && this.gameState !== 'paused') return;
    const canvas = this.canvasRef.nativeElement;
    if (e.touches.length === 1) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const touchX = (e.touches[0].clientX - rect.left) * scaleX;
      this.paddle.x = Math.max(0, Math.min(touchX - PADDLE_WIDTH / 2, CANVAS_WIDTH - PADDLE_WIDTH));
      this.draw();
    }
  }
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(e: KeyboardEvent) {
    this.keysPressed.add(e.code);
    if (e.code === 'Space') this.handlePlayPause();
  }
  @HostListener('window:keyup', ['$event'])
  handleKeyUp(e: KeyboardEvent) { this.keysPressed.delete(e.code); }

  saveHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('brickBreakerHighScore', this.highScore.toString());
    }
  }

  draw() {
    const canvas = this.canvasRef.nativeElement, ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    // Ball
    ctx.beginPath();
    ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#22c55e';
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0;
    ctx.restore();

    // Paddle
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);

    // Bricks
    for (const brick of this.bricks) {
      if (!brick.destroyed) {
        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
      }
    }
    // Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      const alpha = Math.max(0, p.life / 30);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      p.x += p.dx;
      p.y += p.dy;
      p.dy += 0.2;
      p.life--;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
  }
}