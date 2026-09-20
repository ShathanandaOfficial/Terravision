import React, { useState, useEffect } from 'react';
import { Satellite, Radio, Cpu, Layers, CheckCircle2, AlertTriangle, Scan, Shield } from 'lucide-react';

const SCAN_STAGES = [
  { id: 'loc', label: 'LOCATION IDENTIFIED', subtext: 'Target geofence confirmed in Dakshina Kannada' },
  { id: 'num', label: 'NUMERICAL DATA', subtext: 'Atmospheric telemetry & soil matrix ingested' },
  { id: 'sat', label: 'SATELLITE IMAGERY', subtext: 'Sentinel-2 Level-2A BOA reflectances fetched' },
  { id: 'img', label: 'IMAGE ANALYSIS', subtext: 'Spectral NDVI, NDRE & EVI indices computed' },
  { id: 'fus', label: 'MODEL FUSION', subtext: 'Meta-Fusion ExtraTrees 88.29% weighting' },
  { id: 'crp', label: 'CROP FORECAST', subtext: 'Synthesizing yield tonnage & optimal harvest window' }
];

export default function AnalysisScanner({ locationInfo, onScanComplete }) {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    // Progress through stages smoothly
    const interval = setInterval(() => {
      setCurrentStageIdx((prev) => {
        if (prev < SCAN_STAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 600);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          setTimeout(() => {
            if (onScanComplete) onScanComplete();
          }, 400);
          return 100;
        }
        return prev + 6;
      });
    }, 180);

    return () => {
      clearInterval(interval);
      clearInterval(progressTimer);
    };
  }, [onScanComplete]);

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 flex flex-col items-center">
      {/* Central Holographic Scanner Visual */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 mb-8 flex items-center justify-center">
        
        {/* Orbital Scanning Rings */}
        <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-[spin_12s_linear_infinite]" />
        <div className="absolute inset-4 rounded-full border border-dashed border-blue-400/30 animate-[spin_20s_linear_infinite_reverse]" />
        <div className="absolute inset-10 rounded-full border border-blue-600/15" />
        
        {/* Rotating Radar Sweep Cone */}
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none opacity-40">
          <div className="w-full h-full bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(59,130,246,0.5)_360deg)] animate-[spin_3s_linear_infinite]" />
        </div>

        {/* Central Dark Glass Scanner Core */}
        <div className="relative z-10 w-48 h-48 rounded-2xl bg-black/85 border border-blue-500/40 p-5 backdrop-blur-2xl shadow-[0_0_50px_rgba(37,99,235,0.35)] flex flex-col items-center justify-between overflow-hidden">
          
          {/* Laser Scanning Beam */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scan-sweep shadow-[0_0_15px_#3b82f6]" />

          {/* Top header */}
          <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-blue-400">
              <Scan className="w-3 h-3 animate-pulse" />
              SCANNING
            </span>
            <span className="text-white font-bold">{progress}%</span>
          </div>

          {/* Center Graphic */}
          <div className="relative flex items-center justify-center my-auto">
            <div className="w-16 h-16 rounded-xl bg-blue-950/60 border border-blue-500/50 flex items-center justify-center shadow-[0_0_25px_rgba(59,130,246,0.4)]">
              <Satellite className="w-8 h-8 text-blue-400 animate-pulse" />
            </div>
            
            {/* Subtle red target scan point */}
            <div className="absolute -top-1 -right-1 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full border border-red-500/80 animate-ping absolute" />
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
            </div>
          </div>

          {/* Bottom Telemetry Tag */}
          <div className="text-center font-mono text-[10px] text-slate-300">
            {locationInfo?.place_name || 'DAKSHINA KANNADA SECTOR'}
          </div>
        </div>

      </div>

      {/* Progress Bar Container */}
      <div className="w-full max-w-xl mb-8">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
          <span className="flex items-center gap-1.5 text-blue-400">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            AI MULTI-MODAL SYNTHESIS IN PROGRESS
          </span>
          <span className="text-white font-bold">{progress}% COMPLETE</span>
        </div>

        <div className="w-full h-2 rounded-full bg-blue-950/40 border border-blue-500/30 overflow-hidden p-[1px]">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300 shadow-[0_0_15px_#3b82f6] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 6 Stage Sequential Status Cards */}
      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SCAN_STAGES.map((stage, idx) => {
          const isCompleted = idx < currentStageIdx;
          const isCurrent = idx === currentStageIdx;
          const isPending = idx > currentStageIdx;

          return (
            <div
              key={stage.id}
              className={`p-3.5 rounded-xl transition-all duration-300 backdrop-blur-xl border ${
                isCurrent
                  ? 'bg-blue-950/70 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.35)] scale-[1.02]'
                  : isCompleted
                  ? 'bg-black/80 border-blue-500/25 text-slate-300'
                  : 'bg-black/40 border-slate-900/60 opacity-40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="shrink-0">
                  {isCompleted ? (
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_0_10px_#3b82f6]">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-6 h-6 rounded-full bg-blue-500/30 border border-blue-400 flex items-center justify-center animate-pulse">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-slate-800 flex items-center justify-center text-[10px] font-mono text-slate-600">
                      0{idx + 1}
                    </div>
                  )}
                </div>

                <div>
                  <div className={`text-xs font-mono font-bold tracking-wider ${
                    isCurrent ? 'text-white glow-text-blue' : isCompleted ? 'text-blue-300' : 'text-slate-500'
                  }`}>
                    {stage.label}
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                    {stage.subtext}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
