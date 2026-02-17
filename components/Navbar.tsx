
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { CategoryId } from '../types';

interface NavbarProps {
  onNavigate: (target: 'home' | CategoryId) => void;
  onToggleVault: () => void;
  activeCategory?: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, onToggleVault, activeCategory }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleNav = (target: 'home' | CategoryId) => {
    setIsMobileOpen(false);
    onNavigate(target);
  };

  const NavItem = ({ id, label }: { id: CategoryId, label: string }) => (
    <button 
        onClick={() => handleNav(id)}
        className={`text-xs font-medium uppercase tracking-[0.15em] transition-all duration-300 relative group ${
            activeCategory === id ? 'text-white' : 'text-zinc-500 hover:text-white'
        }`}
    >
        {label}
        {/* Hover underline animation */}
        <span className={`absolute -bottom-2 left-0 w-full h-[1px] bg-white transform origin-left transition-transform duration-300 ${activeCategory === id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'}`}></span>
    </button>
  );

  return (
    <>
        <nav className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 h-24">
            <div className="max-w-[1600px] mx-auto px-8 h-full flex items-center justify-between">
                
                {/* Brand / Logo */}
                <div className="w-[200px]">
                    <button onClick={() => handleNav('home')} className="group flex items-center gap-5 focus:outline-none">
                        {/* New Monogram Logo */}
                        <div className="w-12 h-12 border border-white/10 bg-black flex items-center justify-center relative overflow-hidden transition-all duration-500 group-hover:border-white/40 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                            {/* Inner Accent Line */}
                            <div className="absolute top-0 left-0 w-[2px] h-full bg-white transform -translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out"></div>
                            <span className="font-display font-bold text-white text-xl tracking-tighter transform group-hover:scale-110 transition-transform duration-500">J.</span>
                        </div>
                        
                        <div className="flex flex-col items-start gap-0.5">
                            <span className="text-sm font-display font-bold tracking-[0.25em] text-white group-hover:tracking-[0.3em] transition-all duration-500">JESSE</span>
                            <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest group-hover:text-zinc-400 transition-colors">Systems Architect</span>
                        </div>
                    </button>
                </div>

                {/* Center: Primary Navigation */}
                <div className="hidden md:flex items-center gap-16">
                    <NavItem id="finance" label="Finance" />
                    <NavItem id="development" label="Dev" />
                    <NavItem id="media" label="Media" />
                </div>

                {/* Right: Utility Cluster (Icon Only) */}
                <div className="hidden md:flex items-center justify-end gap-2 w-[200px]">
                    {/* Divider */}
                    <div className="w-[1px] h-8 bg-zinc-800 mx-4"></div>

                    <button 
                        onClick={onToggleVault} 
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-zinc-500 hover:text-emerald-400 transition-all group relative"
                        title="Secure Vault"
                    >
                        <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">lock</span>
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    </button>
                    
                    <button 
                        onClick={() => handleNav('library')} 
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-zinc-500 hover:text-blue-400 transition-all group relative"
                        title="Nexus Library"
                    >
                        <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">grid_view</span>
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    </button>
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-white p-2" onClick={() => setIsMobileOpen(true)}>
                    <span className="material-symbols-outlined">menu_open</span>
                </button>
            </div>
        </nav>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 transition-opacity duration-300 ${isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <button className="absolute top-8 right-8 text-zinc-400 hover:text-white" onClick={() => setIsMobileOpen(false)}>
                <span className="material-symbols-outlined text-4xl">close</span>
            </button>
            <button onClick={() => handleNav('home')} className="text-4xl font-display font-light text-white tracking-tight">Home</button>
            <button onClick={() => handleNav('finance')} className="text-4xl font-display font-light text-white tracking-tight">Finance</button>
            <button onClick={() => handleNav('development')} className="text-4xl font-display font-light text-white tracking-tight">Development</button>
            <button onClick={() => handleNav('media')} className="text-4xl font-display font-light text-white tracking-tight">Media</button>
            
            <div className="w-20 h-[1px] bg-white/10 my-4"></div>

            <button onClick={() => { setIsMobileOpen(false); onToggleVault(); }} className="text-lg font-mono text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined">lock</span> Vault Access
            </button>
            <button onClick={() => handleNav('library')} className="text-lg font-mono text-blue-500 uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined">grid_view</span> Nexus Library
            </button>
        </div>
    </>
  );
};

export default Navbar;
