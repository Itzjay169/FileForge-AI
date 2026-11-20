'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
  decay: number;
}

export const AnimeCursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    const particles: Particle[] = [];
    const colors = ['#ff5fa2', '#a78bfa', '#6d5ae0', '#38bdf8'];
    let lastX = 0;
    let lastY = 0;
    let hasMoved = false;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (!hasMoved) {
        lastX = clientX;
        lastY = clientY;
        hasMoved = true;
        return;
      }

      const dist = Math.hypot(clientX - lastX, clientY - lastY);
      // Spawn particles only when pointer actually moves at least 4px
      if (dist > 4) {
        const count = Math.min(3, Math.floor(dist / 8) + 1);
        for (let i = 0; i < count; i++) {
          const color = colors[Math.floor(Math.random() * colors.length)];
          particles.push({
            x: clientX + (Math.random() - 0.5) * 8,
            y: clientY + (Math.random() - 0.5) * 8,
            size: Math.random() * 3.5 + 1.5,
            speedX: (Math.random() - 0.5) * 1.5,
            speedY: (Math.random() - 0.5) * 1.5 - 0.5,
            color,
            alpha: 0.85,
            decay: Math.random() * 0.035 + 0.025,
          });
        }
        lastX = clientX;
        lastY = clientY;
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha -= p.decay;
        p.size *= 0.96;

        if (p.alpha <= 0 || p.size <= 0.4) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        // Anime spark diamond / circle hybrid
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30"
      aria-hidden="true"
    />
  );
};
