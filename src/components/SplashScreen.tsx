import { useEffect, useRef, useState } from 'react';

const CODE_CHARS = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

interface Column {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  color: string;
  changeTimer: number;
}

interface SplashScreenProps {
  onDone: () => void;
}

export function SplashScreen({ onDone }: SplashScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startTimeRef = useRef<number>(performance.now());
  const onDoneRef = useRef(onDone);
  const [elapsed, setElapsed] = useState(0);

  // Keep onDone ref current
  useEffect(() => { onDoneRef.current = onDone; }, [onDone]);

  // State timer rAF — drives all React-rendered animation values
  useEffect(() => {
    let rafId: number;
    const tick = () => {
      const now = performance.now() - startTimeRef.current;
      setElapsed(now);
      if (now < 10200) {
        rafId = requestAnimationFrame(tick);
      } else {
        onDoneRef.current();
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Code rain canvas — runs independently for performance
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let columns: Column[] = [];

    const buildColumns = () => {
      const colCount = Math.floor(canvas.width / 20);
      columns = Array.from({ length: colCount }, (_, i) => ({
        x: (canvas.width / colCount) * i,
        y: Math.random() * canvas.height,
        speed: 0.5 + Math.random() * 1.5,
        chars: Array.from({ length: 25 }, () =>
          CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
        ),
        color: Math.random() > 0.7 ? '#a855f7' : '#06b6d4',
        changeTimer: 0,
      }));
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      buildColumns();
    };
    resize();
    window.addEventListener('resize', resize);

    let lastTime = performance.now();
    let animId: number;

    const render = (now: number) => {
      const dt = Math.min(now - lastTime, 50);
      lastTime = now;

      const elapsedMs = now - startTimeRef.current;
      // Code rain builds from opacity 0.05 to 0.4 over first 3 seconds
      const opacity = Math.min(0.4, 0.05 + (elapsedMs / 3000) * 0.35);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      columns.forEach((col) => {
        col.y += col.speed * (dt / 16);
        if (col.y > canvas.height + 500) col.y = -500;

        col.changeTimer += dt;
        if (col.changeTimer > 200) {
          col.chars[0] = CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
          col.changeTimer = 0;
        }

        col.chars.forEach((char, i) => {
          const yPos = col.y + i * 20;
          if (yPos < -20 || yPos > canvas.height + 20) return;
          const brightness = i === 0 ? 1 : Math.max(0, 1 - i * 0.08);
          ctx.globalAlpha = brightness * opacity;
          ctx.font = '16px monospace';
          ctx.fillStyle = i === 0 ? '#ffffff' : col.color;
          ctx.shadowColor = i === 0 ? col.color : 'transparent';
          ctx.shadowBlur = i === 0 ? 10 : 0;
          ctx.fillText(char, col.x, yPos);
        });
      });

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // ─── Derived animation values from elapsed time ───────────────────────────

  // Orbs float via elapsed (smooth since setElapsed is called every rAF)
  const t = elapsed / 1000; // seconds
  const orb1X = Math.sin(t * 0.4) * 50;
  const orb1Y = Math.cos(t * 0.3) * 30;
  const orb2X = Math.sin(t * 0.5) * 40;
  const orb2Y = Math.cos(t * 0.4) * 50;

  // Corner brackets fade in over first 1s
  const bracketOpacity = Math.min(0.6, elapsed / 1000 * 0.6);

  // Logo: appears at 2000ms, spring-like scale
  const logoProgress = elapsed < 2000 ? 0 : Math.min(1, (elapsed - 2000) / 600);
  const logoScale = logoProgress === 0 ? 0 : 0.5 + logoProgress * 0.6 + Math.sin(logoProgress * Math.PI) * 0.1;
  const logoRotation = (1 - logoProgress) * -10;
  const logoOpacity = logoProgress;

  // Tagline: typewriter from 4000ms
  const TAGLINE = "Build The Future";
  const taglineProgress = elapsed < 4000 ? 0 : (elapsed - 4000) / 1200;
  const taglineChars = Math.floor(Math.min(taglineProgress, 1) * TAGLINE.length);
  const taglineText = TAGLINE.slice(0, taglineChars);
  const taglineOpacity = elapsed < 4000 ? 0 : Math.min(1, (elapsed - 4000) / 200);
  const showCursor = elapsed >= 4000 && taglineChars < TAGLINE.length;

  // Secondary text: fades in at 6000ms
  const secondaryOpacity = elapsed < 6000 ? 0 : Math.min(1, (elapsed - 6000) / 400);

  // Decorative line: expands from 6500ms
  const lineProgress = elapsed < 6500 ? 0 : Math.min(1, (elapsed - 6500) / 700);
  const lineWidth = lineProgress * 300;

  // Overall fade out from 9000ms → 10000ms
  const fadeOut = elapsed < 9000 ? 1 : Math.max(0, 1 - (elapsed - 9000) / 1000);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'radial-gradient(circle at center, #0a0f1a 0%, #111827 100%)',
        overflow: 'hidden',
        opacity: fadeOut,
      }}
    >
      {/* Code rain canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />

      {/* Floating orb — cyan */}
      <div
        style={{
          position: 'absolute',
          left: `calc(15% + ${orb1X}px)`,
          top: `calc(28% + ${orb1Y}px)`,
          width: 'clamp(200px, 30vw, 400px)',
          height: 'clamp(200px, 30vw, 400px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Floating orb — purple */}
      <div
        style={{
          position: 'absolute',
          right: `calc(15% - ${orb2X}px)`,
          bottom: `calc(22% - ${orb2Y}px)`,
          width: 'clamp(150px, 25vw, 300px)',
          height: 'clamp(150px, 25vw, 300px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          transform: 'translate(50%, 50%)',
        }}
      />

      {/* Center content */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          padding: '0 clamp(16px, 5vw, 40px)',
        }}
      >
        {/* Logo */}
        {elapsed >= 1800 && (
          <div
            style={{
              width: 'clamp(140px, 26vw, 260px)',
              height: 'clamp(140px, 26vw, 260px)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${logoScale}) rotate(${logoRotation}deg)`,
              opacity: logoOpacity,
            }}
          >
            {/* Glow behind logo */}
            <div
              style={{
                position: 'absolute',
                width: '160%',
                height: '160%',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)',
                filter: 'blur(20px)',
              }}
            />
            <img
              src="/Nretrospec logos FINALS1.png"
              alt="N Retrospec"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                position: 'relative',
                zIndex: 1,
                filter: 'drop-shadow(0 0 12px rgba(6,182,212,0.9))',
              }}
            />
          </div>
        )}

        {/* "Build The Future" — typewriter */}
        <div
          style={{
            marginTop: 'clamp(20px, 4vh, 40px)',
            opacity: taglineOpacity,
            fontSize: 'clamp(26px, 5vw, 72px)',
            fontWeight: 700,
            fontFamily: 'Inter, system-ui, sans-serif',
            color: '#ffffff',
            textShadow: '0 0 10px #06b6d4, 0 0 20px #06b6d4, 0 0 40px #06b6d4',
            letterSpacing: '-0.02em',
            textAlign: 'center',
            minHeight: '1.3em',
            lineHeight: 1.2,
          }}
        >
          {taglineText}
          {showCursor && (
            <span
              style={{
                opacity: Math.sin(elapsed / 150) > 0 ? 1 : 0,
                color: '#06b6d4',
              }}
            >
              |
            </span>
          )}
        </div>

        {/* "Custom Web Development" */}
        <div
          style={{
            marginTop: 'clamp(12px, 2vh, 24px)',
            opacity: secondaryOpacity,
            fontSize: 'clamp(13px, 2.5vw, 36px)',
            fontWeight: 400,
            fontFamily: 'Inter, system-ui, sans-serif',
            color: '#ffffff',
            textShadow: '0 0 8px #a855f7, 0 0 20px #a855f7',
            letterSpacing: '-0.02em',
            textAlign: 'center',
          }}
        >
          Custom Web Development
        </div>

        {/* Decorative expanding line */}
        <div
          style={{
            marginTop: 'clamp(20px, 4vh, 40px)',
            width: `min(${lineWidth}px, 80vw)`,
            height: 2,
            background: 'linear-gradient(135deg, #06b6d4, #a855f7)',
            boxShadow: '0 0 10px #06b6d4, 0 0 20px #06b6d4',
          }}
        />
      </div>

      {/* Corner bracket — top left */}
      <div
        style={{
          position: 'absolute',
          top: 'clamp(16px, 3vw, 40px)',
          left: 'clamp(16px, 3vw, 40px)',
          width: 'clamp(24px, 4vw, 60px)',
          height: 'clamp(24px, 4vw, 60px)',
          borderLeft: '3px solid #06b6d4',
          borderTop: '3px solid #06b6d4',
          opacity: bracketOpacity,
        }}
      />

      {/* Corner bracket — bottom right */}
      <div
        style={{
          position: 'absolute',
          bottom: 'clamp(16px, 3vw, 40px)',
          right: 'clamp(16px, 3vw, 40px)',
          width: 'clamp(24px, 4vw, 60px)',
          height: 'clamp(24px, 4vw, 60px)',
          borderRight: '3px solid #a855f7',
          borderBottom: '3px solid #a855f7',
          opacity: bracketOpacity,
        }}
      />
    </div>
  );
}
