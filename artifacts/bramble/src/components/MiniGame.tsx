import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { SiX } from 'react-icons/si';

interface MiniGameProps {}

export default function MiniGame({}: MiniGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('bramble_high_score');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let frames = 0;

    // Game variables
    const groundHeight = 60;
    let speed = 4;
    
    let bramble = {
      x: 50,
      y: canvas.height - groundHeight - 40,
      width: 40,
      height: 40,
      velocity: 0,
      gravity: 0.6,
      jumpStrength: -10,
      isGrounded: true
    };

    let obstacles: any[] = [];
    let flowers: any[] = [];
    
    const resetGame = () => {
      bramble.y = canvas.height - groundHeight - 40;
      bramble.velocity = 0;
      bramble.isGrounded = true;
      obstacles = [];
      flowers = [];
      frames = 0;
      speed = 4;
      setScore(0);
      setIsGameOver(false);
    };

    const jump = () => {
      if (bramble.isGrounded) {
        bramble.velocity = bramble.jumpStrength;
        bramble.isGrounded = false;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (isPlaying && !isGameOver) jump();
      }
    };
    
    const handleTouch = (e: TouchEvent | MouseEvent) => {
      e.preventDefault();
      if (isPlaying && !isGameOver) jump();
    };

    window.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('mousedown', handleTouch);

    const drawBramble = (x: number, y: number) => {
      ctx.fillStyle = '#8B5A2B'; // Brown
      ctx.beginPath();
      ctx.arc(x + 20, y + 20, 20, 0, Math.PI * 2);
      ctx.fill();
      // Spikes
      ctx.fillStyle = '#A0522D';
      for(let i=0; i<5; i++) {
        ctx.beginPath();
        ctx.moveTo(x + 5 + i*8, y + 5);
        ctx.lineTo(x + 10 + i*8, y - 5);
        ctx.lineTo(x + 15 + i*8, y + 5);
        ctx.fill();
      }
    };

    const drawObstacle = (obs: any) => {
      ctx.fillStyle = '#FF4500'; // Fox orange
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      // Ears
      ctx.beginPath();
      ctx.moveTo(obs.x, obs.y);
      ctx.lineTo(obs.x + 5, obs.y - 10);
      ctx.lineTo(obs.x + 15, obs.y);
      ctx.fill();
    };

    const drawFlower = (flower: any) => {
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(flower.x + 10, flower.y + 10, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(flower.x + 10, flower.y + 10, 4, 0, Math.PI * 2);
      ctx.fill();
    };

    const gameLoop = () => {
      if (!isPlaying) return;
      if (isGameOver) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#B8D4E8');
      gradient.addColorStop(1, '#E8F4F8');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Ground
      ctx.fillStyle = '#4A7C59';
      ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);
      ctx.fillStyle = '#659D74';
      ctx.fillRect(0, canvas.height - groundHeight, canvas.width, 10);

      // Physics
      bramble.velocity += bramble.gravity;
      bramble.y += bramble.velocity;

      if (bramble.y >= canvas.height - groundHeight - bramble.height) {
        bramble.y = canvas.height - groundHeight - bramble.height;
        bramble.velocity = 0;
        bramble.isGrounded = true;
      }

      // Spawning
      frames++;
      if (frames % 100 === 0) {
        speed += 0.1;
      }

      if (frames % 120 === 0 || (frames % 80 === 0 && Math.random() > 0.5)) {
        if (Math.random() > 0.4) {
          obstacles.push({
            x: canvas.width,
            y: canvas.height - groundHeight - 30,
            width: 30,
            height: 30
          });
        }
      }

      if (frames % 90 === 0) {
        flowers.push({
          x: canvas.width,
          y: canvas.height - groundHeight - 80 - Math.random() * 40,
          width: 20,
          height: 20,
          collected: false
        });
      }

      // Move & Draw Flowers
      for (let i = flowers.length - 1; i >= 0; i--) {
        let fl = flowers[i];
        if (!fl.collected) {
          fl.x -= speed;
          drawFlower(fl);

          // Collision
          if (
            bramble.x < fl.x + fl.width &&
            bramble.x + bramble.width > fl.x &&
            bramble.y < fl.y + fl.height &&
            bramble.y + bramble.height > fl.y
          ) {
            fl.collected = true;
            setScore(s => s + 1);
          }
        }
        if (fl.x + fl.width < 0) flowers.splice(i, 1);
      }

      // Move & Draw Obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
        let obs = obstacles[i];
        obs.x -= speed;
        drawObstacle(obs);

        // Collision (smaller hitbox for fairness)
        let bHit = { x: bramble.x + 5, y: bramble.y + 5, w: bramble.width - 10, h: bramble.height - 10 };
        let oHit = { x: obs.x + 5, y: obs.y + 5, w: obs.width - 10, h: obs.height - 10 };

        if (
          bHit.x < oHit.x + oHit.w &&
          bHit.x + bHit.w > oHit.x &&
          bHit.y < oHit.y + oHit.h &&
          bHit.y + bHit.h > oHit.y
        ) {
          setIsGameOver(true);
        }

        if (obs.x + obs.width < 0) obstacles.splice(i, 1);
      }

      drawBramble(bramble.x, bramble.y);

      // HUD
      ctx.fillStyle = '#3D2817';
      ctx.font = '20px Fredoka';
      ctx.fillText(`Score: ${score}`, 20, 30);
      ctx.fillText(`High Score: ${Math.max(score, highScore)}`, 20, 60);

      animationId = requestAnimationFrame(gameLoop);
    };

    if (isPlaying && !isGameOver) {
      animationId = requestAnimationFrame(gameLoop);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('touchstart', handleTouch);
      canvas.removeEventListener('mousedown', handleTouch);
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying, isGameOver, score, highScore]);

  useEffect(() => {
    if (isGameOver) {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('bramble_high_score', score.toString());
      }
    }
  }, [isGameOver, score, highScore]);

  const startGame = () => {
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
  };

  const getShareText = () => {
    if (score >= 30) return `Bramble's on a roll! Collected ${score} flowers and dodged all the foxes. Beat my score → bramble.top`;
    if (score >= 15) return `Running through Sunbell Meadow with Bramble! ${score} flowers collected. Can you beat that? → bramble.top`;
    return `Just started my Bramble adventure! ${score} flowers collected so far. This hedgehog is unstoppable → bramble.top`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto relative rounded-2xl overflow-hidden shadow-xl border-4 border-white/50">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={400} 
        className="w-full h-auto bg-muted block touch-none cursor-pointer"
        data-testid="game-canvas"
      />
      
      {!isPlaying && !isGameOver && (
        <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center backdrop-blur-sm">
          <Button onClick={startGame} size="lg" className="text-xl px-8 rounded-full shadow-lg" data-testid="button-start-game">
            Play Now
          </Button>
        </div>
      )}

      {isGameOver && (
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center backdrop-blur-sm text-white">
          <h3 className="text-4xl font-bold text-white mb-2 shadow-sm drop-shadow-md">Game Over!</h3>
          <p className="text-xl mb-1">Score: {score}</p>
          <p className="text-lg mb-6 text-white/80">High Score: {highScore}</p>
          <div className="flex gap-4">
            <Button onClick={startGame} variant="secondary" className="rounded-full px-6 text-lg" data-testid="button-play-again">
              Play Again
            </Button>
            <Button 
              onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText())}`, '_blank')}
              className="rounded-full px-6 bg-black text-white hover:bg-black/80 flex items-center gap-2"
              data-testid="button-share-x"
            >
              <SiX /> Share
            </Button>
          </div>
        </div>
      )}
      <div className="absolute bottom-4 left-0 w-full text-center pointer-events-none">
        <p className="text-white/80 text-sm font-medium drop-shadow-md">Press SPACE to jump — Tap the screen on mobile</p>
      </div>
    </div>
  );
}
