import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { MapPin, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Language, LocationData, TemperatureUnit } from '../types';
import { MAP_CITIES } from '../utils/indiaMapData';
import { formatTemp } from '../utils/formatters';
import { getLocalizedCityName } from '../utils/translations';

const INDIA_GEOJSON_URL = "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@main/geojson/india.geojson";

export interface IndiaGeoMapCanvasProps {
  currentLocation: LocationData;
  onSelectLocation: (loc: LocationData) => void;
  language: Language;
  tempUnit: TemperatureUnit;
  activeMetric: 'temp' | 'aqi' | 'rain';
  onCityClick?: (city: LocationData) => void;
}

export const IndiaGeoMapCanvas: React.FC<IndiaGeoMapCanvasProps> = ({
  currentLocation,
  onSelectLocation,
  language,
  tempUnit,
  activeMetric,
  onCityClick,
}) => {
  const [position, setPosition] = useState({ coordinates: [82.5, 23.0] as [number, number], zoom: 1 });

  const handleZoomIn = () => {
    if (position.zoom >= 5) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom * 1.5 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 0.8) return;
    setPosition(pos => ({ ...pos, zoom: Math.max(0.8, pos.zoom / 1.5) }));
  };

  const handleReset = () => {
    setPosition({ coordinates: [82.5, 23.0], zoom: 1 });
  };

  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      {/* Zoom / Pan Control Buttons */}
      <div className="absolute top-3 right-3 z-30 flex flex-col space-y-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80 shadow-lg">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition-colors flex items-center justify-center"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition-colors flex items-center justify-center"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          title="Reset View"
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition-colors flex items-center justify-center border-t border-slate-700/60 pt-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [82.5, 23.0],
          scale: 950,
        }}
        className="w-full h-full max-h-[440px]"
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={(pos) => setPosition({ coordinates: pos.coordinates as [number, number], zoom: pos.zoom })}
          maxZoom={6}
          minZoom={0.8}
        >
          <Geographies geography={INDIA_GEOJSON_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: {
                      fill: '#1e293b', // slate-800
                      stroke: '#334155', // slate-700
                      strokeWidth: 0.6,
                      outline: 'none',
                    },
                    hover: {
                      fill: '#334155', // slate-700
                      stroke: '#38bdf8', // sky-400
                      strokeWidth: 0.8,
                      outline: 'none',
                    },
                    pressed: {
                      fill: '#0f172a',
                      outline: 'none',
                    },
                  }}
                />
              ))
            }
          </Geographies>

          {MAP_CITIES.map((city, idx) => {
            const isSelected = currentLocation.name.toLowerCase() === city.name.toLowerCase();
            const localizedCity = getLocalizedCityName(city.name, language);

            let markerColor = 'bg-amber-500 text-slate-950 border-amber-300';
            let markerLabel = formatTemp(city.baseTemp, tempUnit);

            if (activeMetric === 'aqi') {
              if (city.aqi <= 50) markerColor = 'bg-emerald-400 text-slate-950 border-emerald-200';
              else if (city.aqi <= 100) markerColor = 'bg-lime-400 text-slate-950 border-lime-200';
              else if (city.aqi <= 200) markerColor = 'bg-amber-400 text-slate-950 border-amber-200';
              else if (city.aqi <= 300) markerColor = 'bg-orange-400 text-slate-950 border-orange-200';
              else markerColor = 'bg-rose-500 text-white border-rose-300';
              markerLabel = `AQI ${city.aqi}`;
            } else if (activeMetric === 'rain') {
              markerColor = 'bg-sky-400 text-slate-950 border-sky-200';
              markerLabel = `${city.rain}% Rain`;
            }

            return (
              <Marker key={`geo-marker-${city.name}-${idx}`} coordinates={[city.lon, city.lat]}>
                <foreignObject x={-45} y={-30} width={90} height={60} className="overflow-visible">
                  <button
                    onClick={() => {
                      onSelectLocation(city);
                      if (onCityClick) onCityClick(city);
                    }}
                    title={`Click to view weather for ${localizedCity}`}
                    className={`group flex flex-col items-center cursor-pointer transition-all duration-200 ${
                      isSelected ? 'scale-110 z-30' : 'hover:scale-110 z-20 opacity-95 hover:opacity-100'
                    }`}
                  >
                    <div
                      className={`px-1.5 py-0.5 rounded-full text-[9px] font-black tracking-tight shadow-lg border whitespace-nowrap ${markerColor} ${
                        isSelected ? 'ring-2 ring-white shadow-sky-400/50' : ''
                      }`}
                    >
                      {markerLabel}
                    </div>
                    <div className="flex items-center space-x-0.5 mt-0.5 px-1.5 py-0.5 rounded-full bg-slate-900/95 border border-slate-700 text-[9px] font-bold text-white shadow-md">
                      <MapPin className="w-2.5 h-2.5 text-sky-400 shrink-0" />
                      <span className="truncate max-w-[70px]">{localizedCity}</span>
                    </div>
                  </button>
                </foreignObject>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

