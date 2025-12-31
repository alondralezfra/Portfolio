import { useEffect, useRef } from "react";

const NUM_CREATURES = 120;

/**
 * Interface for tiny swimming creatures.
 */
interface Creature {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  wobble: number;
}

/**
 * React component for fluid background.
 * @returns 
 */
export function FluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const creatures = useRef<Creature[]>([]);
  const mouse = useRef({ x: 0, y: 0, active: false });

  // simple smooth flow field (not full Navier–Stokes → fast & pretty)
  const flow = (x: number, y: number, t: number) => {
    const nx = x * 0.0015 + t * 0.0003;
    const ny = y * 0.0015 - t * 0.00025;
    const angle = Math.sin(nx) + Math.cos(ny);
    return {
      vx: Math.cos(angle),
      vy: Math.sin(angle),
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // create creatures
    creatures.current = Array.from({ length: NUM_CREATURES }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: 0,
      vy: 0,
      size: 1.2 + Math.random() * 2.2,
      wobble: Math.random() * Math.PI * 2,
    }));

    const handleMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY, active: true };
    };
    const handleLeave = () => (mouse.current.active = false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);

    let last = performance.now();

    const loop = (time: number) => {
      const dt = time - last;
      last = time;

      ctx.fillStyle = "rgba(245, 234, 214, 0.25)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      creatures.current.forEach((c) => {
        // flow influence
        const f = flow(c.x, c.y, time);

        c.vx += f.vx * 0.3;
        c.vy += f.vy * 0.3;

        // wobble
        c.wobble += 0.05;
        c.vx += Math.cos(c.wobble) * 0.05;
        c.vy += Math.sin(c.wobble) * 0.05;

        // mild avoidance of mouse
        if (mouse.current.active) {
          const dx = c.x - mouse.current.x;
          const dy = c.y - mouse.current.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 120) {
            c.vx += (dx / dist) * 0.8;
            c.vy += (dy / dist) * 0.8;
          }
        }

        // damping
        c.vx *= 0.96;
        c.vy *= 0.96;

        c.x += c.vx;
        c.y += c.vy;

        // wrap edges
        if (c.x < 0) c.x = canvas.width;
        if (c.x > canvas.width) c.x = 0;
        if (c.y < 0) c.y = canvas.height;
        if (c.y > canvas.height) c.y = 0;

        // draw creature (tadpole / comet shape)
        const angle = Math.atan2(c.vy, c.vx);

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(angle);

        // body
        ctx.beginPath();
        ctx.ellipse(0, 0, c.size * 2.2, c.size, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(90, 65, 45, 0.7)";
        ctx.fill();

        // tail
        ctx.beginPath();
        ctx.moveTo(-c.size * 2.3, 0);
        ctx.quadraticCurveTo(
          -c.size * 3.4,
          Math.sin(time * 0.01 + c.wobble) * 2,
          -c.size * 4.2,
          0
        );
        ctx.strokeStyle = "rgba(90, 65, 45, 0.55)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
      });

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="fluid-bg-canvas" />;
}