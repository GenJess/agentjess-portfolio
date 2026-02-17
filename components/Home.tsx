
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { CategoryId } from '../types';
import SystemVisualizer from './SystemVisualizer';

interface HomeProps {
  onNavigate: (target: CategoryId | 'all-projects') => void;
  onStartVoice: () => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, onStartVoice }) => {
  return (
    <section className="relative h-screen w-full bg-[#050505] overflow-hidden flex flex-col pt-24">
        
        {/* Background Visualizer - "The Three.js Thing" */}
        <div className="absolute right-0 top-0 w-full md:w-[70%] h-full z-0 opacity-80">
            <SystemVisualizer />
            {/* Gradient masks */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent pointer-events-none"></div>
        </div>

        <div className="relative z-10 h-full max-w-[1400px] mx-auto w-full px-8 grid grid-cols-1 lg:grid-cols-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col justify-center h-full pb-20">
                
                {/* Meta Header */}
                <div className="flex items-center gap-4 mb-8 animate-fade-in opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm">
                         <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-mono text-emerald-500 tracking-widest uppercase font-bold">System Online</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase">v2.4.0 // Build 2025</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-6xl md:text-8xl font-display font-semibold text-white leading-[0.95] tracking-tighter mb-8 animate-fade-in opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                    The Architecture<br/>
                    <span className="text-zinc-600">of Intelligence.</span>
                </h1>
                
                {/* Subheadline */}
                <p className="text-lg md:text-xl text-zinc-400 max-w-lg leading-relaxed font-light mb-12 border-l border-white/10 pl-8 animate-fade-in opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                    A portfolio of algorithmic finance, generative identity, and autonomous agents. 
                    Building systems that <span className="text-white font-medium">think</span>, <span className="text-white font-medium">trade</span>, and <span className="text-white font-medium">create</span>.
                </p>

                {/* Call to Action Cluster - Yin Yang Style */}
                <div className="flex flex-col sm:flex-row items-center gap-6 animate-fade-in opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
                    
                    {/* Primary (Yang) - White Solid */}
                    <button 
                        onClick={() => onNavigate('all-projects')}
                        className="w-full sm:w-auto min-w-[180px] h-[56px] bg-white text-black hover:bg-zinc-200 transition-colors flex items-center justify-center gap-3 font-bold tracking-tight text-sm uppercase group"
                    >
                        Enter Portfolio
                        <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>

                    {/* Secondary (Yin) - Black Hollow */}
                    <button 
                        onClick={onStartVoice}
                        className="w-full sm:w-auto min-w-[180px] h-[56px] border border-white/20 hover:border-white text-white bg-transparent hover:bg-white/5 transition-all flex items-center justify-center gap-3 font-medium tracking-tight text-sm uppercase group"
                    >
                        <span className="material-symbols-outlined text-lg group-hover:text-emerald-400 transition-colors">mic</span>
                        Talk to Agent
                    </button>

                </div>
            </div>

            {/* Right Visualizer Space */}
            <div className="lg:col-span-5 hidden lg:block h-full relative pointer-events-none">
                 {/* 3D Visualizer is in background, this is just spacer for layout */}
            </div>
        </div>

    </section>
  );
};

export default Home;
