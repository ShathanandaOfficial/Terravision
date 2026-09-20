import React from 'react';
import { Satellite, ShieldCheck, Activity, BarChart3, MapPin } from 'lucide-react';

export default function Header({ onOpenMetrics, activeTaluk }) {
  return (
    <header className="w-full bg-black/90 border-b border-blue-900/40 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-8 py-3.5 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-lg bg-gradient-to-br from-blue-900 via-blue-950 to-black border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <Satellite className="w-6 h-6 text-blue-400 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold tracking-wider text-white font-['Orbitron'] uppercase flex items-center gap-1.5">
                Terra<span className="text-blue-500">Vision</span>
              </h1>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-950/80 border border-blue-500/30 text-blue-300 font-mono">
                v2.0 FUSION
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <span className="text-red-400 font-medium">Dakshina Kannada District</span>
              <span className="text-slate-600">•</span>
              <span>Hybrid Crop Yield & Satellite AI</span>
            </p>
          </div>
        </div>

        {/* HUD Telemetry Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-950/40 border border-blue-500/30 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.15)]">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>GEOFENCE:</span>
            <span className="text-white font-semibold">DK EXCLUSIVE (7 TALUKS)</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-black/60 border border-slate-800 text-slate-300">
            <Activity className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span>MODEL:</span>
            <span className="text-red-400 font-bold">ExtraTrees 88.29%</span>
          </div>

          {activeTaluk && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-900/30 border border-blue-400/50 text-white font-semibold animate-pulse">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>SECTOR: {activeTaluk.toUpperCase()}</span>
            </div>
          )}

          <button
            onClick={onOpenMetrics}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800 text-white font-medium border border-blue-400/50 transition-all shadow-[0_0_12px_rgba(59,130,246,0.4)] cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5 text-blue-200" />
            <span>Research Hub</span>
          </button>
        </div>
      </div>
    </header>
  );
}
