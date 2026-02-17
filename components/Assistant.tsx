
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { CategoryId } from '../types';
import { useConversation } from '@elevenlabs/react';

export interface AssistantRef {
    startVoiceSession: () => void;
}

interface AssistantProps {
    onNavigate: (category: CategoryId) => void;
}

// 3D Energetic Morphing Orb
const ParticleOrb: React.FC<{ 
    active: boolean; 
    connecting: boolean;
    audioLevel: number; 
}> = ({ active, connecting, audioLevel }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: { theta: number; phi: number; baseR: number; speed: number; phase: number }[] = [];
        const particleCount = 180;
        const baseRadius = 50;

        // Initialize particles with spherical coordinates
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                theta: Math.random() * Math.PI * 2,
                phi: Math.acos((Math.random() * 2) - 1),
                baseR: baseRadius,
                speed: 0.02 + Math.random() * 0.03,
                phase: Math.random() * Math.PI * 2
            });
        }

        let time = 0;

        const render = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
            ctx.clearRect(0, 0, rect.width, rect.height);
            
            time += 0.02;
            const energy = active ? (0.2 + audioLevel * 2.0) : 0.05; // High energy when active
            
            // Rotation
            const angleX = time * 0.2;
            const angleY = time * 0.3;

            const cx = rect.width / 2;
            const cy = rect.height / 2;

            particles.forEach(p => {
                // Morphing Logic: Radius fluctuates based on sine waves + audio
                const perturbation = Math.sin(p.theta * 5 + time * 3) * Math.cos(p.phi * 4 + time * 2) * 10;
                const activeJitter = active ? (Math.random() - 0.5) * audioLevel * 40 : 0;
                const r = p.baseR + perturbation * energy + activeJitter;

                // Spherical to Cartesian
                let x = r * Math.sin(p.phi) * Math.cos(p.theta);
                let y = r * Math.sin(p.phi) * Math.sin(p.theta);
                let z = r * Math.cos(p.phi);

                // Rotate 3D
                const cosX = Math.cos(angleX);
                const sinX = Math.sin(angleX);
                const tempY = y * cosX - z * sinX;
                const tempZ = y * sinX + z * cosX;
                y = tempY;
                z = tempZ;

                const cosY = Math.cos(angleY);
                const sinY = Math.sin(angleY);
                const tempX = x * cosY + z * sinY;
                z = -x * sinY + z * cosY;
                x = tempX;

                // Project
                const scale = 250 / (250 + z); 
                const projX = cx + x * scale;
                const projY = cy + y * scale;
                
                // Draw
                const alpha = (z + baseRadius) / (2 * baseRadius);
                ctx.beginPath();
                ctx.arc(projX, projY, (active ? 2 : 1.5) * scale, 0, Math.PI * 2);
                
                if (connecting) {
                    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                } else if (active) {
                    // Energetic Cyan/Emerald
                    ctx.fillStyle = `rgba(${50 + audioLevel * 200}, ${255 - audioLevel * 100}, ${200}, ${alpha})`; 
                } else {
                    ctx.fillStyle = `rgba(100, 100, 100, ${alpha * 0.5})`; // Idle
                }
                ctx.fill();

                // Draw "Lines that Flash" - connections when active
                if (active && Math.random() > 0.95) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(cx, cy); // From center
                    ctx.lineTo(projX, projY);
                    ctx.stroke();
                }
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrameId);
    }, [active, connecting, audioLevel]);

    return <canvas ref={canvasRef} className="w-full h-full" />;
};


const Assistant = forwardRef<AssistantRef, AssistantProps>(({ onNavigate }, ref) => {
  const conversation = useConversation({
    clientTools: {
        navigateToSection: async ({ section }: { section: string }) => {
            console.log(`[Assistant] Navigating to: ${section}`);
            onNavigate(section as CategoryId);
            return `Successfully navigated to the ${section} section.`;
        },
        showContent: async ({ section, contentId }: { section: string, contentId: string }) => {
            console.log(`[Assistant] Showing content: ${contentId} in section: ${section}`);
            onNavigate(section as CategoryId);
            // Additional highlighting logic could go here if needed
            return `Opening content "${contentId}" in the ${section} section.`;
        }
    }
  });

  const { status, startSession, endSession, volume } = conversation;
  
  const isConnecting = status === 'connecting';
  const isActive = status === 'connected';

  useImperativeHandle(ref, () => ({
    startVoiceSession: () => {
        if (!isActive && !isConnecting) {
            handleToggle();
        }
    }
  }));

  const handleToggle = async () => {
    if (isActive) {
      await endSession();
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        await startSession({
          agentId: 'agent_7001kh2pfd5peacrnm1kkdbv59f8'
        });
      } catch (error) {
        console.error("Failed to start ElevenLabs session:", error);
      }
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] group">
      
      {/* Dynamic Status Label */}
      <div className={`absolute bottom-full right-0 mb-4 font-mono text-[9px] tracking-[0.3em] uppercase transition-all duration-500 pointer-events-none ${
        isActive ? 'text-emerald-500 opacity-100 translate-y-0' : 'text-zinc-600 opacity-0 translate-y-2'
      }`}>
        <span className="bg-black/80 px-3 py-1 rounded backdrop-blur-md border border-white/5">
            {isConnecting ? 'Initializing...' : 'Voice Agent // Online'}
        </span>
      </div>

      {/* The Unified Interactive Orb Container */}
      <button 
        onClick={handleToggle}
        className={`relative w-24 h-24 rounded-full transition-all duration-700 ease-out hover:scale-110 active:scale-95 flex items-center justify-center overflow-hidden border ${
            isActive 
                ? 'bg-black border-emerald-500/50 shadow-[0_0_60px_rgba(16,185,129,0.3)]' 
                : 'bg-black/40 backdrop-blur-md border-white/10 hover:border-white/30'
        }`}
      >
         {/* 3D Reactive Particle Canvas */}
         <div className="w-full h-full relative z-10 scale-125">
            <ParticleOrb 
                active={isActive} 
                connecting={isConnecting}
                audioLevel={volume} 
            />
         </div>

         {/* Center Icon Overlay (Fades out when active to show raw energy) */}
         <div className={`absolute inset-0 z-20 flex items-center justify-center transition-all duration-500 ${
             !isActive && !isConnecting ? 'opacity-50 group-hover:opacity-100' : 'opacity-0 scale-50'
         }`}>
             <span className="material-symbols-outlined text-white text-2xl">mic</span>
         </div>
         
         {/* Close Icon (Shows only on Hover when active) */}
         <div className={`absolute inset-0 z-30 flex items-center justify-center transition-all duration-300 ${
             isActive ? 'opacity-0 group-hover:opacity-100 bg-black/50 backdrop-blur-sm' : 'opacity-0 pointer-events-none'
         }`}>
             <span className="material-symbols-outlined text-white text-2xl">stop</span>
         </div>
      </button>

      {/* Decorative Outer Ring (Static Technical) */}
      {!isActive && (
          <div className="absolute inset-[-4px] border border-white/5 rounded-full pointer-events-none"></div>
      )}
    </div>
  );
});

export default Assistant;
