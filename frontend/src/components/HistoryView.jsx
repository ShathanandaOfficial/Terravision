import React from 'react';
import { History, MapPin, Calendar, ArrowRight, Satellite, Trash2 } from 'lucide-react';

export default function HistoryView({ history = [], onSelectRecord, onClearHistory }) {
  const defaultSampleHistory = [
    {
      id: 'dk-1',
      place_name: 'Puttur Rubber & Arecanut Estate',
      taluk: 'Puttur',
      lat: 12.7667,
      lon: 75.2000,
      area_acres: 3.2,
      crop: 'ARECANUT',
      yield_forecast: '3.94 T/Ha',
      date: 'Today, 14:32'
    },
    {
      id: 'dk-2',
      place_name: 'Mangaluru Coastal Paddy Sector',
      taluk: 'Mangaluru',
      lat: 12.9141,
      lon: 74.8560,
      area_acres: 2.5,
      crop: 'RICE',
      yield_forecast: '4.82 T/Ha',
      date: 'Yesterday, 11:15'
    },
    {
      id: 'dk-3',
      place_name: 'Bantwal Netravati Valley Parcel',
      taluk: 'Bantwal',
      lat: 12.8900,
      lon: 75.0300,
      area_acres: 1.8,
      crop: 'BANANA',
      yield_forecast: '18.5 T/Ha',
      date: 'Sep 18, 2026'
    }
  ];

  const displayHistory = history.length > 0 ? history : defaultSampleHistory;

  return (
    <div className="w-full max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-950/70 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-1">
            <History className="w-4 h-4 text-blue-400" />
            <span>SATELLITE SCAN ARCHIVE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
            Field Intelligence History
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Archived multi-spectral scans & hybrid crop yield forecasts for Dakshina Kannada.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-500/40 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Log</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayHistory.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectRecord(item)}
            className="glass-card bg-black/80 border border-blue-500/25 p-6 hover:border-blue-400 hover:shadow-[0_0_25px_rgba(59,130,246,0.25)] transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-3">
                <span className="flex items-center gap-1 text-blue-300">
                  <Calendar className="w-3 h-3 text-blue-400" />
                  {item.date}
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-950/60 border border-blue-500/30 text-white font-semibold">
                  {item.area_acres} AC
                </span>
              </div>

              <div className="text-lg font-bold font-['Space_Grotesk'] text-white group-hover:text-blue-300 transition-colors">
                {item.place_name}
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mt-1">
                <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>{item.taluk} Taluk ({item.lat.toFixed(3)}°N, {item.lon.toFixed(3)}°E)</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-blue-950/70 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase">CROP / YIELD</div>
                <div className="text-sm font-bold font-mono text-blue-400">
                  {item.crop} • {item.yield_forecast}
                </div>
              </div>

              <div className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-500/40 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                <ArrowRight className="w-4 h-4 text-blue-400 group-hover:text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
