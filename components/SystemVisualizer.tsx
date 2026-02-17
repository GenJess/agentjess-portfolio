
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useRef } from 'react';

const SystemVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth;
    let height = canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;

    // 3D Config
    const particleCount = 150;
    const connectionDistance = 100;
    const rotationSpeed = 0.002;
    const baseRadius = 300; // Radius of the cloud

    // State
    const particles: { x: number; y: number; z: number; size: number }[] = [];
    
    // Initialize Particles in a spherical cloud
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = baseRadius * (0.5 + Math.random() * 0.5); // Variable radius for depth

      particles.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        size: Math.random() * 2 + 0.5
      });
    }

    let angleX = 0;
    let angleY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        // Normalized mouse coordinates (-1 to 1)
        mouseX = ((e.clientX - rect.left) / width) * 2 - 1;
        mouseY = ((e.clientY - rect.top) / height) * 2 - 1;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Auto rotate + Mouse influence
      angleX += rotationSpeed + (mouseY * 0.001);
      angleY += rotationSpeed + (mouseX * 0.001);

      const cx = width / 2;
      const cy = height / 2;
      
      // 3D Projection
      const projectedParticles = particles.map(p => {
        // Rotate Y
        let x = p.x * Math.cos(angleY) - p.z * Math.sin(angleY);
        let z = p.x * Math.sin(angleY) + p.z * Math.cos(angleY);
        
        // Rotate X
        let y = p.y * Math.cos(angleX) - z * Math.sin(angleX);
        z = p.y * Math.sin(angleX) + z * Math.cos(angleX);

        // Perspective
        const scale = 800 / (800 + z); // Field of view
        const px = cx + x * scale;
        const py = cy + y * scale;
        const alpha = (z + baseRadius) / (2 * baseRadius); // Fade distant particles

        return { x: px, y: py, z, scale, alpha, size: p.size };
      });

      // Draw Connections
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projectedParticles.length; i++) {
        const p1 = projectedParticles[i];
        if (p1.alpha < 0.1) continue;

        for (let j = i + 1; j < projectedParticles.length; j++) {
            const p2 = projectedParticles[j];
            if (p2.alpha < 0.1) continue;

            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < connectionDistance * p1.scale) {
                ctx.beginPath();
                // Alpha based on depth overlap
                const connAlpha = Math.min(p1.alpha, p2.alpha) * (1 - dist / (connectionDistance * p1.scale));
                ctx.strokeStyle = `rgba(255, 255, 255, ${connAlpha * 0.3})`;
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
      }

      // Draw Nodes
      projectedParticles.forEach(p => {
          if (p.alpha < 0) return;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.scale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
          ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-auto" />;
};

export default SystemVisualizer;
