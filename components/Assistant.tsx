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

// 3D Particle Orb Component - Re-wired for ElevenLabs audio levels
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
        let particles: { x: number; y: number; z: number; size: number }[] = [];
        const particleCount = 120;
        const baseRadius = 50;

        for (let i = 0; i < particleCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            particles.push({
                x: baseRadius * Math.sin(phi) * Math.cos(theta),
                y: baseRadius * Math.sin(phi) * Math.sin(theta),
                z: baseRadius * Math.cos(phi),
                size: Math.random() * 1.8 + 0.4
            });
        }

        let angleX = 0;
        let angleY = 0;

        const render = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
            ctx.clearRect(0, 0, rect.width, rect.height);
            
            // Rotation speed logic
            let rotationSpeed = 0.005;
            if (connecting) rotationSpeed = 0.05;
            if (active) rotationSpeed = 0.01 + (audioLevel * 0.05);
            
            angleX += rotationSpeed;
            angleY += rotationSpeed;
            
            // Physical expansion based on ElevenLabs volume
            const currentRadius = active ? (baseRadius + (audioLevel * 60)) : baseRadius;
            const cx = rect.width / 2;
            const cy = rect.height / 2;

            particles.forEach(p => {
                let x = p.x;
                let y = p.y;
                let z = p.z;

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

                const scale = 200 / (200 + z); 
                const projX = cx + x * scale * (currentRadius/baseRadius);
                const projY = cy + y * scale * (currentRadius/baseRadius);
                
                const alpha = (z + baseRadius) / (2 * baseRadius);
                ctx.beginPath();
                ctx.arc(projX, projY, p.size * scale, 0, Math.PI * 2);
                
                if (connecting) {
                    ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
                } else if (active) {
                    ctx.fillStyle = `rgba(52, 211, 153, ${alpha})`; // Emerald 400
                } else {
                    ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.15})`; // Idle
                }
                ctx.fill();
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

      {/* The Unified Interactive Orb */}
      <button 
        onClick={handleToggle}
        className={`relative w-20 h-20 rounded-full transition-all duration-700 ease-out hover:scale-110 active:scale-95 flex items-center justify-center overflow-hidden border ${
            isActive 
                ? 'bg-black border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.2)]' 
                : 'bg-zinc-950/40 backdrop-blur-md border-white/5 hover:border-white/20'
        }`}
      >
         {/* Internal Glow Effect */}
         <div className={`absolute inset-0 transition-opacity duration-700 ${
             isActive ? 'opacity-10' : 'opacity-0'
         } bg-emerald-500`}></div>

         {/* 3D Reactive Particle Canvas */}
         <div className="w-full h-full relative z-10">
            <ParticleOrb 
                active={isActive} 
                connecting={isConnecting}
                audioLevel={volume} 
            />
         </div>

         {/* Center Icon Overlay (Subtle) */}
         <div className={`absolute inset-0 z-20 flex items-center justify-center transition-all duration-500 ${
             !isActive && !isConnecting ? 'opacity-40 group-hover:opacity-100' : 'opacity-0 scale-50'
         }`}>
             <span className="material-symbols-outlined text-white text-xl">mic</span>
         </div>

         {/* Stop Icon (Visible when active) */}
         <div className={`absolute inset-0 z-20 flex items-center justify-center transition-all duration-500 ${
             isActive ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'
         }`}>
             <span className="material-symbols-outlined text-white text-xl">stop</span>
         </div>
      </button>

      {/* Decorative Outer Rings (Active Only) */}
      {isActive && (
          <div className="absolute inset-[-10px] border border-emerald-500/10 rounded-full animate-[spin_10s_linear_infinite] pointer-events-none"></div>
      )}
    </div>
  );
});

export default Assistant;