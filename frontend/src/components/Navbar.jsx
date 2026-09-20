import React, { useState } from 'react';
import { Satellite, Shield, BarChart3, Menu, X, Cpu } from 'lucide-react';

export default function Navbar({ activeTab, onTabChange, onOpenMetrics, activeTaluk }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'analyze', label: 'Analyze' },
    { id: 'history', label: 'History' },
    { id: 'models', label: 'Models' },
    { id: 'about', label: 'About' }
  ];

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="glass-card bg-black/80 border border-blue-500/25 px-5 py-3 shadow-[0_10px_35px_rgba(0,0,0,0.85)] flex items-center justify-between transition-all backdrop-blur-xl">
        {/* Brand */}
        <button
          onClick={() => onTabChange('dashboard')}
          className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-blue-950/60 border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.35)] group-hover:border-blue-400 transition-all">
            <Satellite className="w-5 h-5 text-blue-400 group-hover:rotate-12 transition-transform" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          </div>
          <div>
            <div className="text-base font-extrabold tracking-widest text-white font-['Space_Grotesk'] uppercase flex items-center gap-1.5">
              TERRAVISION <span className="text-blue-500 glow-text-blue">AI</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 tracking-wider">
              GEOSPATIAL INTELLIGENCE
            </div>
          </div>
        </button>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`relative px-4 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'text-blue-400 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-blue-950/20'
                }`}
              >
                {item.label}
                {isActive && (
                  <div className="absolute bottom-0 left-3 right-3 h-[2px] bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Side Controls & Status */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Geofence Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/40 border border-blue-500/25 text-[11px] font-mono text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.15)]">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <span>DK SECTOR: {activeTaluk ? activeTaluk.toUpperCase() : 'ACTIVE'}</span>
          </div>

          {/* Model Hub / Metrics */}
          <button
            onClick={onOpenMetrics}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-blue-950/40 border border-blue-500/30 text-slate-200 text-xs font-mono transition-all hover:border-blue-400 cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.5)]"
          >
            <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
            <span>FUSION 88.29%</span>
          </button>
        </div>

        {/* Mobile menu hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-blue-950/40 border border-blue-500/20"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 glass-card bg-black/95 border border-blue-500/30 p-4 rounded-xl shadow-2xl flex flex-col gap-2 backdrop-blur-2xl">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === item.id
                  ? 'bg-blue-950/60 text-blue-400 font-semibold border-l-2 border-blue-500'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 mt-2 border-t border-blue-950/50 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenMetrics();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-blue-950/40 border border-blue-500/30 text-blue-300 text-xs font-mono"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Model Telemetry & Metrics</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
