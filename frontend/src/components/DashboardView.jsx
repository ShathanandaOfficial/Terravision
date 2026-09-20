import React from 'react';
import HeroSection from './HeroSection';
import { 
  Satellite, 
  MapPin, 
  ShieldCheck, 
  Activity, 
  ArrowRight, 
  Layers, 
  Compass, 
  TrendingUp, 
  ChevronRight,
  Database
} from 'lucide-react';

export default function DashboardView({ onStartAnalyze, onExploreSystem, onSelectTaluk, taluks }) {
  const defaultTaluks = [
    { name: 'Puttur', zone: 'Agricultural Valley', lat: 12.7667, lon: 75.2000, crops: 'Arecanut, Rubber, Paddy' },
    { name: 'Mangaluru', zone: 'Coastal Alluvium', lat: 12.9141, lon: 74.8560, crops: 'Paddy, Coconut, Vegetables' },
    { name: 'Belthangady', zone: 'Western Ghats Foothills', lat: 13.0000, lon: 75.2600, crops: 'Arecanut, Spices, Cocoa' },
    { name: 'Bantwal', zone: 'Netravati River Basin', lat: 12.8900, lon: 75.0300, crops: 'Paddy, Banana, Arecanut' },
    { name: 'Sullia', zone: 'Rainforest Agro Belt', lat: 12.5600, lon: 75.3900, crops: 'Rubber, Cashew, Pepper' },
    { name: 'Moodbidri', zone: 'Midland Laterite Plateau', lat: 13.0700, lon: 74.9900, crops: 'Paddy, Coconut, Pulses' },
    { name: 'Kadaba', zone: 'Southern Plantations', lat: 12.7400, lon: 75.4300, crops: 'Rubber, Arecanut, Spices' }
  ];

  return (
    <div className="w-full flex flex-col gap-12 pb-16">
      {/* Hero Section */}
      <HeroSection
        onStartAnalyze={onStartAnalyze}
        onExploreSystem={onExploreSystem}
      />

      {/* Featured Dakshina Kannada Agro-Climatic Hubs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              <span>DAKSHINA KANNADA COVERAGE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
              7 Geofenced Agricultural Sectors
            </h2>
          </div>

          <button
            onClick={onStartAnalyze}
            className="text-xs font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1.5 cursor-pointer"
          >
            <span>LAUNCH FULL MAP EXPLORER</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 7 Taluks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {defaultTaluks.map((t) => (
            <div
              key={t.name}
              onClick={() => onSelectTaluk(t)}
              className="glass-card bg-black/80 border border-blue-500/20 p-5 hover:border-blue-400 hover:shadow-[0_0_25px_rgba(59,130,246,0.25)] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-950/80 border border-blue-500/40 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 group-hover:text-white" />
                  </div>
                  <span className="text-base font-bold font-['Space_Grotesk'] text-white">
                    {t.name}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-500/30">
                  READY
                </span>
              </div>

              <div className="text-xs text-slate-400 font-mono mb-2">
                {t.zone}
              </div>

              <div className="text-[11px] text-slate-300 border-t border-blue-950/60 pt-2 flex items-center justify-between">
                <span>Key Crops:</span>
                <span className="font-semibold text-blue-300">{t.crops.split(',')[0]}</span>
              </div>
            </div>
          ))}

          {/* Quick CTA Card */}
          <div
            onClick={onStartAnalyze}
            className="glass-card bg-blue-950/30 border-2 border-dashed border-blue-500/40 p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-400 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_0_15px_#3b82f6] mb-3 group-hover:scale-110 transition-transform">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm font-bold text-white font-['Space_Grotesk']">
              Custom Parcel Coordinates
            </div>
            <div className="text-[11px] font-mono text-blue-300 mt-1">
              Select or draw any boundary
            </div>
          </div>
        </div>
      </section>

      {/* Satellite Intelligence Architecture Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="glass-card bg-black/90 border border-blue-500/30 p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-2">
                <Satellite className="w-4 h-4 text-blue-400" />
                <span>SENTINEL-2 MULTI-SPECTRAL TELEMETRY</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight mb-4">
                10-Meter Multi-Spectral Fusion Engine
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mb-6">
                Unlike standard agricultural models that rely solely on historic weather records, TerraVision AI merges European Space Agency Sentinel-2 Level-2A surface reflectances (B2, B3, B4, B8, B11, B12) with high-density localized soil and meteorological telemetry to forecast precise yield tonnages.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span>NDVI & NDRE Vegetation Indices</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span>Real-Time Open-Meteo Ingestion</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <span>Dakshina Kannada Geofenced</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <button
                onClick={onStartAnalyze}
                className="btn-blue-primary text-sm font-semibold tracking-wide cursor-pointer w-full py-4 text-center"
              >
                <span>SCAN YOUR FIELD NOW</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
