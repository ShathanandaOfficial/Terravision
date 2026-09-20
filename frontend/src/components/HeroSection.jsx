import React from 'react';
import { ArrowRight, Compass, Satellite, ShieldCheck, Activity, Layers, Radio } from 'lucide-react';

export default function HeroSection({ onStartAnalyze, onExploreSystem }) {
  return (
    <section className="relative w-full pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden">
      {/* Subtle background ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-blue-500/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[250px] h-[250px] bg-red-600/4 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Column: Typography & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            {/* Announcement Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-xs font-mono text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.2)] mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              <span className="font-semibold text-white">v2.0 LIVE</span>
              <span className="text-slate-500">|</span>
              <span>Sentinel-2 Spectral + Numerical Fusion</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08] font-['Space_Grotesk'] mb-6">
              HYBRID <span className="text-blue-500 glow-text-blue">INTELLIGENCE</span><br />
              FOR <span className="text-blue-400">SMART AGRICULTURE</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 font-normal max-w-xl mb-8 leading-relaxed">
              Satellite imagery + numerical intelligence + AI-powered field analysis.
              Precision multi-modal crop yield forecasting tailored for Dakshina Kannada.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-12">
              <button
                onClick={onStartAnalyze}
                className="btn-blue-primary text-sm font-semibold tracking-wide cursor-pointer"
              >
                <span>ANALYZE YOUR LAND</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreSystem}
                className="btn-glass-secondary text-sm font-medium cursor-pointer"
              >
                <Compass className="w-4 h-4 text-blue-400" />
                <span>EXPLORE SYSTEM</span>
              </button>
            </div>

            {/* Minimalist Trust & Specs Strip */}
            <div className="pt-8 border-t border-blue-950/60 w-full grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold font-['Space_Grotesk'] text-white flex items-center gap-1">
                  88.29<span className="text-blue-500 text-lg">%</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-0.5">
                  Fusion Accuracy
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold font-['Space_Grotesk'] text-white flex items-center gap-1">
                  7<span className="text-blue-500 text-lg">TALUKS</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-0.5">
                  Geofenced Range
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold font-['Space_Grotesk'] text-white flex items-center gap-1">
                  10<span className="text-blue-500 text-lg">M</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-0.5">
                  Spectral Grid
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Column: 3D Luminous Blue Geospatial Visual */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Luminous Center Aura */}
            <div className="w-full max-w-[460px] aspect-square relative flex items-center justify-center">
              
              {/* Outer Orbital Tech Rings */}
              <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-[spin_60s_linear_infinite]" />
              <div className="absolute inset-6 rounded-full border border-dashed border-blue-400/25 animate-[spin_40s_linear_infinite_reverse]" />
              <div className="absolute inset-16 rounded-full border border-blue-500/15" />

              {/* Fluid 3D Glowing Ribbon Geometry (Inspired by Equinox & Min Engelhardt reference) */}
              <div className="relative w-72 h-72 rounded-3xl bg-gradient-to-tr from-blue-950/80 via-blue-900/30 to-black/90 p-[1px] shadow-[0_0_50px_rgba(37,99,235,0.35)] backdrop-blur-2xl border border-blue-500/40 rotate-12 hover:rotate-6 transition-all duration-700">
                <div className="w-full h-full rounded-3xl bg-[#030816]/90 p-6 flex flex-col justify-between overflow-hidden relative">
                  
                  {/* Subtle Tech Grid inside card */}
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
                  
                  {/* Glowing Laser Scanline */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scan-sweep opacity-75 shadow-[0_0_15px_#3b82f6]" />

                  {/* Top card telemetry */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                      <span className="text-[10px] font-mono tracking-widest text-slate-300 uppercase">SAT-SCAN // SENTINEL-2</span>
                    </div>
                    <span className="text-[10px] font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-500/30">
                      LIVE
                    </span>
                  </div>

                  {/* Center Floating Holographic Graphic */}
                  <div className="relative z-10 my-auto flex flex-col items-center justify-center">
                    <div className="relative flex items-center justify-center">
                      <div className="w-24 h-24 rounded-2xl bg-blue-950/50 border border-blue-500/50 flex items-center justify-center shadow-[0_0_35px_rgba(59,130,246,0.4)]">
                        <Satellite className="w-12 h-12 text-blue-400 animate-pulse" />
                      </div>
                      
                      {/* Red Target Reticle */}
                      <div className="absolute -bottom-2 -right-2 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full border border-red-500/80 animate-ping absolute" />
                        <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-[0_0_12px_#ef4444]" />
                      </div>
                    </div>
                    
                    <div className="mt-4 text-center">
                      <div className="text-xs font-mono font-bold text-white tracking-wider">
                        DAKSHINA KANNADA SECTOR
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        12.87° N, 75.15° E • 2.5 ACRES
                      </div>
                    </div>
                  </div>

                  {/* Bottom Technical Matrix */}
                  <div className="relative z-10 pt-3 border-t border-blue-950/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="flex items-center gap-1 text-blue-300">
                      <Radio className="w-3 h-3 text-blue-400 animate-pulse" />
                      BAND B8/B4
                    </span>
                    <span className="text-slate-300">NDVI: 0.68</span>
                  </div>
                </div>
              </div>

              {/* Floating Accompanying Glass Pill Badges */}
              <div className="absolute -top-4 -left-4 glass-card px-3.5 py-2 flex items-center gap-2 border border-blue-500/30 shadow-[0_10px_25px_rgba(0,0,0,0.8)] animate-bounce duration-1000">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-mono text-slate-200">GEOFENCE LOCKED</span>
              </div>

              <div className="absolute -bottom-4 -right-4 glass-card px-3.5 py-2 flex items-center gap-2 border border-blue-500/30 shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
                <Activity className="w-4 h-4 text-red-400 animate-pulse" />
                <span className="text-xs font-mono text-slate-200">YIELD: +4.8 T/HA</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
