import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Shield, Hospital, Truck, Flame, AlertCircle } from 'lucide-react';

// Custom SVG Markers for Leaflet
const createCustomIcon = (color, text = '!') => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="30" height="42">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24s12-15 12-24c0-6.63-5.37-12-12-12z" fill="${color}" stroke="#ffffff" stroke-width="2"/>
    <circle cx="12" cy="12" r="7" fill="#ffffff" />
    <text x="12" y="16" font-size="11" font-weight="900" text-anchor="middle" fill="${color}">${text}</text>
  </svg>`;
  return L.icon({
    iconUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -36]
  });
};

const SEVERITY_COLORS = {
  CRITICAL: '#dc2626',
  HIGH: '#ef4444',
  MEDIUM: '#f59e0b',
  LOW: '#10b981',
  RESOLVED: '#3b82f6'
};

// Map click handler component for Picker Mode
function LocationPickerMarker({ position, setPosition, onLocationPick }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      if (onLocationPick) {
        onLocationPick(lat, lng);
      }
    }
  });

  return position ? (
    <Marker position={position} icon={createCustomIcon('#3b82f6', '📍')}>
      <Popup>Selected Location: [{position[0].toFixed(4)}, {position[1].toFixed(4)}]</Popup>
    </Marker>
  ) : null;
}

// Recenter Map Helper
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

export const InteractiveMap = ({
  incidents = [],
  resources = [],
  mode = 'display', // 'display' | 'picker'
  selectedPosition = null,
  onLocationPick = null,
  onSelectIncident = null,
  center = [12.9716, 77.5946],
  zoom = 13,
  height = '400px'
}) => {
  const [pickerPos, setPickerPos] = useState(selectedPosition || center);

  useEffect(() => {
    if (selectedPosition) setPickerPos(selectedPosition);
  }, [selectedPosition]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-800 shadow-2xl z-0" style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & OpenTopoMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Display Mode: Render Incidents & Resources */}
        {mode === 'display' && (
          <>
            {/* Incident Markers */}
            {incidents.map((inc) => {
              const lat = inc.location?.latitude || 12.9716;
              const lng = inc.location?.longitude || 77.5946;
              const color = SEVERITY_COLORS[inc.severity] || '#f59e0b';
              const icon = createCustomIcon(color, inc.severity ? inc.severity[0] : '!');

              return (
                <Marker
                  key={inc.id || inc.incidentId}
                  position={[lat, lng]}
                  icon={icon}
                  eventHandlers={{
                    click: () => onSelectIncident && onSelectIncident(inc)
                  }}
                >
                  <Popup>
                    <div className="p-1 max-w-xs text-xs">
                      <div className="flex items-center justify-between font-bold mb-1">
                        <span className="text-slate-100">{inc.type}</span>
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] font-extrabold text-white"
                          style={{ backgroundColor: color }}
                        >
                          {inc.severity} ({inc.priorityScore}/100)
                        </span>
                      </div>
                      <p className="text-slate-300 mb-1 line-clamp-2">{inc.description}</p>
                      <div className="text-[10px] text-slate-400 font-semibold mb-2">
                        📍 {inc.location?.address}
                      </div>
                      <button
                        onClick={() => onSelectIncident && onSelectIncident(inc)}
                        className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-1 rounded text-[11px] transition"
                      >
                        View Details & Dispatch
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {/* Resources Markers */}
            {resources.map((res) => (
              <Marker
                key={res.id}
                position={[res.latitude, res.longitude]}
                icon={createCustomIcon('#3b82f6', '🚑')}
              >
                <Popup>
                  <div className="p-1 text-xs">
                    <strong className="text-blue-400 block">{res.name}</strong>
                    <span className="text-slate-300">{res.type} • {res.availability}</span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </>
        )}

        {/* Picker Mode: Interactive click pin selection */}
        {mode === 'picker' && (
          <LocationPickerMarker
            position={pickerPos}
            setPosition={setPickerPos}
            onLocationPick={onLocationPick}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;
