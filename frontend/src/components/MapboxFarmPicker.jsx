import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';
import { 
  Search, 
  MapPin, 
  Crosshair, 
  Layers, 
  Compass, 
  Edit3, 
  Trash2, 
  Square, 
  Check, 
  ChevronRight, 
  Loader2, 
  Navigation,
  Sparkles
} from 'lucide-react';

// Mapbox token — set VITE_MAPBOX_TOKEN in your .env file (never commit tokens)
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';
mapboxgl.accessToken = MAPBOX_TOKEN;

// Fallback high-resolution raster styles for seamless zero-config rendering
const RASTER_STYLES = {
  satellite: {
    version: 8,
    sources: {
      'satellite-tiles': {
        type: 'raster',
        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
        tileSize: 256,
        attribution: 'Esri World Imagery'
      }
    },
    layers: [{ id: 'satellite-layer', type: 'raster', source: 'satellite-tiles', minzoom: 0, maxzoom: 22 }]
  },
  streets: {
    version: 8,
    sources: {
      'osm-tiles': {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: 'OpenStreetMap'
      }
    },
    layers: [{ id: 'osm-layer', type: 'raster', source: 'osm-tiles', minzoom: 0, maxzoom: 20 }]
  },
  terrain: {
    version: 8,
    sources: {
      'topo-tiles': {
        type: 'raster',
        tiles: ['https://a.tile.opentopomap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: 'OpenTopoMap'
      }
    },
    layers: [{ id: 'topo-layer', type: 'raster', source: 'topo-tiles', minzoom: 0, maxzoom: 17 }]
  },
  dark: {
    version: 8,
    sources: {
      'dark-tiles': {
        type: 'raster',
        tiles: ['https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: 'CARTO Dark'
      }
    },
    layers: [{ id: 'dark-layer', type: 'raster', source: 'dark-tiles', minzoom: 0, maxzoom: 20 }]
  }
};

// Dakshina Kannada Taluks coordinates registry
const DK_TALUKS = [
  { name: 'Puttur', lat: 12.7667, lon: 75.2000, desc: 'Agricultural Core' },
  { name: 'Mangaluru', lat: 12.9141, lon: 74.8560, desc: 'Coastal Plains' },
  { name: 'Belthangady', lat: 13.0000, lon: 75.2600, desc: 'Western Ghats Foothills' },
  { name: 'Bantwal', lat: 12.8900, lon: 75.0300, desc: 'Netravati Valley' },
  { name: 'Sullia', lat: 12.5600, lon: 75.3900, desc: 'Forest Agro Zone' },
  { name: 'Moodbidri', lat: 13.0700, lon: 74.9900, desc: 'Jain Heritage Plateau' },
  { name: 'Kadaba', lat: 12.7400, lon: 75.4300, desc: 'Rubber & Spices Sector' }
];

export default function MapboxFarmPicker({
  selectedCoords,
  onLocationPicked,
  onFieldConfirmed,
  farmArea,
  onAreaChange,
  isAnalyzing
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const drawRef = useRef(null);
  const markerRef = useRef(null);

  const [activeStyle, setActiveStyle] = useState('satellite');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isLiveLocationActive, setIsLiveLocationActive] = useState(false);
  const [drawMode, setDrawMode] = useState('idle'); // 'idle' | 'drawing' | 'editing'
  const [calculatedAreaAcres, setCalculatedAreaAcres] = useState(farmArea || 2.34);
  const [calculatedAreaSqm, setCalculatedAreaSqm] = useState(Math.round((farmArea || 2.34) * 4046.86));
  const [hasPolygon, setHasPolygon] = useState(false);

  // Custom Mapbox Draw styling to match futuristic electric blue theme
  const customDrawStyles = [
    // ACTIVE (being drawn) - Polygon fill
    {
      id: 'gl-draw-polygon-fill-active',
      type: 'fill',
      filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
      paint: {
        'fill-color': '#3b82f6',
        'fill-opacity': 0.22
      }
    },
    // INACTIVE (drawn) - Polygon fill
    {
      id: 'gl-draw-polygon-fill-static',
      type: 'fill',
      filter: ['all', ['==', '$type', 'Polygon'], ['==', 'mode', 'static']],
      paint: {
        'fill-color': '#2563eb',
        'fill-opacity': 0.18
      }
    },
    // ACTIVE - Polygon stroke
    {
      id: 'gl-draw-polygon-stroke-active',
      type: 'line',
      filter: ['all', ['==', '$type', 'Polygon']],
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint: {
        'line-color': '#60a5fa',
        'line-width': 2.5,
        'line-dasharray': [0.2, 0]
      }
    },
    // Midpoint / vertex markers
    {
      id: 'gl-draw-polygon-midpoint',
      type: 'circle',
      filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']],
      paint: {
        'circle-radius': 5,
        'circle-color': '#3b82f6',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff'
      }
    },
    // Vertex handles (glowing blue with white center)
    {
      id: 'gl-draw-polygon-and-line-vertex-active',
      type: 'circle',
      filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point']],
      paint: {
        'circle-radius': 7,
        'circle-color': '#ffffff',
        'circle-stroke-width': 3,
        'circle-stroke-color': '#2563eb'
      }
    }
  ];

  // Initialize Mapbox GL JS map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Use satellite raster style by default
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: RASTER_STYLES.satellite,
      center: [selectedCoords?.lon || 75.2000, selectedCoords?.lat || 12.7667],
      zoom: 13,
      attributionControl: false
    });

    mapRef.current = map;

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), 'bottom-right');

    // Initialize Mapbox Draw
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      styles: customDrawStyles,
      controls: {
        polygon: false,
        trash: false
      }
    });

    drawRef.current = draw;
    map.addControl(draw);

    // Click on map to pick location
    map.on('click', (e) => {
      // If currently drawing, do not trigger coordinate pick
      if (draw.getMode() === 'draw_polygon') return;

      const { lng, lat } = e.lngLat;
      updateMarker(lng, lat);
      onLocationPicked(lat, lng, 'Selected Land Sector');
    });

    // Update acreage on draw events
    const updateArea = () => {
      const data = draw.getAll();
      if (data.features.length > 0) {
        setHasPolygon(true);
        const polygon = data.features[0];
        const areaInSquareMeters = turf.area(polygon);
        const acres = parseFloat((areaInSquareMeters * 0.000247105).toFixed(2));
        const sqMeters = Math.round(areaInSquareMeters);

        setCalculatedAreaAcres(acres > 0 ? acres : 2.34);
        setCalculatedAreaSqm(sqMeters > 0 ? sqMeters : 9469);
        onAreaChange(acres > 0 ? acres : 2.34);

        // Center location on polygon centroid
        try {
          const centroid = turf.centroid(polygon);
          const [lon, lat] = centroid.geometry.coordinates;
          updateMarker(lon, lat);
        } catch (err) {
          console.error("Centroid error:", err);
        }
      } else {
        setHasPolygon(false);
      }
    };

    map.on('draw.create', updateArea);
    map.on('draw.update', updateArea);
    map.on('draw.delete', () => {
      setHasPolygon(false);
      setDrawMode('idle');
    });

    map.on('load', () => {
      // Set initial marker at selected coordinates
      if (selectedCoords) {
        updateMarker(selectedCoords.lon, selectedCoords.lat);
        // Create an initial sample field parcel around coordinates for instant visual feedback
        createSampleFarmPolygon(selectedCoords.lon, selectedCoords.lat);
      }
    });

    return () => {
      map.remove();
    };
  }, []);

  // Update target marker on map
  const updateMarker = (lon, lat) => {
    if (!mapRef.current) return;

    if (markerRef.current) {
      markerRef.current.setLngLat([lon, lat]);
    } else {
      const el = document.createElement('div');
      el.className = 'custom-pin-red';
      el.innerHTML = '<div class="halo"></div><div class="dot"></div>';

      markerRef.current = new mapboxgl.Marker(el)
        .setLngLat([lon, lat])
        .addTo(mapRef.current);
    }
  };

  // Create initial demo rectangle farm parcel around coordinates
  const createSampleFarmPolygon = (lon, lat) => {
    if (!drawRef.current) return;
    const offset = 0.0018; // approx 2.5 acres
    const sampleFeature = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [lon - offset, lat - offset * 0.8],
          [lon + offset, lat - offset * 0.8],
          [lon + offset, lat + offset * 0.8],
          [lon - offset, lat + offset * 0.8],
          [lon - offset, lat - offset * 0.8]
        ]]
      }
    };

    drawRef.current.deleteAll();
    drawRef.current.add(sampleFeature);
    setHasPolygon(true);
  };

  // Sync marker when selectedCoords prop changes
  useEffect(() => {
    if (selectedCoords && mapRef.current) {
      updateMarker(selectedCoords.lon, selectedCoords.lat);
      mapRef.current.flyTo({
        center: [selectedCoords.lon, selectedCoords.lat],
        zoom: 14,
        essential: true,
        duration: 1200
      });
    }
  }, [selectedCoords]);

  // Handle map style switch
  const handleStyleChange = (styleKey) => {
    setActiveStyle(styleKey);
    if (!mapRef.current) return;

    // Save existing polygons
    const existingFeatures = drawRef.current ? drawRef.current.getAll() : null;

    mapRef.current.setStyle(RASTER_STYLES[styleKey]);

    mapRef.current.once('style.load', () => {
      // Re-add draw features
      if (existingFeatures && drawRef.current) {
        drawRef.current.set(existingFeatures);
      }
      if (selectedCoords) {
        updateMarker(selectedCoords.lon, selectedCoords.lat);
      }
    });
  };

  // Live search handler via backend /api/search
  const handleSearchInput = async (e) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (val.length < 2) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    setIsSearching(true);
    setShowSearchDropdown(true);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(val)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.results || []);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  // Select a search result
  const handleSelectPlace = (item) => {
    setSearchQuery(item.place_name);
    setShowSearchDropdown(false);
    onLocationPicked(item.lat, item.lon, item.place_name, item.taluk);

    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [item.lon, item.lat],
        zoom: 15,
        essential: true,
        duration: 1500
      });
    }
    updateMarker(item.lon, item.lat);
    createSampleFarmPolygon(item.lon, item.lat);
  };

  // Use Live Geolocation
  const handleUseLiveLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLiveLocationActive(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        onLocationPicked(lat, lon, "My Live Field Parcel");
        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [lon, lat],
            zoom: 16,
            essential: true,
            duration: 1600
          });
        }
        updateMarker(lon, lat);
        createSampleFarmPolygon(lon, lat);
      },
      (err) => {
        console.warn("Geolocation denied or error:", err);
        setIsLiveLocationActive(false);
        alert("Unable to fetch live position. Defaulting to Dakshina Kannada center.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Drawing Toolbar Actions
  const handleStartDraw = () => {
    if (!drawRef.current) return;
    drawRef.current.deleteAll();
    drawRef.current.changeMode('draw_polygon');
    setDrawMode('drawing');
    setHasPolygon(false);
  };

  const handleEditBoundary = () => {
    if (!drawRef.current) return;
    const all = drawRef.current.getAll();
    if (all.features.length > 0) {
      drawRef.current.changeMode('simple_select', { featureIds: [all.features[0].id] });
      setDrawMode('editing');
    }
  };

  const handleDeleteBoundary = () => {
    if (!drawRef.current) return;
    drawRef.current.deleteAll();
    setHasPolygon(false);
    setDrawMode('idle');
  };

  return (
    <div className="relative w-full h-[600px] lg:h-[680px] rounded-2xl overflow-hidden border border-blue-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.9)] glass-card">
      
      {/* 1. TOP GLASS SEARCH BAR */}
      <div className="absolute top-4 left-4 right-4 sm:left-6 sm:right-auto sm:w-96 z-20">
        <div className="relative">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-black/85 border border-blue-500/35 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.7)] text-sm transition-all focus-within:border-blue-400 focus-within:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <Search className="w-4 h-4 text-blue-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInput}
              onFocus={() => searchQuery.length >= 2 && setShowSearchDropdown(true)}
              placeholder="Search city, village or location…"
              className="bg-transparent text-white placeholder:text-slate-400 outline-none w-full text-xs sm:text-sm font-['Space_Grotesk']"
            />
            {isSearching && <Loader2 className="w-4 h-4 text-blue-400 animate-spin shrink-0" />}
          </div>

          {/* Autocomplete Dropdown */}
          {showSearchDropdown && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-black/95 border border-blue-500/30 backdrop-blur-2xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto z-30">
              {searchResults.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPlace(item)}
                  className="w-full px-4 py-2.5 text-left text-xs font-mono hover:bg-blue-950/60 hover:text-white transition-all flex items-start gap-2.5 border-b border-blue-950/40 last:border-none cursor-pointer group"
                >
                  <MapPin className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="text-white font-semibold group-hover:text-blue-300">
                      {item.place_name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {item.taluk} Taluk • Dakshina Kannada
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. TOP RIGHT: MAP STYLE SWITCHER */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 p-1 rounded-xl bg-black/85 border border-blue-500/30 backdrop-blur-xl shadow-xl">
        {[
          { id: 'satellite', label: 'Satellite' },
          { id: 'streets', label: 'Streets' },
          { id: 'terrain', label: 'Terrain' },
          { id: 'dark', label: 'Dark' }
        ].map((style) => {
          const isSelected = activeStyle === style.id;
          return (
            <button
              key={style.id}
              onClick={() => handleStyleChange(style.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white font-bold shadow-[0_0_12px_rgba(59,130,246,0.6)] border border-blue-400'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {style.label}
            </button>
          );
        })}
      </div>

      {/* 3. DAKSHINA KANNADA QUICK TALUK EXPLORATION BAR */}
      <div className="absolute top-16 right-4 z-20 hidden md:flex items-center gap-1 p-1 rounded-xl bg-black/80 border border-blue-500/25 backdrop-blur-xl">
        <span className="text-[10px] font-mono text-slate-400 px-2 flex items-center gap-1">
          <Compass className="w-3 h-3 text-blue-400" />
          SECTOR:
        </span>
        {DK_TALUKS.map((t) => (
          <button
            key={t.name}
            onClick={() => {
              onLocationPicked(t.lat, t.lon, `${t.name} Agro Zone`, t.name);
              if (mapRef.current) {
                mapRef.current.flyTo({ center: [t.lon, t.lat], zoom: 14, duration: 1200 });
              }
              updateMarker(t.lon, t.lat);
              createSampleFarmPolygon(t.lon, t.lat);
            }}
            className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer ${
              selectedCoords?.taluk === t.name
                ? 'bg-blue-950/80 text-blue-300 border border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* 4. FLOATING LIVE LOCATION BUTTON */}
      <div className="absolute bottom-20 left-4 z-20">
        <button
          onClick={handleUseLiveLocation}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer backdrop-blur-xl shadow-xl ${
            isLiveLocationActive
              ? 'bg-blue-950/90 border border-blue-400 text-blue-300 shadow-[0_0_16px_rgba(59,130,246,0.4)]'
              : 'bg-black/85 border border-blue-500/30 text-slate-200 hover:border-blue-400'
          }`}
        >
          <Navigation className={`w-3.5 h-3.5 text-blue-400 ${isLiveLocationActive ? 'animate-pulse' : ''}`} />
          <span>{isLiveLocationActive ? 'LIVE LOCATION ACTIVE' : 'USE MY LIVE LOCATION'}</span>
          {isLiveLocationActive && <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />}
        </button>
      </div>

      {/* 5. CUSTOM FLOATING FARM DRAWING CONTROLS */}
      <div className="absolute top-28 left-4 z-20 flex flex-col gap-2">
        <div className="p-1 rounded-xl bg-black/90 border border-blue-500/35 backdrop-blur-xl shadow-2xl flex flex-col gap-1 w-44">
          <div className="px-3 py-1.5 text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-blue-950/50 flex items-center justify-between">
            <span>PARCEL TOOLKIT</span>
            <Square className="w-3 h-3 text-blue-400" />
          </div>

          <button
            onClick={handleStartDraw}
            className={`px-3 py-2 rounded-lg text-xs font-mono flex items-center gap-2 transition-all cursor-pointer ${
              drawMode === 'drawing'
                ? 'bg-blue-600 text-white font-bold shadow-[0_0_12px_rgba(59,130,246,0.5)]'
                : 'text-slate-300 hover:text-white hover:bg-blue-950/50'
            }`}
          >
            <Square className="w-3.5 h-3.5 text-blue-400" />
            <span>Draw Farm</span>
          </button>

          <button
            onClick={handleEditBoundary}
            disabled={!hasPolygon}
            className={`px-3 py-2 rounded-lg text-xs font-mono flex items-center gap-2 transition-all cursor-pointer ${
              drawMode === 'editing'
                ? 'bg-blue-600 text-white font-bold shadow-[0_0_12px_rgba(59,130,246,0.5)]'
                : 'text-slate-300 hover:text-white hover:bg-blue-950/50 disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-blue-400" />
            <span>Edit Boundary</span>
          </button>

          <button
            onClick={handleDeleteBoundary}
            disabled={!hasPolygon}
            className="px-3 py-2 rounded-lg text-xs font-mono flex items-center gap-2 text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>Delete Boundary</span>
          </button>
        </div>

        {/* Selected Field Label */}
        {hasPolygon && (
          <div className="px-3.5 py-2 rounded-xl bg-blue-950/90 border border-blue-500/40 backdrop-blur-xl shadow-xl flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <div>
              <div className="text-white font-bold">SELECTED FIELD</div>
              <div className="text-[10px] text-blue-300">{calculatedAreaAcres} ACRES</div>
            </div>
          </div>
        )}
      </div>

      {/* 6. FLOATING MEASUREMENT & CONFIRM FIELD CARD */}
      <div className="absolute bottom-4 right-4 z-20 max-w-sm w-full sm:w-auto">
        <div className="glass-card bg-black/90 border border-blue-500/40 p-4 shadow-[0_10px_35px_rgba(0,0,0,0.9)] backdrop-blur-2xl flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-blue-950/60 pb-2">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              FIELD AREA MEASUREMENT
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono text-blue-400">
              <Sparkles className="w-3 h-3 text-blue-400" />
              TURF.JS LIVE
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <div className="text-3xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
              {calculatedAreaAcres} <span className="text-blue-400 text-lg font-mono">ACRES</span>
            </div>
            <div className="text-xs font-mono text-slate-400">
              ({calculatedAreaSqm.toLocaleString()} m²)
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <button
              onClick={() => onFieldConfirmed(calculatedAreaAcres)}
              disabled={isAnalyzing}
              className="btn-blue-primary text-xs font-bold uppercase tracking-wider w-full py-3 cursor-pointer disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>SATELLITE SCANNING...</span>
                </>
              ) : (
                <>
                  <span>CONFIRM FIELD</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              onClick={handleEditBoundary}
              className="text-center text-[11px] font-mono text-slate-400 hover:text-blue-300 transition-colors cursor-pointer py-0.5"
            >
              Edit boundary handles
            </button>
          </div>
        </div>
      </div>

      {/* Target coordinates badge */}
      <div className="absolute bottom-4 left-4 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/85 border border-blue-500/25 text-[11px] font-mono text-slate-300 backdrop-blur-md">
        <Crosshair className="w-3.5 h-3.5 text-red-400 animate-spin" />
        <span>TARGET:</span>
        <span className="text-red-400 font-bold">
          {selectedCoords?.lat ? selectedCoords.lat.toFixed(4) : '12.7667'}° N,{' '}
          {selectedCoords?.lon ? selectedCoords.lon.toFixed(4) : '75.2000'}° E
        </span>
      </div>

      {/* Main Mapbox GL JS Container */}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
