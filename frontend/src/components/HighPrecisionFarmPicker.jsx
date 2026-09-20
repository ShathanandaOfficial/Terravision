import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import * as turf from '@turf/turf';
import { 
  Search, 
  MapPin, 
  Crosshair, 
  Compass, 
  Edit3, 
  Trash2, 
  Square, 
  ChevronRight, 
  Loader2, 
  Navigation,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';

// Tile Layer Configurations (100% Free, No API key, No Payment Method required)
const TILE_LAYERS = {
  hybrid: {
    name: 'Satellite + Roads & Houses',
    url: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 21,
    attribution: 'Imagery & Roads &copy; Google Earth'
  },
  satellite: {
    name: 'Pure Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    subdomains: [],
    maxZoom: 19,
    attribution: 'Esri World Imagery'
  },
  terrain: {
    name: 'Terrain Relief',
    url: 'https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
    attribution: 'Terrain &copy; Google'
  },
  dark: {
    name: 'Dark HUD',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    subdomains: ['a', 'b', 'c', 'd'],
    maxZoom: 20,
    attribution: 'CARTO Dark'
  }
};

// Dakshina Kannada 7 Taluks Registry
const DK_TALUKS = [
  { name: 'Puttur', lat: 12.7667, lon: 75.2000, desc: 'Agricultural Core' },
  { name: 'Mangaluru', lat: 12.9141, lon: 74.8560, desc: 'Coastal Plains' },
  { name: 'Belthangady', lat: 13.0000, lon: 75.2600, desc: 'Western Ghats Foothills' },
  { name: 'Bantwal', lat: 12.8900, lon: 75.0300, desc: 'Netravati Valley' },
  { name: 'Sullia', lat: 12.5600, lon: 75.3900, desc: 'Forest Agro Belt' },
  { name: 'Moodbidri', lat: 13.0700, lon: 74.9900, desc: 'Jain Heritage Plateau' },
  { name: 'Kadaba', lat: 12.7400, lon: 75.4300, desc: 'Rubber & Spices Sector' }
];

export default function HighPrecisionFarmPicker({
  selectedCoords,
  onLocationPicked,
  onFieldConfirmed,
  onGeofenceError,
  farmArea,
  onAreaChange,
  isAnalyzing
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const tileLayerRef = useRef(null);
  const polygonRef = useRef(null);
  const vertexMarkersRef = useRef([]);
  const targetPinRef = useRef(null);

  const [activeLayerKey, setActiveLayerKey] = useState('hybrid');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isLiveLocationActive, setIsLiveLocationActive] = useState(false);
  const [drawMode, setDrawMode] = useState('idle'); // 'idle' | 'drawing' | 'editing'
  const [calculatedAreaAcres, setCalculatedAreaAcres] = useState(farmArea || 2.34);
  const [calculatedAreaSqm, setCalculatedAreaSqm] = useState(Math.round((farmArea || 2.34) * 4046.86));
  const [hasPolygon, setHasPolygon] = useState(true);
  const [isToolkitHidden, setIsToolkitHidden] = useState(false);

  // Default coordinates: Puttur agricultural zone
  const defaultLat = selectedCoords?.lat || 12.7667;
  const defaultLon = selectedCoords?.lon || 75.2000;

  // Helper: update target pin
  const createOrUpdateTargetPin = (lat, lon) => {
    if (!mapRef.current) return;

    if (targetPinRef.current) {
      targetPinRef.current.setLatLng([lat, lon]);
    } else {
      const icon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: '<div class="custom-pin-red"><div class="halo"></div><div class="dot"></div></div>',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      targetPinRef.current = L.marker([lat, lon], { icon }).addTo(mapRef.current);
    }
  };

  // Helper: compute area using turf
  const computeAreaFromLatLngs = (latlngs) => {
    try {
      const turfCoords = latlngs.map((pt) => [
        pt.lng !== undefined ? pt.lng : pt[1],
        pt.lat !== undefined ? pt.lat : pt[0]
      ]);
      turfCoords.push(turfCoords[0]);

      const turfPoly = turf.polygon([turfCoords]);
      const areaSqM = turf.area(turfPoly);
      const acres = parseFloat((areaSqM * 0.000247105).toFixed(2));
      const sqMeters = Math.round(areaSqM);

      const finalAcres = acres > 0 ? acres : 2.34;
      const finalSqm = sqMeters > 0 ? sqMeters : 9469;

      setCalculatedAreaAcres(finalAcres);
      setCalculatedAreaSqm(finalSqm);
      onAreaChange(finalAcres);

      const centroid = turf.centroid(turfPoly);
      const [cLon, cLat] = centroid.geometry.coordinates;
      createOrUpdateTargetPin(cLat, cLon);
    } catch (e) {
      console.warn("Turf calculation error:", e);
    }
  };

  // Helper: render polygon and handles
  const renderPolygonAndHandles = (coords) => {
    if (!mapRef.current) return;

    if (polygonRef.current) {
      mapRef.current.removeLayer(polygonRef.current);
    }
    vertexMarkersRef.current.forEach((m) => mapRef.current.removeLayer(m));
    vertexMarkersRef.current = [];

    const poly = L.polygon(coords, {
      color: '#3b82f6',
      weight: 2.5,
      fillColor: '#2563eb',
      fillOpacity: 0.22,
      dashArray: null
    }).addTo(mapRef.current);
    polygonRef.current = poly;
    setHasPolygon(true);

    // Clicking on the polygon also points to location and recenters
    poly.on('click', (e) => {
      L.DomEvent.stopPropagation(e);
      handleMapClick(e.latlng.lat, e.latlng.lng);
    });

    computeAreaFromLatLngs(coords);

    const handles = coords.map((latlng) => {
      const handleIcon = L.divIcon({
        className: 'vertex-handle-icon',
        html: '<div class="vertex-handle-marker"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      const marker = L.marker(latlng, {
        icon: handleIcon,
        draggable: true
      }).addTo(mapRef.current);

      marker.on('drag', () => {
        const currentPoints = vertexMarkersRef.current.map((m) => m.getLatLng());
        poly.setLatLngs(currentPoints);
        computeAreaFromLatLngs(currentPoints);
      });

      marker.on('dragend', () => {
        const currentPoints = vertexMarkersRef.current.map((m) => m.getLatLng());
        poly.setLatLngs(currentPoints);
        computeAreaFromLatLngs(currentPoints);
      });

      return marker;
    });

    vertexMarkersRef.current = handles;
  };

  // Helper: create initial farm polygon
  const createInitialFarmPolygon = (lat, lon) => {
    if (!mapRef.current) return;
    const offsetLat = 0.0009;
    const offsetLon = 0.0011;

    const points = [
      [lat - offsetLat, lon - offsetLon],
      [lat + offsetLat, lon - offsetLon],
      [lat + offsetLat, lon + offsetLon],
      [lat - offsetLat, lon + offsetLon]
    ];

    renderPolygonAndHandles(points);
  };

  // Handle map click: instantly move pin, check geofence boundary, and recenter farm parcel
  const handleMapClick = async (lat, lon) => {
    createOrUpdateTargetPin(lat, lon);

    // 1. Check if outside Dakshina Kannada AI training boundary
    try {
      const res = await fetch(`/api/geofence-check?lat=${lat}&lon=${lon}`);
      if (res.ok) {
        const data = await res.json();
        if (!data.is_inside_dk) {
          if (onGeofenceError) {
            onGeofenceError({
              error: 'OUTSIDE_DAKSHINA_KANNADA',
              message: data.message,
              nearest_taluk: data.nearest_taluk,
              distance_km: data.distance_km,
              lat,
              lon
            });
          }
          return;
        }
      }
    } catch (err) {
      // Offline fallback: check DK bounding box
      if (lat < 12.45 || lat > 13.25 || lon < 74.75 || lon > 75.68) {
        if (onGeofenceError) {
          onGeofenceError({
            error: 'OUTSIDE_DAKSHINA_KANNADA',
            message: `Selected coordinate (${lat.toFixed(4)}, ${lon.toFixed(4)}) is outside the Dakshina Kannada AI model training boundary.`,
            nearest_taluk: 'Puttur',
            distance_km: 15,
            lat,
            lon
          });
        }
        return;
      }
    }

    // 2. If inside boundary: move farm polygon to center around clicked coordinate!
    createInitialFarmPolygon(lat, lon);

    // 3. Reverse geocode place name
    try {
      const revRes = await fetch(`/api/reverse-geocode?lat=${lat}&lon=${lon}`);
      if (revRes.ok) {
        const revData = await revRes.json();
        onLocationPicked(lat, lon, revData.place_name, revData.taluk);
        return;
      }
    } catch (e) {}

    onLocationPicked(lat, lon, 'Selected Farm Plot');
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [defaultLat, defaultLon],
      zoom: 16,
      minZoom: 9,
      maxZoom: 21,
      zoomControl: false
    });
    mapRef.current = map;

    // Create a custom pane at high z-index so the boundary line renders over the satellite tiles
    map.createPane('boundaryPane');
    map.getPane('boundaryPane').style.zIndex = 450;
    map.getPane('boundaryPane').style.pointerEvents = 'none';

    // Add Tile Layer (Google Hybrid Satellite default for sub-meter clarity)
    const layerCfg = TILE_LAYERS.hybrid;
    const tileLayer = L.tileLayer(layerCfg.url, {
      subdomains: layerCfg.subdomains,
      maxZoom: layerCfg.maxZoom,
      attribution: layerCfg.attribution
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Add Dakshina Kannada AI Model Training Boundary (dashed green box – matches reference image)
    // Rendered in high-z pane so it always shows on top of the satellite imagery
    const dkBounds = [
      [13.25, 74.75], // NW corner (Mulki / Udupi border)
      [13.25, 75.68], // NE corner (Ghats border)
      [12.45, 75.68], // SE corner (Sullia / Kasaragod)
      [12.45, 74.75], // SW corner (Coastline)
      [13.25, 74.75]  // close polygon
    ];

    L.polygon(dkBounds, {
      color: '#00ff88',
      weight: 3,
      dashArray: '10, 8',
      fillColor: '#00ff88',
      fillOpacity: 0.03,
      interactive: false,
      pane: 'boundaryPane'
    }).addTo(map);

    // Add Target Pin Marker & Initial Sample Polygon
    createOrUpdateTargetPin(defaultLat, defaultLon);
    createInitialFarmPolygon(defaultLat, defaultLon);

    // Map Click to pick coordinates
    map.on('click', (e) => {
      handleMapClick(e.latlng.lat, e.latlng.lng);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Switch Tile Layer
  const handleLayerChange = (layerKey) => {
    setActiveLayerKey(layerKey);
    if (!mapRef.current || !tileLayerRef.current) return;

    mapRef.current.removeLayer(tileLayerRef.current);

    const cfg = TILE_LAYERS[layerKey];
    const newLayer = L.tileLayer(cfg.url, {
      subdomains: cfg.subdomains,
      maxZoom: cfg.maxZoom,
      attribution: cfg.attribution
    }).addTo(mapRef.current);

    tileLayerRef.current = newLayer;
  };

  // Sync with prop changes
  useEffect(() => {
    if (selectedCoords && mapRef.current) {
      createOrUpdateTargetPin(selectedCoords.lat, selectedCoords.lon);
    }
  }, [selectedCoords]);

  // Live search handler via backend /api/search + live Dakshina Kannada geocode fallback
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
      // 1. Query backend universal Dakshina Kannada gazetteer
      const res = await fetch(`/api/search?q=${encodeURIComponent(val)}`);
      let items = [];
      if (res.ok) {
        const data = await res.json();
        // Backend returns { display_name, name, lat, lon, taluk, type, is_inside_dk }
        items = data.results || [];
      }

      // 2. If fewer than 3 results found, query live OpenStreetMap bounded to Dakshina Kannada
      if (items.length < 3) {
        try {
          const nomUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val + ' Dakshina Kannada')}&format=json&addressdetails=1&limit=5&countrycodes=in`;
          const nomRes = await fetch(nomUrl, { headers: { 'Accept-Language': 'en' } });
          if (nomRes.ok) {
            const nomData = await nomRes.json();
            for (const item of nomData) {
              const lat = parseFloat(item.lat);
              const lon = parseFloat(item.lon);
              if (lat >= 12.45 && lat <= 13.25 && lon >= 74.75 && lon <= 75.68) {
                const shortName = item.name || item.display_name.split(',')[0];
                const alreadyAdded = items.some(
                  (existing) => existing.name.toLowerCase().includes(shortName.toLowerCase())
                );
                if (!alreadyAdded) {
                  items.push({
                    display_name: `${shortName}, Dakshina Kannada`,
                    name: `${shortName}, Dakshina Kannada`,
                    lat,
                    lon,
                    taluk: 'Dakshina Kannada',
                    type: item.type || 'locality',
                    is_inside_dk: true
                  });
                }
              }
            }
          }
        } catch (nomErr) {
          console.warn('Nominatim fallback error:', nomErr);
        }
      }

      setSearchResults(items);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Select place from search dropdown: fly to location, place marker, and center farm parcel
  const handleSelectPlace = (item) => {
    // Backend uses display_name; nominatim fallback also uses display_name
    const label = item.display_name || item.name || 'Selected Location';
    setSearchQuery(label);
    setShowSearchDropdown(false);
    onLocationPicked(item.lat, item.lon, label, item.taluk);

    if (mapRef.current) {
      mapRef.current.flyTo([item.lat, item.lon], 16, { duration: 1.5 });
    }
    createOrUpdateTargetPin(item.lat, item.lon);
    createInitialFarmPolygon(item.lat, item.lon);
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
          mapRef.current.flyTo([lat, lon], 17, { duration: 1.6 });
        }
        createOrUpdateTargetPin(lat, lon);
        createInitialFarmPolygon(lat, lon);
      },
      (err) => {
        console.warn("Geolocation denied or error:", err);
        setIsLiveLocationActive(false);
        alert("Unable to fetch live position. Centering on Dakshina Kannada.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Toolkit actions
  const handleStartDraw = () => {
    if (!mapRef.current) return;
    setDrawMode('drawing');
    const center = mapRef.current.getCenter();
    createInitialFarmPolygon(center.lat, center.lng);
  };

  const handleDeleteBoundary = () => {
    if (!mapRef.current) return;
    if (polygonRef.current) {
      mapRef.current.removeLayer(polygonRef.current);
      polygonRef.current = null;
    }
    vertexMarkersRef.current.forEach((m) => mapRef.current.removeLayer(m));
    vertexMarkersRef.current = [];
    setHasPolygon(false);
    setDrawMode('idle');
  };

  return (
    <div className="relative w-full h-[620px] lg:h-[700px] rounded-2xl overflow-hidden border border-blue-500/35 shadow-[0_20px_50px_rgba(0,0,0,0.95)] glass-card">
      
      {/* 1. TOP GLASS SEARCH BAR */}
      <div className="absolute top-4 left-4 right-4 sm:left-6 sm:right-auto sm:w-96 z-[1000]">
        <div className="relative">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-black/85 border border-blue-500/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.7)] text-sm transition-all focus-within:border-blue-400 focus-within:shadow-[0_0_20px_rgba(59,130,246,0.35)]">
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
            <div className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-black/95 border border-blue-500/40 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.9)] overflow-hidden max-h-72 overflow-y-auto z-[1500]">
              {searchResults.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPlace(item)}
                  className="w-full px-4 py-2.5 text-left text-xs font-mono hover:bg-blue-950/60 hover:text-white transition-all flex items-start gap-2.5 border-b border-blue-950/40 last:border-none cursor-pointer group"
                >
                  <MapPin className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="text-white font-semibold group-hover:text-blue-300">
                      {item.display_name || item.name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {item.taluk ? `${item.taluk} Taluk` : 'Dakshina Kannada'} • {item.type || 'locality'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* 2. TOP RIGHT: HIGH-CLARITY SATELLITE SWITCHER */}
      <div className="absolute top-4 right-4 z-[1000] flex items-center gap-1 p-1 rounded-xl bg-black/85 border border-blue-500/30 backdrop-blur-xl shadow-xl">
        {[
          { id: 'hybrid', label: 'Hybrid' },
          { id: 'satellite', label: 'Sat' },
          { id: 'terrain', label: 'Terrain' },
          { id: 'dark', label: 'Dark HUD' }
        ].map((style) => {
          const isSelected = activeLayerKey === style.id;
          return (
            <button
              key={style.id}
              onClick={() => handleLayerChange(style.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
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
      <div className="absolute top-16 right-4 z-[1000] hidden md:flex items-center gap-1 p-1 rounded-xl bg-black/85 border border-blue-500/25 backdrop-blur-xl">
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
                mapRef.current.flyTo([t.lat, t.lon], 16, { duration: 1.2 });
              }
              createOrUpdateTargetPin(t.lat, t.lon);
              createInitialFarmPolygon(t.lat, t.lon);
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
      <div className="absolute bottom-20 left-4 z-[1000]">
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

      {/* 5. CUSTOM FLOATING FARM DRAWING CONTROLS (WITH HIDE / UNHIDE TOGGLE) */}
      <div className="absolute top-28 left-4 z-[900] flex flex-col gap-2">
        {isToolkitHidden ? (
          /* Minimized / Hidden State Button */
          <button
            onClick={() => setIsToolkitHidden(false)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/90 hover:bg-blue-950/90 border border-blue-500/40 backdrop-blur-xl shadow-2xl text-xs font-mono text-slate-200 hover:text-white transition-all cursor-pointer group"
            title="Unhide Parcel Toolkit"
          >
            <Square className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold tracking-wider">SHOW TOOLKIT</span>
            <Eye className="w-3.5 h-3.5 text-blue-400" />
          </button>
        ) : (
          /* Full Expanded Toolkit Card */
          <div className="p-1 rounded-xl bg-black/90 border border-blue-500/35 backdrop-blur-xl shadow-2xl flex flex-col gap-1 w-48">
            <div className="px-3 py-1.5 text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-blue-950/50 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Square className="w-3 h-3 text-blue-400" />
                <span className="text-white font-semibold">PARCEL TOOLKIT</span>
              </div>
              <button
                onClick={() => setIsToolkitHidden(true)}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-950/70 hover:bg-blue-900 border border-blue-500/30 text-slate-300 hover:text-white text-[10px] transition-all cursor-pointer"
                title="Hide / Minimize Toolkit while searching"
              >
                <EyeOff className="w-3 h-3 text-blue-400" />
                <span>Hide</span>
              </button>
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
              onClick={() => setDrawMode('editing')}
              disabled={!hasPolygon}
              className={`px-3 py-2 rounded-lg text-xs font-mono flex items-center gap-2 transition-all cursor-pointer ${
                drawMode === 'editing'
                  ? 'bg-blue-600 text-white font-bold shadow-[0_0_12px_rgba(59,130,246,0.5)]'
                  : 'text-slate-300 hover:text-white hover:bg-blue-950/50 disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-400" />
              <span>Edit Handles</span>
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
        )}

        {/* Selected Field Label */}
        {hasPolygon && (
          <div className="px-3.5 py-2 rounded-xl bg-blue-950/90 border border-blue-500/40 backdrop-blur-xl shadow-xl flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              <div>
                <div className="text-white font-bold text-[11px]">SELECTED FIELD</div>
                <div className="text-[10px] text-blue-300">{calculatedAreaAcres} ACRES</div>
              </div>
            </div>
            {isToolkitHidden && (
              <button
                onClick={() => setIsToolkitHidden(false)}
                className="text-[10px] text-blue-400 underline hover:text-blue-300 cursor-pointer ml-2"
              >
                Edit
              </button>
            )}
          </div>
        )}
      </div>

      {/* 6. FLOATING MEASUREMENT & CONFIRM FIELD CARD */}
      <div className="absolute bottom-4 right-4 z-[1000] max-w-sm w-full sm:w-auto">
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
              onClick={() => setDrawMode('editing')}
              className="text-center text-[11px] font-mono text-slate-400 hover:text-blue-300 transition-colors cursor-pointer py-0.5"
            >
              Drag corner handles to reshape
            </button>
          </div>
        </div>
      </div>


      {/* AI Training Boundary Legend */}
      <div className="absolute bottom-[4.5rem] left-4 z-[1000] flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/90 border border-[#00ff88]/40 text-[10px] font-mono text-slate-300 backdrop-blur-md shadow-lg">
        <span className="w-2.5 h-2.5 rounded-sm border-2 border-dashed border-[#00ff88] shrink-0" />
        <span className="text-[#00ff88] font-bold tracking-wide">AI MODEL TRAINING BOUNDARY</span>
        <span className="text-slate-500">— Dakshina Kannada</span>
      </div>

      {/* Target coordinates badge */}
      <div className="absolute bottom-4 left-4 z-[1000] hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/85 border border-blue-500/25 text-[11px] font-mono text-slate-300 backdrop-blur-md">
        <Crosshair className="w-3.5 h-3.5 text-red-400 animate-spin" />
        <span>TARGET:</span>
        <span className="text-red-400 font-bold">
          {selectedCoords?.lat ? selectedCoords.lat.toFixed(4) : defaultLat.toFixed(4)}° N,{' '}
          {selectedCoords?.lon ? selectedCoords.lon.toFixed(4) : defaultLon.toFixed(4)}° E
        </span>
      </div>

      {/* Leaflet Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}

