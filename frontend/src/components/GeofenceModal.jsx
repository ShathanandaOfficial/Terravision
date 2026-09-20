import React from 'react';
import { AlertOctagon, X, Navigation, MapPin } from 'lucide-react';

export default function GeofenceModal({ errorData, onClose, onSelectTaluk }) {
  if (!errorData) return null;

  const taluks = [
    { name: 'Mangaluru', lat: 12.9141, lon: 74.8560 },
    { name: 'Bantwal', lat: 12.8903, lon: 75.0347 },
    { name: 'Puttur', lat: 12.7663, lon: 75.2033 },
    { name: 'Belthangady', lat: 12.9983, lon: 75.2588 },
    { name: 'Sullia', lat: 12.5606, lon: 75.3892 },
    { name: 'Moodbidri', lat: 13.0694, lon: 74.9961 },
    { name: 'Kadaba', lat: 12.7381, lon: 75.4522 }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-black border-2 border-red-500/70 p-6 shadow-[0_0_50px_rgba(239,68,68,0.4)] glass-panel-red flex flex-col gap-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-red-950/80 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-500/60 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.5)] shrink-0">
            <AlertOctagon className="w-7 h-7 text-red-400 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-mono text-red-400 uppercase tracking-widest block font-bold">
              Geofence Boundary Violation
            </span>
            <h3 className="text-xl font-bold text-white font-['Orbitron'] uppercase tracking-wider">
              Outside Dakshina Kannada
            </h3>
          </div>
        </div>

        {/* Error Detail Message */}
        <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-900/60 text-xs font-mono text-slate-200 leading-relaxed">
          <p>{errorData.message}</p>
          {errorData.nearest_taluk && (
            <p className="mt-2 text-red-300 font-semibold">
              Nearest In-District Sector: {errorData.nearest_taluk} ({errorData.distance_km} km away)
            </p>
          )}
        </div>

        <p className="text-xs text-slate-400 font-mono">
          TerraVision’s multi-modal AI models were specifically trained on historical rainfall, lateritic soil hydrology, and satellite spectral characteristics of <strong className="text-white">Dakshina Kannada district, Karnataka</strong>. Select a farm location within any of the 7 taluks below to continue:
        </p>

        {/* 1-Click Jump to Dakshina Kannada Taluks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-red-950/60">
          {taluks.map((t) => (
            <button
              key={t.name}
              onClick={() => {
                onSelectTaluk({
                  lat: t.lat,
                  lon: t.lon,
                  place_name: `${t.name} Taluk Center`,
                  taluk: t.name
                });
                onClose();
              }}
              className="px-2.5 py-2 rounded-lg bg-black/90 hover:bg-blue-900/40 border border-blue-900/50 hover:border-blue-400 text-slate-200 hover:text-white font-mono text-xs text-center transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <MapPin className="w-3 h-3 text-blue-400" />
              <span>{t.name}</span>
            </button>
          ))}
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className="w-full mt-2 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)] cursor-pointer"
        >
          Return to Dakshina Kannada Map
        </button>
      </div>
    </div>
  );
}
