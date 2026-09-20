import React from 'react';
import { Satellite, ShieldCheck, Compass, Globe, CheckCircle2 } from 'lucide-react';

export default function AboutView({ onStartAnalyze }) {
  return (
    <div className="w-full max-w-5xl mx-auto py-24 px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-xs font-mono text-blue-300 mb-4">
          <Satellite className="w-3.5 h-3.5 text-blue-400" />
          <span>TERRAVISION AI PLATFORM MISSION</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight mb-4">
          NASA-Grade Satellite Intelligence for Precision Agriculture
        </h2>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-sans">
          TerraVision AI pioneers multi-modal geospatial intelligence by coupling high-cadence Sentinel-2 satellite observation with machine learning models specialized for the complex microclimates of Dakshina Kannada, Karnataka.
        </p>
      </div>

      {/* Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card bg-black/80 border border-blue-500/25 p-7">
          <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-500/40 flex items-center justify-center mb-4">
            <Globe className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] mb-2">
            10-Meter Earth Observation
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Level-2A Bottom-Of-Atmosphere spectral bands provide high-fidelity canopy reflectance data, bypassing cloud contamination and revealing photosynthetic health.
          </p>
        </div>

        <div className="glass-card bg-black/80 border border-blue-500/25 p-7">
          <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-500/40 flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] mb-2">
            Regional Geofencing
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Engineered exclusively for Dakshina Kannada’s 7 taluks—accounting for heavy south-west monsoon precipitation, lateritic soils, and plantation canopies.
          </p>
        </div>

        <div className="glass-card bg-black/80 border border-blue-500/25 p-7">
          <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-500/40 flex items-center justify-center mb-4">
            <Compass className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] mb-2">
            Actionable Agronomy
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Transforms raw spectral data and hybrid predictions into field-level guidance for planting, drainage, fertilizer timing, and harvest yield expectations.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="glass-card bg-gradient-to-r from-blue-950/40 via-blue-900/20 to-black/90 border border-blue-500/40 p-8 sm:p-10 text-center flex flex-col items-center">
        <h3 className="text-2xl font-bold text-white font-['Space_Grotesk'] mb-3">
          Ready to scan your farm parcel?
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-lg mb-6">
          Access the interactive Mapbox geospatial command center to pinpoint your acreage and generate real-time AI crop forecasts.
        </p>
        <button
          onClick={onStartAnalyze}
          className="btn-blue-primary text-xs font-bold tracking-wider py-3.5 px-8 cursor-pointer"
        >
          ANALYZE FIELD NOW
        </button>
      </div>
    </div>
  );
}
