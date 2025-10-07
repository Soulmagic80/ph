"use client";

import { useEffect, useRef } from 'react';

interface DotGridProps {
  dotSize?: number;
  gap?: number;
  color?: string;
  hoverColor?: string;
  hoverRadius?: number;
}

export function DotGrid({
  dotSize = 2,
  gap = 30,
  color = '#000000',
  hoverColor = '#3474DB', // blue-primary
  hoverRadius = 100
}: DotGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Array<{ x: number; y: number }>>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      ctx.scale(dpr, dpr);

      // Build grid
      const cols = Math.floor(rect.width / gap);
      const rows = Math.floor(rect.height / gap);
      
      const dots: Array<{ x: number; y: number }> = [];
      for (let row = 0; row <= rows; row++) {
        for (let col = 0; col <= cols; col++) {
          dots.push({
            x: col * gap,
            y: row * gap
          });
        }
      }
      dotsRef.current = dots;
    };

    const draw = () => {
      if (!ctx || !canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const { x: mouseX, y: mouseY } = mouseRef.current;

      for (const dot of dotsRef.current) {
        // Calculate distance from mouse
        const distToMouse = Math.hypot(dot.x - mouseX, dot.y - mouseY);
        const isNearMouse = distToMouse < hoverRadius;

        // Fade calculations
        const normalizedX = dot.x / rect.width; // 0 = left, 1 = right
        const normalizedY = dot.y / rect.height; // 0 = top, 1 = bottom
        
        // Fade from left (smooth fade-in)
        const fadeFromLeft = Math.min(1, normalizedX * 5); // Fade in from left edge
        
        // Fade to right (smooth)
        const fadeFromRight = Math.max(0, 1 - normalizedX * 1.2);
        
        // Fast fade from top (no dots near navbar)
        const fadeFromTop = normalizedY < 0.15 ? 0 : Math.min(1, (normalizedY - 0.15) * 3);
        
        // Fast fade from bottom (no dots near filter)
        const fadeFromBottom = normalizedY > 0.85 ? 0 : Math.min(1, (0.85 - normalizedY) * 3);
        
        // Combine all fades
        const fadeAlpha = fadeFromLeft * fadeFromRight * fadeFromTop * fadeFromBottom;

        if (fadeAlpha <= 0) continue; // Skip invisible dots

        // Determine color
        let finalColor = color;
        let alpha = fadeAlpha * 0.15; // Very subtle base opacity

        if (isNearMouse) {
          const hoverT = 1 - distToMouse / hoverRadius;
          finalColor = hoverColor;
          alpha = fadeAlpha * (0.15 + hoverT * 0.4); // Increase opacity on hover
        }

        // Parse color and apply alpha
        const rgb = finalColor.match(/\w\w/g);
        if (rgb) {
          const [r, g, b] = rgb.map(x => parseInt(x, 16));
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        } else {
          ctx.fillStyle = finalColor;
          ctx.globalAlpha = alpha;
        }

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dotSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    resize();
    draw();

    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [dotSize, gap, color, hoverColor, hoverRadius]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
