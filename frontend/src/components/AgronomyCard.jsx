import React from 'react';
import { BookOpen, ShieldAlert, Droplet, Sparkles, CircleDollarSign } from 'lucide-react';

export default function AgronomyCard({ advice, cropName }) {
  if (!advice) return null;

  const {
    recommended_fertilizer,
    npk_ratio,
    irrigation_schedule,
    soil_management,
    pest_management,
    economic_outlook
  } = advice;

  return (
    <div className="p-5 rounded-xl border border-blue-900/40 bg-black/80 glass-panel flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-blue-950/60">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
            Agronomic Field Guide: {cropName}
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 border border-blue-500/40 text-blue-300">
          NPK Ratio: {npk_ratio}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        {/* Fertilizer Plan */}
        <div className="p-3.5 rounded-lg bg-black/70 border border-blue-900/40 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-blue-400 font-bold uppercase">
            <Sparkles className="w-4 h-4" />
            <span>Fertilizer & Nutrition Schedule</span>
          </div>
          <p className="text-slate-300 leading-relaxed">{recommended_fertilizer}</p>
        </div>

        {/* Irrigation Plan */}
        <div className="p-3.5 rounded-lg bg-black/70 border border-blue-900/40 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-blue-400 font-bold uppercase">
            <Droplet className="w-4 h-4" />
            <span>Irrigation & Water Regimen</span>
          </div>
          <p className="text-slate-300 leading-relaxed">{irrigation_schedule}</p>
        </div>

        {/* Soil Health & Mulch */}
        <div className="p-3.5 rounded-lg bg-black/70 border border-blue-900/40 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-blue-400 font-bold uppercase">
            <BookOpen className="w-4 h-4" />
            <span>Soil Management</span>
          </div>
          <p className="text-slate-300 leading-relaxed">{soil_management}</p>
        </div>

        {/* Pest Management */}
        <div className="p-3.5 rounded-lg bg-black/70 border border-red-900/40 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-red-400 font-bold uppercase">
            <ShieldAlert className="w-4 h-4" />
            <span>Disease & Pest Protection</span>
          </div>
          <p className="text-slate-300 leading-relaxed">{pest_management}</p>
        </div>
      </div>

      {/* Economic Outlook */}
      <div className="p-3.5 rounded-lg bg-blue-950/30 border border-blue-500/40 flex items-start gap-3">
        <CircleDollarSign className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs font-mono">
          <span className="text-blue-300 font-bold uppercase block mb-0.5">Market Realization & APMC Outlook</span>
          <p className="text-slate-200 leading-relaxed">{economic_outlook}</p>
        </div>
      </div>
    </div>
  );
}
