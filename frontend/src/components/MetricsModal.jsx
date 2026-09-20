import React, { useState, useEffect } from 'react';
import { X, BarChart3, Award, CheckCircle2, Image, Layers } from 'lucide-react';

export default function MetricsModal({ isOpen, onClose }) {
  const [metrics, setMetrics] = useState(null);
  const [selectedPlot, setSelectedPlot] = useState('confusion_matrix.png');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      fetch('/api/metrics')
        .then((res) => res.json())
        .then((data) => {
          setMetrics(data);
          if (data.available_plots && data.available_plots.length > 0) {
            setSelectedPlot(data.available_plots[0]);
          }
        })
        .catch((err) => console.error("Metrics load failed:", err))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 lg:p-6 bg-black/90 backdrop-blur-lg overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl bg-black border-2 border-blue-500/50 p-6 shadow-[0_0_60px_rgba(59,130,246,0.3)] glass-panel flex flex-col gap-6 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-blue-950 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-blue-900/40 pb-4">
          <div className="w-11 h-11 rounded-lg bg-blue-950 border border-blue-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)]">
            <BarChart3 className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-['Orbitron'] uppercase tracking-wider">
              Research & Model Performance Hub
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Authentic Validation Metrics & Training Analytics from Dakshina Kannada Hybrid Architecture
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-blue-400 font-mono text-sm animate-pulse">
            Loading authentic benchmark telemetry...
          </div>
        ) : metrics ? (
          <>
            {/* Top Key Metrics Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-black/80 border border-blue-500/40">
                <span className="text-slate-400 block text-[10px] uppercase">Best Architecture</span>
                <span className="text-sm font-bold text-white uppercase">{metrics.best_model_name}</span>
              </div>
              <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-400/60 shadow-[0_0_12px_rgba(59,130,246,0.2)]">
                <span className="text-blue-300 block text-[10px] uppercase font-semibold">Test Accuracy</span>
                <span className="text-lg font-black text-white">{(metrics.test_accuracy * 100).toFixed(2)}%</span>
              </div>
              <div className="p-3 rounded-lg bg-black/80 border border-blue-900/50">
                <span className="text-slate-400 block text-[10px] uppercase">Weighted F1-Score</span>
                <span className="text-base font-bold text-blue-400">{(metrics.f1_weighted * 100).toFixed(2)}%</span>
              </div>
              <div className="p-3 rounded-lg bg-black/80 border border-blue-900/50">
                <span className="text-slate-400 block text-[10px] uppercase">Precision</span>
                <span className="text-base font-bold text-blue-400">{(metrics.precision * 100).toFixed(2)}%</span>
              </div>
              <div className="p-3 rounded-lg bg-black/80 border border-blue-900/50">
                <span className="text-slate-400 block text-[10px] uppercase">Recall</span>
                <span className="text-base font-bold text-blue-400">{(metrics.recall * 100).toFixed(2)}%</span>
              </div>
              <div className="p-3 rounded-lg bg-black/80 border border-blue-900/50">
                <span className="text-slate-400 block text-[10px] uppercase">Supported Crops</span>
                <span className="text-base font-bold text-red-400">{metrics.supported_crops.length} Varieties</span>
              </div>
            </div>

            {/* Three-Phase Comparison Table */}
            <div className="p-4 rounded-xl bg-black/80 border border-blue-900/40">
              <h4 className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                <span>Multi-Modal Architectural Progression</span>
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-blue-900/40 text-slate-400">
                      <th className="pb-2">Modality / Phase</th>
                      <th className="pb-2">Test Accuracy</th>
                      <th className="pb-2">Input Dimensionality</th>
                      <th className="pb-2">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-950/40 text-slate-300">
                    <tr>
                      <td className="py-2.5 text-white font-semibold">Phase 1: Tabular (XGBoost)</td>
                      <td className="py-2.5 text-blue-400 font-bold">89.08%</td>
                      <td className="py-2.5 text-slate-400">13 Climate & Soil Features</td>
                      <td className="py-2.5">Macro-environmental crop envelope</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-white font-semibold">Phase 2: Satellite (RandomForest)</td>
                      <td className="py-2.5 text-slate-400">45.89%</td>
                      <td className="py-2.5 text-slate-400">7 Spectral Indices (NDVI, EVI, LAI, etc.)</td>
                      <td className="py-2.5">Micro-spatial surface vegetation signature</td>
                    </tr>
                    <tr className="bg-blue-950/30">
                      <td className="py-2.5 text-white font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                        <span>Phase 3: Meta-Fusion (ExtraTrees)</span>
                      </td>
                      <td className="py-2.5 text-blue-300 font-black text-sm">88.29%</td>
                      <td className="py-2.5 text-blue-200">29 Fused Multimodal Features</td>
                      <td className="py-2.5 text-blue-200">Optimal balanced generalization</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Authentic Evaluation Plots Gallery */}
            <div className="p-4 rounded-xl bg-black/80 border border-blue-900/40">
              <h4 className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider mb-3 flex items-center gap-2">
                <Image className="w-4 h-4 text-blue-400" />
                <span>Authentic Training Plots & Visualizations</span>
              </h4>

              {/* Plot Select Tabs */}
              <div className="flex flex-wrap gap-2 mb-4 font-mono text-xs">
                {metrics.available_plots.map((plot) => {
                  const label = plot.replace('.png', '').replace(/_/g, ' ').toUpperCase();
                  const isSelected = selectedPlot === plot;
                  return (
                    <button
                      key={plot}
                      onClick={() => setSelectedPlot(plot)}
                      className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white font-bold border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.5)]'
                          : 'bg-black/60 text-slate-400 border-blue-900/50 hover:border-blue-400 hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Display Image */}
              {selectedPlot && (
                <div className="w-full flex items-center justify-center p-2 rounded-lg bg-black border border-blue-900/40 overflow-hidden">
                  <img
                    src={`/api/plots/${selectedPlot}`}
                    alt={selectedPlot}
                    className="max-h-[420px] w-auto object-contain rounded"
                  />
                </div>
              )}
            </div>

            {/* 13 Supported Crops Tags */}
            <div className="p-3.5 rounded-lg bg-black/70 border border-blue-900/40 text-xs font-mono">
              <span className="text-slate-400 uppercase block mb-2 font-bold">
                13 Trained Agricultural Varieties:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {metrics.supported_crops.map((crop) => (
                  <span
                    key={crop}
                    className="px-2.5 py-1 rounded bg-blue-950/60 border border-blue-500/30 text-slate-200"
                  >
                    {crop}
                  </span>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
