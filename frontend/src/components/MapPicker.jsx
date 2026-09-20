import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, useMapEvents, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { Layers, Eye, Crosshair } from 'lucide-react';

// Custom Futuristic Blue/Red Reticle Crosshair Icon
const createPulseIcon = () => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="pulse-marker"></div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

// Map click handler component
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

// Controller to fly to coordinates when selection changes
function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom || 11, { duration: 1.4, easeLinearity: 0.25 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function MapPicker({ selectedCoords, onLocationPicked, taluks }) {
  const [mapType, setMapType] = useState('satellite'); // 'satellite' | 'dark'
  const [showNdviOverlay, setShowNdviOverlay] = useState(false);

  // Dakshina Kannada Bounding Polygon Points
  const dkPolygonCoords = [
    [13.15, 74.80],
    [13.22, 75.02],
    [13.20, 75.25],
    [13.08, 75.40],
    [12.90, 75.58],
    [12.70, 75.62],
    [12.50, 75.48],
    [12.48, 75.30],
    [12.65, 75.05],
    [12.75, 74.90],
    [12.91, 74.80],
    [13.05, 74.78],
    [13.15, 74.80]
  ];

  const defaultCenter = [12.87, 75.15];
  const centerPos = selectedCoords ? [selectedCoords.lat, selectedCoords.lon] : defaultCenter;

  return (
    <div className="relative w-full h-[420px] lg:h-[520px] rounded-xl overflow-hidden border border-blue-600/30 shadow-[0_0_30px_rgba(0,0,0,0.8)] glass-panel">
      {/* HUD Map Controls Overlays */}
      <div className="absolute top-3 right-3 z-[400] flex flex-col gap-2">
        {/* Layer Toggle */}
        <div className="flex rounded-lg bg-black/90 p-1 border border-blue-500/40 backdrop-blur-md shadow-xl">
          <button
            onClick={() => setMapType('satellite')}
            className={`px-3 py-1 text-xs font-mono rounded flex items-center gap-1.5 transition-all cursor-pointer ${
              mapType === 'satellite'
                ? 'bg-blue-600 text-white font-bold shadow-[0_0_10px_rgba(59,130,246,0.6)]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Satellite</span>
          </button>
          <button
            onClick={() => setMapType('dark')}
            className={`px-3 py-1 text-xs font-mono rounded flex items-center gap-1.5 transition-all cursor-pointer ${
              mapType === 'dark'
                ? 'bg-blue-600 text-white font-bold shadow-[0_0_10px_rgba(59,130,246,0.6)]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>Dark HUD</span>
          </button>
        </div>

        {/* NDVI False-Color Heatmap Toggle */}
        <button
          onClick={() => setShowNdviOverlay(!showNdviOverlay)}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all backdrop-blur-md border cursor-pointer ${
            showNdviOverlay
              ? 'bg-red-950/90 text-red-300 border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]'
              : 'bg-black/90 text-slate-300 border-blue-500/30 hover:border-blue-400'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-red-400" />
          <span>NDVI Thermal Sim</span>
        </button>
      </div>

      {/* Target Crosshair Readout */}
      <div className="absolute bottom-3 left-3 z-[400] bg-black/90 px-3 py-2 rounded-lg border border-blue-500/40 text-[11px] font-mono text-blue-300 backdrop-blur-md shadow-xl flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <Crosshair className="w-3.5 h-3.5 text-red-400 animate-spin" />
          <span className="text-white font-bold">TARGET COORD:</span>
        </div>
        {selectedCoords ? (
          <span className="text-red-400 font-semibold">
            {selectedCoords.lat.toFixed(4)}° N, {selectedCoords.lon.toFixed(4)}° E
          </span>
        ) : (
          <span className="text-slate-400">Click anywhere on map to pin</span>
        )}
      </div>

      {/* District Geofence Indicator Badge */}
      <div className="absolute top-3 left-3 z-[400] bg-blue-950/90 border border-blue-400/50 px-3 py-1 rounded-md text-[11px] font-mono text-blue-200 backdrop-blur-md flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
        <span>DAKSHINA KANNADA BOUNDARY GEOFENCED</span>
      </div>

      {/* Leaflet Map Container */}
      <MapContainer
        center={defaultCenter}
        zoom={10}
        minZoom={8}
        maxZoom={18}
        className="w-full h-full"
        zoomControl={false}
      >
        {/* Basemap Tiles */}
        {mapType === 'satellite' ? (
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri World Imagery</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        ) : (
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO Dark Matter</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
        )}

        {/* Simulated False-Color NDVI Spectral Band Overlay */}
        {showNdviOverlay && (
          <TileLayer
            opacity={0.45}
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          />
        )}

        {/* Dakshina Kannada Border Glowing Polygon */}
        <Polygon
          positions={dkPolygonCoords}
          pathOptions={{
            color: '#3b82f6',
            weight: 2.5,
            fillColor: '#1d4ed8',
            fillOpacity: 0.06,
            dashArray: '4, 6'
          }}
        />

        {/* Taluk Hub Markers */}
        {taluks && Object.entries(taluks).map(([name, info]) => (
          <Marker
            key={name}
            position={[info.lat, info.lon]}
            icon={L.divIcon({
              className: 'taluk-hub-marker',
              html: `
                <div style="width:10px;height:10px;background:#3b82f6;border:2px solid #ffffff;border-radius:50%;box-shadow:0 0 8px #3b82f6;"></div>
              `,
              iconSize: [10, 10],
              iconAnchor: [5, 5]
            })}
            eventHandlers={{
              click: () => onLocationPicked(info.lat, info.lon, `${name} Taluk Center`, name)
            }}
          >
            <Tooltip direction="top" offset={[0, -5]} opacity={0.9} className="custom-tooltip">
              <span className="font-mono text-xs font-bold text-blue-400">{name}</span>
              <br />
              <span className="text-[10px] text-slate-300">{info.zone}</span>
            </Tooltip>
          </Marker>
        ))}

        {/* Selected Target Pin Marker */}
        {selectedCoords && (
          <Marker
            position={[selectedCoords.lat, selectedCoords.lon]}
            icon={createPulseIcon()}
          />
        )}

        {/* Interactive Click Handler */}
        <MapClickHandler onMapClick={(lat, lon) => onLocationPicked(lat, lon)} />

        {/* Recenter View Controller */}
        <MapRecenter center={centerPos} zoom={selectedCoords ? 12 : 10} />
      </MapContainer>
    </div>
  );
}
