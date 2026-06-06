import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Map, Layers, Maximize2, Minimize2, Crosshair,
  Play, Pause, SkipForward, SkipBack, CloudRain,
  Wind, Thermometer, Cloud, Gauge, MapPin, Loader
} from 'lucide-react';
import {
  MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default Leaflet marker icon issue with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

// ─── Layer Definitions ────────────────────────────────────────────────
const OVERLAY_LAYERS = [
  { id: 'temp_new', label: 'Temp', icon: Thermometer, color: '#F87171' },
  { id: 'precipitation_new', label: 'Rain', icon: CloudRain, color: '#60A5FA' },
  { id: 'wind_new', label: 'Wind', icon: Wind, color: '#34D399' },
  { id: 'clouds_new', label: 'Clouds', icon: Cloud, color: '#A78BFA' },
  { id: 'pressure_new', label: 'Pressure', icon: Gauge, color: '#FBBF24' },
];

// ─── Custom Marker Icons ─────────────────────────────────────────────
const createPulsingIcon = (color = '#60A5FA') => {
  return L.divIcon({
    className: 'custom-pulsing-marker',
    html: `
      <div style="position:relative;width:20px;height:20px;">
        <div style="
          position:absolute;top:0;left:0;width:20px;height:20px;
          background:${color};border-radius:50%;opacity:0.4;
          animation: pulse-ring 1.5s cubic-bezier(0.215,0.61,0.355,1) infinite;
          will-change: transform, opacity;
        "></div>
        <div style="
          position:absolute;top:4px;left:4px;width:12px;height:12px;
          background:${color};border-radius:50%;border:2px solid white;
          box-shadow:0 0 10px ${color}80;
        "></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -14],
  });
};

const cityIcon = createPulsingIcon('#60A5FA');
const clickIcon = createPulsingIcon('#F472B6');
const userIcon = createPulsingIcon('#34D399');

// ─── Map Controller (handles fly-to on prop changes) ──────────────────
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || map.getZoom(), { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

// ─── Click Handler Component ──────────────────────────────────────────
function ClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
}

// ─── Auto-Opening Marker (opens popup on mount) ──────────────────────
function AutoOpenMarker({ position, icon, children }) {
  const markerRef = useRef(null);
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [position]);
  return (
    <Marker position={position} icon={icon} ref={markerRef}>
      {children}
    </Marker>
  );
}

// ─── Fly-To Marker (flies map + opens popup) ─────────────────────────
function FlyToMarker({ position, icon, children }) {
  const map = useMap();
  const markerRef = useRef(null);
  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom(), { duration: 1.2 });
      setTimeout(() => {
        if (markerRef.current) markerRef.current.openPopup();
      }, 1300);
    }
  }, [position, map]);
  return (
    <Marker position={position} icon={icon} ref={markerRef}>
      {children}
    </Marker>
  );
}

// ─── Main WeatherMap Component ────────────────────────────────────────
const WeatherMap = ({ lat, lon, onLocationClick, locationName }) => {
  const [activeLayer, setActiveLayer] = useState('temp_new');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [clickedPos, setClickedPos] = useState(null);
  const [userPos, setUserPos] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  const containerRef = useRef(null);

  // RainViewer latest radar frame
  const [latestRadarFrame, setLatestRadarFrame] = useState(null);

  const center = useMemo(() => [lat || 37.77, lon || -122.42], [lat, lon]);

  // Fetch RainViewer radar frame timestamps
  useEffect(() => {
    fetch('https://api.rainviewer.com/public/weather-maps.json')
      .then(res => res.json())
      .then(data => {
        if (data.radar && data.radar.past && data.radar.past.length > 0) {
          // The last frame in 'past' is the most recent real radar data
          setLatestRadarFrame(data.radar.past[data.radar.past.length - 1]);
        }
      })
      .catch(() => {});
  }, []);


  // Lock body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isFullscreen]);

  // Fullscreen escape key handler
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isFullscreen) exitFullscreen();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isFullscreen]);

  const enterFullscreen = () => {
    setIsExiting(false);
    setIsFullscreen(true);
  };

  const exitFullscreen = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsFullscreen(false);
      setIsExiting(false);
    }, 350); // match the exit animation duration
  };

  const handleMapClick = useCallback((latlng) => {
    setClickedPos(latlng);
  }, []);

  const handleLoadWeatherHere = useCallback(() => {
    if (clickedPos && onLocationClick) {
      onLocationClick(clickedPos.lat, clickedPos.lng);
      setClickedPos(null);
    }
  }, [clickedPos, onLocationClick]);

  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserPos({ lat: latitude, lng: longitude });
        setIsLocating(false);
      },
      () => setIsLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  if (!lat || !lon) return null;

  // Build tile URLs
  const owmTileUrl = `https://tile.openweathermap.org/map/${activeLayer}/{z}/{x}/{y}.png?appid=${API_KEY}`;
  
  const radarTileUrl = latestRadarFrame 
    ? `https://tilecache.rainviewer.com${latestRadarFrame.path}/256/{z}/{x}/{y}/2/1_1.png`
    : null;

  const latestTimeLabel = latestRadarFrame 
    ? new Date(latestRadarFrame.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
    : 'Live';

  // Shared map content renderer (used in both normal and fullscreen views)
  const renderMapContent = (inFullscreen) => (
    <>
      {/* ─── Header ─────────────────────────────────────────── */}
      <div className="weather-map-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Map size={22} color="#60A5FA" />
          <h3 className="weather-map-title">Interactive Weather Radar</h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Locate Me */}
          <button
            className="weather-map-icon-btn"
            onClick={handleLocateMe}
            title="Find my location"
          >
            {isLocating ? <Loader size={18} className="spin-icon" /> : <Crosshair size={18} />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            className="weather-map-icon-btn"
            onClick={inFullscreen ? exitFullscreen : enterFullscreen}
            title={inFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {inFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>

      {/* ─── Layer Switcher ──────────────────────────────────── */}
      <div className="weather-map-layers">
        {OVERLAY_LAYERS.map(layer => {
          const Icon = layer.icon;
          const isActive = activeLayer === layer.id;
          return (
            <button
              key={layer.id}
              className={`weather-map-layer-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveLayer(layer.id)}
              style={{ '--layer-color': layer.color }}
            >
              <Icon size={14} />
              <span>{layer.label}</span>
            </button>
          );
        })}
      </div>

      {/* ─── Map ─────────────────────────────────────────────── */}
      <div className="weather-map-canvas">
        <MapContainer
          center={center}
          zoom={7}
          scrollWheelZoom={inFullscreen}
          dragging={inFullscreen}
          touchZoom={inFullscreen}
          doubleClickZoom={inFullscreen}
          zoomControl={inFullscreen}
          attributionControl={false}
          style={{ 
            width: '100%', 
            height: '100%', 
            borderRadius: '20px',
            transform: 'translateZ(0)',
            willChange: 'transform'
          }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          {activeLayer !== 'precipitation_new' && (
            <TileLayer 
              url={owmTileUrl} 
              opacity={0.7} 
              key={activeLayer} 
              maxNativeZoom={12}
              maxZoom={18}
            />
          )}
          {activeLayer === 'precipitation_new' && radarTileUrl && (
            <TileLayer
              url={radarTileUrl}
              opacity={0.6}
              key={`radar-live`}
              maxNativeZoom={12}
              maxZoom={18}
            />
          )}
          <MapController center={center} zoom={7} />
          <ClickHandler onClick={handleMapClick} />

          <Marker position={center} icon={cityIcon}>
            <Popup className="custom-popup">
              <div className="popup-content">
                <MapPin size={14} style={{ color: '#60A5FA' }} />
                <span>{locationName || 'Current Location'}</span>
              </div>
            </Popup>
          </Marker>

          {clickedPos && (
            <AutoOpenMarker position={[clickedPos.lat, clickedPos.lng]} icon={clickIcon}>
              <Popup className="custom-popup" autoClose={false} closeOnClick={false}>
                <div className="popup-content popup-click">
                  <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '0.25rem' }}>
                    {clickedPos.lat.toFixed(3)}°, {clickedPos.lng.toFixed(3)}°
                  </div>
                  <button className="popup-load-btn" onClick={handleLoadWeatherHere}>
                    <MapPin size={13} />
                    Load Weather Here
                  </button>
                </div>
              </Popup>
            </AutoOpenMarker>
          )}

          {userPos && (
            <FlyToMarker position={[userPos.lat, userPos.lng]} icon={userIcon}>
              <Popup className="custom-popup">
                <div className="popup-content">
                  <Crosshair size={14} style={{ color: '#34D399' }} />
                  <span>You are here</span>
                </div>
              </Popup>
            </FlyToMarker>
          )}
        </MapContainer>

        <AnimatePresence>
          {!clickedPos && (
            <motion.div
              className="weather-map-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 2, duration: 0.5 }}
            >
              <MapPin size={14} />
              Click anywhere to check weather
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Live Indicator ──────────────────────────────────── */}
      <div className="weather-map-live-indicator">
        <div className="live-dot" />
        <span>Live Radar • {latestTimeLabel}</span>
      </div>
    </>
  );

  return (
    <>
      {/* ─── Normal Inline View ─────────────────────────────── */}
      <motion.div
        ref={containerRef}
        className="weather-map-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6 }}
      >
        {!isFullscreen && renderMapContent(false)}
      </motion.div>

      {/* ─── Fullscreen Overlay ─────────────────────────────── */}
      {isFullscreen && (
        <div className={`weather-map-fs-overlay ${isExiting ? 'exiting' : ''}`}>
          <div
            className="weather-map-fs-backdrop"
            onClick={exitFullscreen}
          />
          <div className={`weather-map-fs-panel ${isExiting ? 'exiting' : ''}`}>
            {renderMapContent(true)}
          </div>
        </div>
      )}
    </>
  );
};

export default WeatherMap;
