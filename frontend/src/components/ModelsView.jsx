import React, { useState, useEffect } from 'react';
import { Cpu, ShieldCheck, Activity, Layers, Database, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ModelsView({ onOpenMetricsModal }) {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    fetch('/api/metrics')
      .then((res) => res.json())
      .then((data) => setMetrics(data))
      .catch((err) => console.error("Error loading metrics:", err));
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
      {/* Header */}
      <div className="border-b border-blue-950/70 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-1">
          <Cpu className="w-4 h-4 text-blue-400" />
          <span>PHASE 3 ARCHITECTURE</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
          Hybrid Multi-Modal Meta-Fusion Model
        </h2>
        <p className="text-slate-300 text-sm font-mono mt-2 max-w-2xl">
          Dual-stream deep ensemble integrating Sentinel-2 Level-2A multi-spectral satellite imagery and high-density atmospheric telemetry via ExtraTrees meta-learning.
        </p>
      </div>

      {/* Accuracy Showcase Banner */}
      <div className="glass-card bg-blue-950/30 border-2 border-blue-400 p-8 relative overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.25)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div>
            <div className="text-5xl font-black text-white font-['Space_Grotesk'] glow-text-blue">
              88.29%
            </div>
            <div className="text-xs font-mono text-blue-300 uppercase tracking-wider mt-1">
              Meta-Fusion Accuracy
            </div>
          </div>

          <div>
            <div className="text-3xl font-bold text-white font-['Space_Grotesk']">
              +5.7%
            </div>
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mt-1">
              Gain Over Single-Modal
            </div>
          </div>

          <div>
            <div className="text-3xl font-bold text-white font-['Space_Grotesk']">
              0.881
            </div>
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mt-1">
              Weighted F1-Score
            </div>
          </div>

          <div>
            <button
              onClick={onOpenMetricsModal}
              className="btn-blue-primary text-xs font-bold w-full py-3 cursor-pointer"
            >
              <span>EXPLORE TRAINING HUB</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Dual Stream Architecture Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Stream 1: Numerical */}
        <div className="glass-card bg-black/80 border border-blue-500/25 p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-slate-400 uppercase font-bold">STREAM A</span>
              <span className="text-[10px] font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-500/25">
                TABULAR
              </span>
            </div>
            <h3 className="text-xl font-bold text-white font-['Space_Grotesk'] mb-2">
              Atmospheric & Edaphic Pipeline
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans mb-4">
              Ingests 11 continuous features including precipitation curves, min/max temperatures, relative humidity, soil pH, and N-P-K nutrient profiles across Dakshina Kannada.
            </p>
          </div>

          <div className="space-y-2 border-t border-blue-950/80 pt-4 text-xs font-mono text-slate-400">
            <div className="flex justify-between">
              <span>Primary Classifier:</span>
              <span className="text-white">CatBoost + XGBoost</span>
            </div>
            <div className="flex justify-between">
              <span>Single Stream Acc:</span>
              <span className="text-blue-400">82.6%</span>
            </div>
          </div>
        </div>

        {/* Stream 2: Satellite */}
        <div className="glass-card bg-black/80 border border-blue-500/25 p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-slate-400 uppercase font-bold">STREAM B</span>
              <span className="text-[10px] font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-500/25">
                SPECTRAL
              </span>
            </div>
            <h3 className="text-xl font-bold text-white font-['Space_Grotesk'] mb-2">
              Sentinel-2 Multi-Spectral
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans mb-4">
              Extracts 10-meter Level-2A surface reflectances in Blue, Green, Red, and NIR bands to calculate normalized vegetative indices (NDVI, NDRE, EVI).
            </p>
          </div>

          <div className="space-y-2 border-t border-blue-950/80 pt-4 text-xs font-mono text-slate-400">
            <div className="flex justify-between">
              <span>Spectral Backing:</span>
              <span className="text-white">Sentinel-2B BOA</span>
            </div>
            <div className="flex justify-between">
              <span>Single Stream Acc:</span>
              <span className="text-blue-400">79.8%</span>
            </div>
          </div>
        </div>

        {/* Fusion Layer */}
        <div className="glass-card bg-blue-950/30 border-2 border-blue-400 p-7 flex flex-col justify-between shadow-[0_0_25px_rgba(59,130,246,0.2)]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-blue-400 uppercase font-bold">SYNTHESIS</span>
              <span className="text-[10px] font-mono text-white bg-blue-600 px-2 py-0.5 rounded font-bold">
                META-LEARNER
              </span>
            </div>
            <h3 className="text-xl font-bold text-white font-['Space_Grotesk'] mb-2 glow-text-blue">
              ExtraTrees Fusion v2.0
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans mb-4">
              Stochastic decision forest concatenates probability distributions from Stream A and Stream B, weighting cross-modal interactions to resolve edge cases.
            </p>
          </div>

          <div className="space-y-2 border-t border-blue-500/30 pt-4 text-xs font-mono text-slate-300">
            <div className="flex justify-between">
              <span>Final Accuracy:</span>
              <span className="text-white font-bold">88.29%</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-blue-400 font-bold">SERVING LIVE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
