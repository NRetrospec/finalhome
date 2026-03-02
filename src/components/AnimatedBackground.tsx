import { useEffect, useRef } from 'react';

const CODE_CHARS = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
const OPACITY = 0.15;

interface Column {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  color: string;
  changeTimer: number;
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let columns: Column[] = [];

    const buildColumns = () => {
      // Fewer columns on narrow screens for performance
      const spacing = window.innerWidth < 640 ? 26 : 22;
      const colCount = Math.floor(canvas.width / spacing);
      columns = Array.from({ length: colCount }, (_, i) => ({
        x: (canvas.width / colCount) * i + (Math.random() * 6 - 3),
        y: Math.random() * canvas.height,
        speed: 0.25 + Math.random() * 0.65,
        chars: Array.from({ length: 20 }, () =>
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

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      columns.forEach((col) => {
        col.y += col.speed * (dt / 16);
        if (col.y > canvas.height + 380) col.y = -380;

        col.changeTimer += dt;
        if (col.changeTimer > 350) {
          const idx = Math.floor(Math.random() * col.chars.length);
          col.chars[idx] = CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
          col.changeTimer = 0;
        }

        const fontSize = window.innerWidth < 640 ? 13 : 15;
        const lineH = fontSize + 5;

        col.chars.forEach((char, i) => {
          const yPos = col.y + i * lineH;
          if (yPos < -20 || yPos > canvas.height + 20) return;
          const brightness = i === 0 ? 1 : Math.max(0, 1 - i * 0.1);
          ctx.globalAlpha = brightness * OPACITY;
          ctx.font = `${fontSize}px monospace`;
          ctx.fillStyle = i === 0 ? '#ffffff' : col.color;
          ctx.shadowColor = i === 0 ? col.color : 'transparent';
          ctx.shadowBlur = i === 0 ? 8 : 0;
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

  return (
    <>
      {/* Canvas for code rain */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Floating orbs via CSS animations */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        <div className="bg-orb-1" />
        <div className="bg-orb-2" />
      </div>
    </>
  );
}
