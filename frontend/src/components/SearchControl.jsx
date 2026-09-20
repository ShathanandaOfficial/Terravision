import React, { useState, useEffect, useRef } from 'react';
import { Search, Navigation, Loader2, MapPin, AlertCircle, Compass } from 'lucide-react';

export default function SearchControl({ onSelectLocation, onGeofenceError, isPredicting }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const dropdownRef = useRef(null);

  // Dakshina Kannada 7 Taluk Quick Presets
  const talukPresets = [
    { name: 'Mangaluru', lat: 12.9141, lon: 74.8560, zone: 'Coastal Lowland' },
    { name: 'Bantwal', lat: 12.8903, lon: 75.0347, zone: 'Midland River Valley' },
    { name: 'Puttur', lat: 12.7663, lon: 75.2033, zone: 'Plantation Belt' },
    { name: 'Belthangady', lat: 12.9983, lon: 75.2588, zone: 'Foothill Plains' },
    { name: 'Sullia', lat: 12.5606, lon: 75.3892, zone: 'Ghats Highland' },
    { name: 'Moodbidri', lat: 13.0694, lon: 74.9961, zone: 'Northern Plateaus' },
    { name: 'Kadaba', lat: 12.7381, lon: 75.4522, zone: 'Riverine Basin' }
  ];

  // Dynamic Free API Geocoding search (bounded strictly to Dakshina Kannada)
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    // Direct plot coordinate check (e.g. '12.7805, 75.1869' or '12.78 75.18')
    const coordMatch = query.match(/^([-+]?\d{1,2}\.\d+)[,\s]+([-+]?\d{1,3}\.\d+)$/);
    if (coordMatch) {
      const pLat = parseFloat(coordMatch[1]);
      const pLon = parseFloat(coordMatch[2]);
      setResults([{
        name: `Plot Coordinates (${pLat.toFixed(4)}, ${pLon.toFixed(4)})`,
        display_name: `Custom Land Plot at ${pLat.toFixed(4)}° N, ${pLon.toFixed(4)}° E`,
        lat: pLat,
        lon: pLon,
        taluk: 'Dakshina Kannada Plot',
        type: 'custom_plot',
        is_inside_dk: true
      }]);
      setShowDropdown(true);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error("Geocoding search failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener to close dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // HTML5 Live Geolocation Sharing
  const handleShareLiveLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          // Check geofence
          const geoRes = await fetch(`/api/geofence-check?lat=${latitude}&lon=${longitude}`);
          const geoData = await geoRes.json();

          if (!geoData.is_inside_dk) {
            onGeofenceError({
              lat: latitude,
              lon: longitude,
              message: geoData.message,
              nearest_taluk: geoData.nearest_taluk,
              distance_km: geoData.distance_km
            });
          } else {
            onSelectLocation({
              lat: latitude,
              lon: longitude,
              place_name: `My GPS Location (${geoData.taluk || geoData.nearest_taluk})`,
              taluk: geoData.taluk || geoData.nearest_taluk
            });
          }
        } catch (err) {
          console.error("Geofence check failed:", err);
          onSelectLocation({
            lat: latitude,
            lon: longitude,
            place_name: "My GPS Location",
            taluk: "Mangaluru"
          });
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        alert(`Could not acquire GPS position: ${err.message}. Please enable location permissions or select your taluk below.`);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Top Search & GPS Row */}
      <div className="flex flex-col sm:flex-row items-center gap-2 relative" ref={dropdownRef}>
        {/* Dynamic Search Input */}
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            {isSearching ? (
              <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
            ) : (
              <Search className="w-4 h-4 text-blue-400" />
            )}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setShowDropdown(true)}
            placeholder="Search village, town, or farm in Dakshina Kannada (e.g. Bantwal, Puttur, Vitla)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/80 border border-blue-600/40 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-[0_0_15px_rgba(59,130,246,0.15)] font-mono"
          />

          {/* Autocomplete Dropdown */}
          {showDropdown && results.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-black/95 border border-blue-500/50 rounded-lg shadow-2xl backdrop-blur-xl z-50 max-h-64 overflow-y-auto divide-y divide-blue-950/40">
              <div className="px-3 py-1.5 text-[10px] font-mono text-blue-400 uppercase tracking-wider bg-blue-950/30">
                Live Geocoded Places (Dakshina Kannada)
              </div>
              {results.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectLocation({
                      lat: item.lat,
                      lon: item.lon,
                      place_name: item.name || item.display_name,
                      taluk: item.taluk
                    });
                    setQuery(item.name || item.display_name);
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-blue-900/30 transition-all flex items-start gap-2.5 group cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-blue-400 mt-0.5 group-hover:text-red-400 transition-colors shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate group-hover:text-blue-200">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {item.display_name}
                    </p>
                  </div>
                  {item.taluk && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 border border-blue-600/40 text-blue-300 font-mono shrink-0">
                      {item.taluk}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Share Live Location Button */}
        <button
          onClick={handleShareLiveLocation}
          disabled={isLocating || isPredicting}
          className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-medium text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 border border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all cursor-pointer disabled:opacity-50 shrink-0"
          title="Detect and use your real GPS coordinates"
        >
          {isLocating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Acquiring GPS...</span>
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4 text-white animate-pulse" />
              <span>Share Live Location</span>
            </>
          )}
        </button>
      </div>

      {/* Quick Taluk Sector Selectors */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-mono">
        <span className="text-[11px] text-slate-400 whitespace-nowrap flex items-center gap-1 pl-1">
          <Compass className="w-3.5 h-3.5 text-blue-400" />
          <span>Taluk Hubs:</span>
        </span>
        {talukPresets.map((taluk) => (
          <button
            key={taluk.name}
            onClick={() => onSelectLocation({
              lat: taluk.lat,
              lon: taluk.lon,
              place_name: `${taluk.name} Taluk Farm Center`,
              taluk: taluk.name
            })}
            className="px-2.5 py-1 rounded bg-black/60 hover:bg-blue-950/70 border border-blue-900/50 hover:border-blue-400 text-slate-300 hover:text-blue-200 transition-all whitespace-nowrap cursor-pointer"
          >
            {taluk.name}
          </button>
        ))}
      </div>
    </div>
  );
}
