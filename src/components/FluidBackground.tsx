import React, { useRef, useEffect } from 'react';
import FluidDynamicsSolver from '../fluidSimulation/FluidDynamicsSolver'; // Adjust the import path according to your project structure

// Canvas spans full window
const canvasWidth = window.innerWidth
const canvasHeight = window.innerHeight

// Simulation grid uses whichever side is larger to stay square
const size = (canvasWidth > canvasHeight) ? canvasWidth : canvasHeight

/**
 * React component for fluid background which uses the FluidDynamicSolver class
 * @returns React component as function
 */
const FluidBackground: React.FC = () => {
  const canvasRef = useRef< HTMLCanvasElement | null >(null);
  const scale = (canvasWidth > 600) ? 10 : 6; // higher scale = faster simulation

  // Initialize the solver for fluid background with no diffusion or viscosity
  const solver = new FluidDynamicsSolver(Math.floor(size / scale), 0.006, 0.0, 0.0);
  
  // Kick the fluid (pre-seeded motion)
  solver.addVelocity(Math.floor(canvasWidth * 3 / 5 / scale), Math.floor(canvasHeight / 2 / scale), 5000, 0)
  solver.addVelocity(Math.floor(canvasWidth * 2 / 5 / scale), Math.floor(canvasHeight / 2 / scale), -5000, 0)
  solver.addVelocity(Math.floor(canvasWidth * 2.5 / 5 / scale), Math.floor(canvasHeight * 2.3 / 5 / scale), 0, -7000)
  solver.addVelocity(Math.floor(canvasWidth * 2.5 / 5 / scale), Math.floor(canvasHeight * 2.7 / 5 / scale), 0, 7000)
  
  const amount = 60; // density added by mouse
  const velocityAmount = 40; // strength of mouse pushing fluid

  useEffect(() => {
    // canvas set up
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastX = 0;
    let lastY = 0;

    // Mouse interaction handler
    const onMouseMove = (event: MouseEvent) => {
      // Converts from pixel coordinates to solver grid
      const x = event.clientX;
      const y = event.clientY;
      if (x <= 10 || y <= 10) return;

      const gridX = Math.floor(x / scale);
      const gridY = Math.floor(y / scale);

      // Adds density and velocity based on mouse direction and speed
      solver.addDensity(gridX, gridY, amount);
      solver.addVelocity(gridX, gridY, (x - lastX) / scale * velocityAmount, (y - lastY) / scale * velocityAmount);

      lastX = x;
      lastY = y;
    };

    // Render loop updates fluid physics, wipes canvas, and draws a new frame
    const render = () => {
      solver.simulate(); // Simulate one step

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let j = 0; j < solver.N; j++) {
        for (let i = 0; i < solver.N; i++) {

          // Read velocity from solver
          const u = solver.u[solver.IX(i, j)];
          const v = solver.v[solver.IX(i, j)];

          // Calculate the vector's magnitude and use it to scale the length
          const magnitude = Math.sqrt(u * u + v * v);
          let vectorLength = Math.max(1, magnitude * 20) - 1;
          vectorLength = Math.min(vectorLength, scale * 7); // Cap the length to half the cell size

          // Calculate angle for the direction
          const angle = Math.atan2(v, u);

          // Set up for drawing
          ctx.save();
          ctx.translate(i * scale + scale / 2, j * scale + scale / 2); // Center of cell
          ctx.rotate(angle);
          ctx.fillStyle = `rgba(160, 115, 90, ${Math.min(0.22, Math.abs(magnitude / 6))})`; // warm brown

          // Draw the vector as a rounded rectangle
          ctx.fillRect(-scale, -scale, scale, scale);

          ctx.restore();
        }
      }

      animationFrameId = window.requestAnimationFrame(render);
    };

    // Attach mouse listener and run animation
    window.addEventListener('mousemove', onMouseMove);
    render();

    return () => {
      // Clean up on unmount
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);
  return (
    <>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className="fluid-bg-canvas"
      />
    </>
  )
};

export default FluidBackground;
