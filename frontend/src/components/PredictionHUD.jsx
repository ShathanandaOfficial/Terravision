import React, { useState, useEffect } from 'react';
import { Sprout, TrendingUp, DollarSign, Calendar, Layers, CheckCircle2, AlertTriangle, Scale } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PredictionHUD({ prediction, onAreaChange, currentArea }) {
  const [farmArea, setFarmArea] = useState(currentArea || 2.5);

  useEffect(() => {
    if (prediction && prediction.success) {
      // Trigger subtle futuristic celebration confetti
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.75 },
          colors: ['#3b82f6', '#ef4444', '#60a5fa']
        });
      } catch (e) {}
    }
  }, [prediction]);

  if (!prediction || !prediction.success) {
    return (
      <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center p-8 rounded-xl border border-blue-900/30 glass-panel text-center">
        <div className="w-16 h-16 rounded-full bg-blue-950/50 border border-blue-500/30 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
          <Sprout className="w-8 h-8 text-blue-400 animate-bounce" />
        </div>
        <h3 className="text-lg font-bold text-white font-['Orbitron'] uppercase tracking-wider mb-2">
          Target Land Sector Unselected
        </h3>
        <p className="text-sm text-slate-400 max-w-md font-mono">
          Click anywhere within Dakshina Kannada on the map or search a farm location to initiate dual-branch hybrid inference (Satellite Imagery + Environmental Data).
        </p>
      </div>
    );
  }

  const {
    recommended_crop,
    top_recommendations,
    model_breakdown,
    yield_forecast,
    location_summary
  } = prediction;

  const primary = top_recommendations[0];

  // Recalculate based on farmArea slider
  const totalQuintals = (primary.yield_quintals_per_acre * farmArea).toFixed(1);
  const totalTonnes = (totalQuintals / 10).toFixed(2);
  const estimatedRevenue = (totalQuintals * primary.market_price_per_quintal_inr).toLocaleString('en-IN', {
    maximumFractionDigits: 0
  });

  const handleSliderChange = (e) => {
    const val = parseFloat(e.target.value);
    setFarmArea(val);
    if (onAreaChange) onAreaChange(val);
  };

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Primary Recommended Crop Showcase Card */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-black via-blue-950/40 to-black border-2 border-blue-500/50 p-5 lg:p-6 shadow-[0_0_30px_rgba(59,130,246,0.3)] glass-panel">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-blue-900/40">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-blue-950 border border-blue-400 text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-blue-400" />
                Optimal Crop Suitability
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Sector: <strong className="text-white">{location_summary.taluk}</strong>
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 mt-1">
              <h2 className="text-2xl lg:text-3xl font-black text-white tracking-wider font-['Orbitron'] uppercase">
                {recommended_crop}
              </h2>
              <span className="text-[10px] px-2.5 py-0.5 rounded bg-red-950/80 border border-red-500/60 text-red-300 font-mono font-bold">
                RANK #1
              </span>
            </div>
          </div>

          {/* Large Confidence Metric Gauge */}
          <div className="flex items-center gap-3 bg-black/80 px-3.5 py-2 rounded-xl border border-blue-500/40 shadow-inner shrink-0">
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Meta-Fusion
              </span>
              <span className="text-xl lg:text-2xl font-black text-blue-400 font-mono tracking-tight">
                {primary.confidence_pct}
              </span>
            </div>
            <div className="w-11 h-11 rounded-full border-4 border-blue-500/30 border-t-blue-400 flex items-center justify-center font-bold text-xs text-white font-mono shadow-[0_0_10px_rgba(59,130,246,0.6)]">
              {Math.round(primary.confidence * 100)}%
            </div>
          </div>
        </div>

        {/* Dynamic Crop Yield Forecast & Revenue Section (2x2 Grid) */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Yield Per Acre */}
          <div className="p-3.5 rounded-lg bg-black/70 border border-blue-900/50 flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-blue-950/70 border border-blue-500/40 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block truncate">Per-Acre Yield</span>
              <p className="text-base lg:text-lg font-bold text-white font-mono leading-tight mt-0.5 whitespace-nowrap">
                {primary.yield_quintals_per_acre} <span className="text-xs text-blue-300 font-normal">Q/acre</span>
              </p>
              <span className="text-[10px] text-slate-500 font-mono block truncate mt-0.5">({primary.yield_t_per_ha} T/ha)</span>
            </div>
          </div>

          {/* Total Farm Yield */}
          <div className="p-3.5 rounded-lg bg-black/70 border border-blue-900/50 flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-blue-950/70 border border-blue-500/40 flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5 text-blue-400" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block truncate">Harvest ({farmArea} Acres)</span>
              <p className="text-base lg:text-lg font-bold text-white font-mono leading-tight mt-0.5 whitespace-nowrap">
                {totalQuintals} <span className="text-xs text-blue-300 font-normal">Quintals</span>
              </p>
              <span className="text-[10px] text-slate-500 font-mono block truncate mt-0.5">({totalTonnes} Tonnes)</span>
            </div>
          </div>

          {/* Revenue Forecast */}
          <div className="p-3.5 rounded-lg bg-black/70 border border-red-900/40 flex items-center gap-3 shadow-[0_0_12px_rgba(239,68,68,0.15)] overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-red-950/70 border border-red-500/40 flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5 text-red-400" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block truncate">Gross Revenue (Est.)</span>
              <p className="text-base lg:text-lg font-bold text-red-400 font-mono leading-tight mt-0.5 truncate whitespace-nowrap">
                ₹{estimatedRevenue}
              </p>
              <span className="text-[10px] text-slate-500 font-mono block truncate mt-0.5">@ ₹{primary.market_price_per_quintal_inr.toLocaleString()}/Q</span>
            </div>
          </div>

          {/* Harvest Season */}
          <div className="p-3.5 rounded-lg bg-black/70 border border-blue-900/50 flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-blue-950/70 border border-blue-500/40 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block truncate">Harvest Period</span>
              <p className="text-xs lg:text-sm font-bold text-white font-mono leading-tight mt-0.5" title={primary.harvest_season}>
                {primary.harvest_season ? primary.harvest_season.replace(/\s*\(.*?\)\s*/g, '') : 'Year-round'}
              </p>
              <span className="text-[10px] text-slate-400 font-mono block truncate mt-0.5">Cycle: {primary.growth_duration_days} Days</span>
            </div>
          </div>
        </div>

        {/* Farm Size Interactive Slider */}
        <div className="mt-4 pt-3 border-t border-blue-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-semibold uppercase">Adjust Farm Size:</span>
            <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-500/40 text-blue-300 font-bold">
              {farmArea} Acres
            </span>
          </div>
          <div className="w-full sm:w-64">
            <input
              type="range"
              min="0.5"
              max="25"
              step="0.5"
              value={farmArea}
              onChange={handleSliderChange}
              className="w-full h-1.5 bg-blue-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Multi-Modal Fusion Synergy Breakdown */}
      <div className="p-5 rounded-xl border border-blue-900/40 bg-black/80 glass-panel">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Hybrid Multi-Modal Fusion Synergy
            </h3>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-950 border border-blue-500/30 text-blue-300">
            Phase 1 + Phase 2 → Phase 3
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Phase 1 Branch */}
          <div className="p-3 rounded-lg bg-black/90 border border-blue-900/50">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
              <span>Phase 1 (Tabular XGBoost)</span>
              <span className="text-blue-400 font-bold">89.08% Acc</span>
            </div>
            <div className="space-y-1 text-xs font-mono">
              {model_breakdown.phase1_tabular_top.slice(0, 2).map((item, i) => (
                <div key={i} className="flex items-center justify-between text-slate-200">
                  <span>{item.crop}</span>
                  <span className="text-blue-300 font-semibold">{item.pct}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Phase 2 Branch */}
          <div className="p-3 rounded-lg bg-black/90 border border-blue-900/50">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
              <span>Phase 2 (Satellite Spectral)</span>
              <span className="text-blue-400 font-bold">45.89% Acc</span>
            </div>
            <div className="space-y-1 text-xs font-mono">
              {model_breakdown.phase2_satellite_top.slice(0, 2).map((item, i) => (
                <div key={i} className="flex items-center justify-between text-slate-200">
                  <span>{item.crop}</span>
                  <span className="text-blue-300 font-semibold">{item.pct}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Phase 3 Meta-Learner */}
          <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-500/50 shadow-[0_0_12px_rgba(59,130,246,0.2)]">
            <div className="flex items-center justify-between text-xs font-mono text-blue-300 mb-1.5">
              <span className="font-bold">Phase 3 (Meta-Fusion)</span>
              <span className="text-white font-bold">88.29% Acc</span>
            </div>
            <div className="space-y-1 text-xs font-mono">
              {model_breakdown.phase3_fusion_top.slice(0, 2).map((item, i) => (
                <div key={i} className="flex items-center justify-between text-white font-bold">
                  <span>{item.crop}</span>
                  <span className="text-blue-400">{item.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alternative Ranked Recommendations */}
      <div className="p-5 rounded-xl border border-blue-900/40 bg-black/80 glass-panel">
        <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider mb-3">
          Alternative Crop Recommendations & Probabilities
        </h3>
        <div className="space-y-2.5">
          {top_recommendations.map((rec) => (
            <div key={rec.rank} className="p-3 rounded-lg bg-black/60 border border-blue-950/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded bg-blue-950 border border-blue-500/40 text-blue-300 font-mono text-xs flex items-center justify-center font-bold">
                  #{rec.rank}
                </span>
                <div>
                  <span className="text-sm font-bold text-white font-mono">{rec.crop}</span>
                  <span className="text-xs text-slate-400 font-mono ml-2">
                    Yield: {rec.yield_quintals_per_acre} Q/acre
                  </span>
                </div>
              </div>

              <div className="w-full sm:w-48 flex items-center gap-2">
                <div className="flex-1 h-2 bg-blue-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, rec.confidence * 100)}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-bold text-blue-400 w-12 text-right">
                  {rec.confidence_pct}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
