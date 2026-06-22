import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { SiX } from 'react-icons/si';

interface MiniGameProps {
  onScoreUpdate?: (score: number, high: number) => void;
}

export default function MiniGame({ onScoreUpdate }: MiniGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Game state refs
  const scoreRef = useRef(0);
  const highScoreRef = useRef(0);
  const gameStateRef = useRef<'idle' | 'playing' | 'gameover'>('idle');
  const brambleRef = useRef({ x: 80, y: 0, vy: 0, grounded: true, rotation: 0 });
  const obstaclesRef = useRef<any[]>([]);
  const flowersRef = useRef<any[]>([]);
  const particlesRef = useRef<any[]>([]);
  const cloudsRef = useRef<any[]>([]);
  const frameRef = useRef(0);
  const speedRef = useRef(4);
  const animIdRef = useRef<number>(0);
  const canDoubleJumpRef = useRef(false);
  const scrollOffsetRef = useRef(0);
  
  const resetGameRef = useRef<() => void>(() => {});
  const milestoneRef = useRef({ shown: -1, text: '', alpha: 0 });

  // React state ONLY for overlay
  const [displayState, setDisplayState] = useState<'idle'|'playing'|'gameover'>('idle');
  const [displayScore, setDisplayScore] = useState(0);
  const [displayHigh, setDisplayHigh] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('bramble_high_score');
    if (saved) {
      const high = parseInt(saved, 10);
      highScoreRef.current = high;
      setDisplayHigh(high);
      onScoreUpdate?.(0, high);
    }
  }, [onScoreUpdate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Init clouds
    for (let i = 0; i < 4; i++) {
      cloudsRef.current.push({
        x: Math.random() * canvas.width,
        y: 20 + Math.random() * 100,
        s: 0.5 + Math.random() * 0.8
      });
    }

    const groundHeight = 70;
    const brambleRadius = 22;

    const resetGame = () => {
      scoreRef.current = 0;
      setDisplayScore(0);
      onScoreUpdate?.(0, highScoreRef.current);
      gameStateRef.current = 'playing';
      setDisplayState('playing');
      brambleRef.current = { 
        x: 80, 
        y: canvas.height - groundHeight - brambleRadius, 
        vy: 0, 
        grounded: true, 
        rotation: 0 
      };
      obstaclesRef.current = [];
      flowersRef.current = [];
      particlesRef.current = [];
      frameRef.current = 0;
      speedRef.current = 4;
      scrollOffsetRef.current = 0;
      milestoneRef.current = { shown: -1, text: '', alpha: 0 };
    };
    
    resetGameRef.current = resetGame;

    const jump = () => {
      if (gameStateRef.current === 'idle') {
        resetGame();
        return;
      }
      if (gameStateRef.current === 'gameover') {
        resetGame();
        return;
      }
      
      const b = brambleRef.current;
      if (b.grounded) {
        b.vy = -13;
        b.grounded = false;
        canDoubleJumpRef.current = true;
      } else if (canDoubleJumpRef.current) {
        b.vy = -11;
        canDoubleJumpRef.current = false;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };
    
    const handleTouch = (e: TouchEvent | MouseEvent) => {
      e.preventDefault();
      jump();
    };

    window.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('touchstart', handleTouch, { passive: false });
    canvas.addEventListener('mousedown', handleTouch);

    const drawBramble = (x: number, y: number, rotation: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      // Body
      ctx.fillStyle = '#A0522D';
      ctx.beginPath();
      ctx.arc(0, 0, brambleRadius, 0, Math.PI * 2);
      ctx.fill();

      // Underbelly
      ctx.fillStyle = '#F5E6D3';
      ctx.beginPath();
      ctx.arc(0, 0, brambleRadius, 0, Math.PI, false);
      ctx.fill();

      // Spikes
      ctx.fillStyle = '#5C3317';
      for(let i=0; i<8; i++) {
        const ang = (i * Math.PI * 2) / 8;
        ctx.save();
        ctx.rotate(ang);
        ctx.beginPath();
        ctx.moveTo(brambleRadius - 2, -5);
        ctx.lineTo(brambleRadius + 8, 0);
        ctx.lineTo(brambleRadius - 2, 5);
        ctx.fill();
        ctx.restore();
      }

      // Eye
      ctx.fillStyle = '#FFF';
      ctx.beginPath();
      ctx.arc(10, -5, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#3D2817';
      ctx.beginPath();
      ctx.arc(12, -5, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFF';
      ctx.beginPath();
      ctx.arc(13, -6, 1, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawObstacle = (obs: any) => {
      const { x, y, w, h, color } = obs;
      ctx.fillStyle = color || '#E8651A';
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, [10, 10, 0, 0]);
      ctx.fill();
      
      // Ears
      ctx.beginPath();
      ctx.moveTo(x + 5, y);
      ctx.lineTo(x + 10, y - 12);
      ctx.lineTo(x + 15, y);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x + w - 15, y);
      ctx.lineTo(x + w - 10, y - 12);
      ctx.lineTo(x + w - 5, y);
      ctx.fill();

      // Belly patch
      ctx.fillStyle = '#FFF';
      ctx.beginPath();
      ctx.ellipse(x + w/2, y + h - 10, w/3, h/3, 0, 0, Math.PI*2);
      ctx.fill();
      
      // Nose
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(x + 5, y + 10, 3, 0, Math.PI*2);
      ctx.fill();
      
      // Tail
      ctx.fillStyle = color || '#E8651A';
      ctx.beginPath();
      ctx.arc(x + w, y + h - 15, 10, Math.PI/2, Math.PI*1.5);
      ctx.fill();
    };

    const drawFlower = (flower: any) => {
      const { x, y, phase } = flower;
      const bobY = y + Math.sin(frameRef.current * 0.05 + phase) * 4;
      
      ctx.save();
      ctx.translate(x + 10, bobY + 10);
      
      // Petals
      ctx.fillStyle = '#FFFFFF';
      for (let i = 0; i < 6; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI * 2) / 6);
        ctx.beginPath();
        ctx.ellipse(8, 0, 6, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      
      // Center
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    };

    const drawBackground = () => {
      // Sky
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#87CEEB');
      grad.addColorStop(1, '#B8D4E8');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Clouds
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      cloudsRef.current.forEach(c => {
        ctx.beginPath();
        ctx.arc(c.x, c.y, 30 * c.s, 0, Math.PI*2);
        ctx.arc(c.x + 25 * c.s, c.y - 10 * c.s, 35 * c.s, 0, Math.PI*2);
        ctx.arc(c.x + 50 * c.s, c.y, 25 * c.s, 0, Math.PI*2);
        ctx.fill();
        if (gameStateRef.current === 'playing') {
          c.x -= speedRef.current * 0.2;
        }
        if (c.x + 100 < 0) {
          c.x = canvas.width + 50;
          c.y = 20 + Math.random() * 100;
        }
      });

      // Hills
      const drawHills = (color: string, offsetMult: number, yOffset: number, amplitude: number) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        const shift = (scrollOffsetRef.current * offsetMult) % 400;
        
        for (let x = -shift; x <= canvas.width + 400; x += 200) {
          ctx.quadraticCurveTo(x + 100, canvas.height - yOffset - amplitude, x + 200, canvas.height - yOffset);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.fill();
      };

      drawHills('#3d6b47', 0.3, groundHeight + 20, 60);
      drawHills('#4A7C59', 0.6, groundHeight, 40);

      // Grass texture
      ctx.fillStyle = '#5a9169';
      for(let i=0; i<canvas.width; i+=15) {
        const xPos = i - (scrollOffsetRef.current % 15);
        ctx.fillRect(xPos, canvas.height - groundHeight, 3, 10);
      }
      
      // Ground pebbles
      ctx.fillStyle = '#1a3d2b';
      for(let i=0; i<8; i++) {
        const spacing = canvas.width / 8;
        const xPos = ((i * spacing) - scrollOffsetRef.current) % canvas.width;
        const adjustedX = xPos < 0 ? xPos + canvas.width : xPos;
        ctx.beginPath();
        ctx.arc(adjustedX, canvas.height - groundHeight / 2 + Math.sin(i)*10, 3, 0, Math.PI*2);
        ctx.fill();
      }
    };

    const spawnParticles = (x: number, y: number, colors: string[], count: number) => {
      for(let i=0; i<count; i++) {
        particlesRef.current.push({
          x, y,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8 - 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          life: 20 + Math.random() * 10
        });
      }
    };

    const getMilestoneMessage = (speed: number) => {
      if (speed >= 10) return "MAXIMUM FLOOF SPEED!";
      if (speed >= 9) return "Bramble is ROLLING!";
      if (speed >= 8) return "This is getting intense!";
      if (speed >= 7) return "Uh oh, foxes are faster!";
      if (speed >= 6) return "Bramble's picking up speed!";
      if (speed >= 5) return "Getting warmer...";
      return "";
    };

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBackground();

      if (gameStateRef.current === 'idle') {
        drawBramble(canvas.width/2, canvas.height - groundHeight - brambleRadius, 0);
        
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 32px Fredoka';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        ctx.shadowBlur = 4;
        const bounce = Math.sin(Date.now() / 300) * 8;
        ctx.fillText('Tap or Press Space to Start', canvas.width/2, canvas.height/2 - 40 + bounce);
        
        ctx.font = 'bold 20px Fredoka';
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.fillText('Double-tap to double jump!', canvas.width/2, canvas.height/2 + bounce);
        
        ctx.shadowBlur = 0;
        
        animIdRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      const b = brambleRef.current;

      if (gameStateRef.current === 'playing') {
        frameRef.current++;
        scrollOffsetRef.current += speedRef.current;

        // Physics
        b.vy += 0.55; // gravity
        b.y += b.vy;
        
        const groundY = canvas.height - groundHeight - brambleRadius;
        if (b.y >= groundY) {
          b.y = groundY;
          b.vy = 0;
          b.grounded = true;
        } else {
          b.grounded = false;
        }

        b.rotation += speedRef.current * (b.grounded ? 0.05 : 0.08);
        
        // Star trail
        if (!b.grounded && frameRef.current % 3 === 0) {
          particlesRef.current.push({
            x: b.x, y: b.y,
            vx: -speedRef.current * 0.5, vy: 0,
            color: 'rgba(245, 230, 211, 0.6)',
            alpha: 1,
            life: 10
          });
        }

        // Speed up
        if (frameRef.current % 150 === 0 && speedRef.current < 12) {
          speedRef.current += 0.15;
          const currentIntSpeed = Math.floor(speedRef.current);
          if (currentIntSpeed > milestoneRef.current.shown && currentIntSpeed >= 5) {
            milestoneRef.current = {
              shown: currentIntSpeed,
              text: getMilestoneMessage(currentIntSpeed),
              alpha: 1
            };
          }
        }

        // Spawning Flowers
        if (frameRef.current % 80 === 0) {
          flowersRef.current.push({
            x: canvas.width,
            y: canvas.height - groundHeight - 50 - Math.random() * 80,
            phase: Math.random() * Math.PI * 2
          });
        }

        // Spawning Obstacles
        if (frameRef.current % 140 === 0) { // simplified cooldown
          const lastObs = obstaclesRef.current[obstaclesRef.current.length - 1];
          if (!lastObs || (canvas.width - lastObs.x > 300)) {
            const isBig = Math.random() > 0.6;
            const colors = ['#E8651A', '#CC4400', '#FF7722'];
            obstaclesRef.current.push({
              x: canvas.width,
              y: canvas.height - groundHeight - (isBig ? 60 : 45),
              w: isBig ? 50 : 35,
              h: isBig ? 60 : 45,
              color: colors[Math.floor(Math.random() * colors.length)]
            });
          }
        }

        // Update & Draw Flowers
        for (let i = flowersRef.current.length - 1; i >= 0; i--) {
          const fl = flowersRef.current[i];
          fl.x -= speedRef.current;
          drawFlower(fl);

          // Collision
          const dist = Math.hypot(b.x - (fl.x+10), b.y - (fl.y+10));
          if (dist < brambleRadius + 15) {
            spawnParticles(fl.x+10, fl.y+10, ['#FFF', '#FFD700', '#FFB6C1'], 6);
            flowersRef.current.splice(i, 1);
            scoreRef.current++;
            setDisplayScore(scoreRef.current);
            onScoreUpdate?.(scoreRef.current, highScoreRef.current);
          } else if (fl.x < -30) {
            flowersRef.current.splice(i, 1);
          }
        }

        // Update & Draw Obstacles
        for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
          const obs = obstaclesRef.current[i];
          obs.x -= speedRef.current;
          drawObstacle(obs);

          // Collision (circle vs rect)
          const testX = Math.max(obs.x + 5, Math.min(b.x, obs.x + obs.w - 5));
          const testY = Math.max(obs.y + 5, Math.min(b.y, obs.y + obs.h - 5));
          const dist = Math.hypot(b.x - testX, b.y - testY);

          if (dist < brambleRadius - 4) {
            gameStateRef.current = 'gameover';
            spawnParticles(b.x, b.y, ['#A0522D', '#5C3317', '#E8651A'], 8);
            setTimeout(() => setDisplayState('gameover'), 500);
            
            if (scoreRef.current > highScoreRef.current) {
              highScoreRef.current = scoreRef.current;
              setDisplayHigh(scoreRef.current);
              localStorage.setItem('bramble_high_score', scoreRef.current.toString());
              onScoreUpdate?.(scoreRef.current, scoreRef.current);
            }
          }

          if (obs.x < -100) obstaclesRef.current.splice(i, 1);
        }
      } else if (gameStateRef.current === 'gameover') {
        // Just draw everything frozen
        flowersRef.current.forEach(drawFlower);
        obstaclesRef.current.forEach(drawObstacle);
      }

      // Draw Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 1 / p.life;
        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI*2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      drawBramble(b.x, b.y, b.rotation);
      
      // Draw Milestone text
      if (milestoneRef.current.alpha > 0) {
        ctx.save();
        ctx.globalAlpha = milestoneRef.current.alpha;
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 36px Fredoka';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 8;
        ctx.fillText(milestoneRef.current.text, canvas.width/2, canvas.height/3);
        ctx.restore();
        milestoneRef.current.alpha -= 0.01;
      }

      animIdRef.current = requestAnimationFrame(gameLoop);
    };

    animIdRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('touchstart', handleTouch);
      canvas.removeEventListener('mousedown', handleTouch);
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animIdRef.current);
    };
  }, [onScoreUpdate]);

  const getShareText = () => {
    const s = scoreRef.current;
    if (s >= 30) return `Bramble's on a roll! Grabbed ${s} flowers and left every fox in the dust. Beat that → bramble.top`;
    if (s >= 15) return `Running wild through Sunbell Meadow with Bramble! ${s} flowers down. Think you can do better? → bramble.top`;
    return `Okay so Bramble got ${s} flowers before a fox ruined everything. Not my fault. → bramble.top`;
  };

  const handleShare = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText())}`, '_blank', 'noopener,noreferrer');
  };

  const handlePlayAgain = () => {
    resetGameRef.current();
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative rounded-3xl overflow-hidden border-4 border-[#D4A574] shadow-[0_0_40px_rgba(212,165,116,0.4)] bg-[#1a2f1e]">
      <canvas 
        ref={canvasRef} 
        height={380} 
        className="w-full block touch-none cursor-pointer"
        data-testid="game-canvas"
      />
      
      {/* Grass strip at bottom inside wrapper */}
      <div className="absolute bottom-0 left-0 w-full h-4 opacity-80 pointer-events-none overflow-hidden">
        <svg viewBox="0 0 300 10" preserveAspectRatio="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 10 Q10 0 20 10 Q30 0 40 10 Q50 0 60 10 Q70 0 80 10 Q90 0 100 10 Q110 0 120 10 Q130 0 140 10 Q150 0 160 10 Q170 0 180 10 Q190 0 200 10 Q210 0 220 10 Q230 0 240 10 Q250 0 260 10 Q270 0 280 10 Q290 0 300 10 Z" fill="#4A7C59"/>
        </svg>
      </div>

      {displayState === 'gameover' && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-white z-10">
          <h3 className="text-4xl font-bold text-[#D4A574] mb-4 shadow-sm drop-shadow-lg text-center px-4">Oh no! A fox got Bramble!</h3>
          
          <div className="flex gap-8 mb-8 text-center">
            <div>
              <p className="text-sm text-white/70 uppercase tracking-widest mb-1">Flowers</p>
              <p className="text-3xl font-bold">🌼 {displayScore}</p>
            </div>
            <div>
              <p className="text-sm text-white/70 uppercase tracking-widest mb-1">Best</p>
              <p className="text-3xl font-bold text-white/90">⭐ {displayHigh}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={handlePlayAgain} className="active:scale-95 transition-transform rounded-full px-8 py-6 text-lg font-bold bg-[#D4A574] text-[#3D2817] hover:bg-[#c29668] hover:scale-105 shadow-xl" data-testid="button-play-again">
              Run Again
            </Button>
            <Button 
              onClick={handleShare}
              className="active:scale-95 transition-transform rounded-full px-8 py-6 text-lg font-bold bg-black text-white hover:bg-black/80 hover:scale-105 shadow-xl flex items-center gap-2"
              data-testid="button-share-x"
            >
              <SiX /> Brag on X
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
