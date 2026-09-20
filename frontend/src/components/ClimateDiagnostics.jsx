import React from 'react';
import { CloudRain, Thermometer, Droplets, Mountain, Sprout, Wind, MapPin } from 'lucide-react';

export default function ClimateDiagnostics({ envData, locationSummary }) {
  if (!envData) return null;

  const {
    rainfall_mm,
    temperature_c,
    humidity_pct,
    elevation_m,
    soil_type,
    irrigation,
    season,
    agro_climatic_zone
  } = envData;

  const items = [
    {
      icon: CloudRain,
      label: 'Precipitation',
      val: `${rainfall_mm.toFixed(0)} mm`,
      sub: 'Annual Normal'
    },
    {
      icon: Thermometer,
      label: 'Temperature',
      val: `${temperature_c.toFixed(1)}°C`,
      sub: 'Ambient Surface'
    },
    {
      icon: Droplets,
      label: 'Humidity',
      val: `${humidity_pct.toFixed(0)}%`,
      sub: 'Atmospheric Relative'
    },
    {
      icon: Mountain,
      label: 'Elevation',
      val: `${elevation_m.toFixed(0)} m`,
      sub: 'Above MSL'
    },
    {
      icon: Sprout,
      label: 'Soil Type',
      val: soil_type,
      sub: 'Dominant Horizon'
    },
    {
      icon: Wind,
      label: 'Irrigation',
      val: irrigation,
      sub: `Season: ${season}`
    }
  ];

  return (
    <div className="p-5 rounded-xl border border-blue-900/40 bg-black/80 glass-panel flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-blue-950/60">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
            Environmental & Climate Diagnostics
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 border border-blue-500/40 text-blue-300 truncate max-w-xs">
          {agro_climatic_zone}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="p-3 rounded-lg bg-black/70 border border-blue-900/40 flex flex-col">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono mb-1">
                <Icon className="w-3.5 h-3.5 text-blue-400" />
                <span className="truncate">{item.label}</span>
              </div>
              <p className="text-base font-bold text-white font-mono">{item.val}</p>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">{item.sub}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
