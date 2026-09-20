import React from 'react';
import { Satellite, Droplets, Thermometer, Sparkles } from 'lucide-react';

export default function SatelliteRadar({ satelliteData }) {
  if (!satelliteData) return null;

  const {
    ndvi,
    evi,
    ndwi,
    savi,
    lai,
    lst_c,
    soil_moisture_index,
    vegetation_health_label,
    satellite_source
  } = satelliteData;

  const indices = [
    {
      code: 'NDVI',
      name: 'Veg. Health Index',
      val: ndvi,
      max: 1.0,
      format: (v) => v.toFixed(3),
      desc: 'Plant vigor & canopy density'
    },
    {
      code: 'EVI',
      name: 'Enhanced Veg. Index',
      val: evi,
      max: 1.0,
      format: (v) => v.toFixed(3),
      desc: 'High-biomass sensitivity'
    },
    {
      code: 'NDWI',
      name: 'Water Index',
      val: ndwi,
      max: 0.8,
      format: (v) => v.toFixed(3),
      desc: 'Plant water content'
    },
    {
      code: 'SAVI',
      name: 'Soil-Adjusted Index',
      val: savi,
      max: 1.0,
      format: (v) => v.toFixed(3),
      desc: 'Soil background attenuation'
    },
    {
      code: 'LAI',
      name: 'Leaf Area Index',
      val: lai,
      max: 6.0,
      format: (v) => `${v.toFixed(1)} m²/m²`,
      desc: 'Canopy foliar coverage'
    },
    {
      code: 'SOIL MOIST.',
      name: 'Surface Moisture',
      val: soil_moisture_index,
      max: 50.0,
      format: (v) => `${v.toFixed(1)}%`,
      desc: 'Topsoil saturation proxy'
    },
    {
      code: 'LST',
      name: 'Surface Temp',
      val: lst_c,
      max: 45.0,
      format: (v) => `${v.toFixed(1)}°C`,
      desc: 'Radiometric skin temp'
    }
  ];

  return (
    <div className="p-5 rounded-xl border border-blue-900/40 bg-black/80 glass-panel flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-blue-950/60">
        <div className="flex items-center gap-2">
          <Satellite className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
            Satellite Spectral Telemetry
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 border border-blue-500/40 text-blue-300">
          {satellite_source}
        </span>
      </div>

      {/* Canopy Status Banner */}
      <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-mono text-slate-300">Canopy Health Status:</span>
        </div>
        <span className="text-xs font-mono font-bold text-white px-2.5 py-0.5 rounded bg-blue-600/30 border border-blue-400">
          {vegetation_health_label}
        </span>
      </div>

      {/* Grid of Spectral Indices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {indices.map((idx) => {
          const pct = Math.min(100, Math.max(0, (idx.val / idx.max) * 100));
          return (
            <div key={idx.code} className="p-3 rounded-lg bg-black/70 border border-blue-900/40">
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="text-blue-400 font-bold">{idx.code}</span>
                <span className="text-white font-bold">{idx.format(idx.val)}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono mb-2 truncate">{idx.name}</p>
              <div className="w-full h-1.5 bg-blue-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-700 to-blue-400 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
