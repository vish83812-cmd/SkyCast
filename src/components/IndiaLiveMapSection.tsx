import React, { useState } from 'react';
import {
  Thermometer,
  Activity,
  CloudRain,
  Radio,
  Maximize2,
} from 'lucide-react';
import { Language, LocationData, TemperatureUnit } from '../types';
import { getTranslation } from '../utils/translations';
import { IndiaGeoMapCanvas } from './IndiaGeoMapCanvas';

interface IndiaLiveMapSectionProps {
  currentLocation: LocationData;
  onSelectLocation: (loc: LocationData) => void;
  language: Language;
  tempUnit: TemperatureUnit;
  onOpenFullMap?: () => void;
  isDarkMode?: boolean;
}

export const IndiaLiveMapSection: React.FC<IndiaLiveMapSectionProps> = ({
  currentLocation,
  onSelectLocation,
  language,
  tempUnit,
  onOpenFullMap,
  isDarkMode = false,
}) => {
  const [activeMetric, setActiveMetric] = useState<'temp' | 'aqi' | 'rain'>('temp');
  const t = getTranslation(language);

  const handleCityClick = (city: LocationData) => {
    onSelectLocation(city);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      id="india-live-map-section"
      className={`backdrop-blur-xl border rounded-3xl p-4 sm:p-6 shadow-2xl text-white space-y-4 transition-colors ${
        isDarkMode
          ? 'bg-slate-900/80 border-white/20'
          : 'bg-white/15 border-white/25 shadow-xl'
      }`}
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-2xl border shadow-sm ${
              isDarkMode
                ? 'bg-gradient-to-br from-emerald-400/20 to-sky-600/30 border-emerald-400/30 text-emerald-300'
                : 'bg-emerald-400/25 border-emerald-300/40 text-emerald-200'
            }`}>
              <Radio className="w-5 h-5 animate-pulse text-emerald-300" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center space-x-2 drop-shadow-sm">
                <span>{t.weatherMap} · Live India Radar</span>
              </h3>
              <p className="text-xs text-white/80">
                Interactive real-time radar grid across Northern, Southern, Eastern, Western & NE India
              </p>
            </div>
          </div>
        </div>

        {/* Metric Layer Toggles & Fullscreen Button */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          <div className={`p-1 rounded-2xl border flex items-center space-x-1 backdrop-blur-md shadow-inner ${
            isDarkMode ? 'bg-slate-950/80 border-white/10' : 'bg-black/20 border-white/15'
          }`}>
            <button
              onClick={() => setActiveMetric('temp')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                activeMetric === 'temp'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Thermometer className="w-3.5 h-3.5" />
              <span>Temp (°{tempUnit})</span>
            </button>
            <button
              onClick={() => setActiveMetric('aqi')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                activeMetric === 'aqi'
                  ? 'bg-emerald-400 text-slate-950 shadow-md font-extrabold'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>AQI</span>
            </button>
            <button
              onClick={() => setActiveMetric('rain')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                activeMetric === 'rain'
                  ? 'bg-sky-400 text-slate-950 shadow-md font-extrabold'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span>Rain %</span>
            </button>
          </div>

          {onOpenFullMap && (
            <button
              onClick={onOpenFullMap}
              className="px-3 py-1.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-semibold flex items-center space-x-1.5 transition shadow-sm backdrop-blur-md"
              title="Open full interactive map modal"
            >
              <Maximize2 className="w-3.5 h-3.5 text-sky-200" />
              <span className="hidden sm:inline">Expand</span>
            </button>
          )}
        </div>
      </div>

      {/* Map Canvas / Grid Stage */}
      <div className={`relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[480px] rounded-2xl border overflow-hidden flex items-center justify-center p-2 shadow-inner backdrop-blur-md ${
        isDarkMode ? 'bg-slate-950/90 border-white/10' : 'bg-slate-950/40 border-white/15'
      }`}>
        <IndiaGeoMapCanvas
          currentLocation={currentLocation}
          onSelectLocation={handleCityClick}
          language={language}
          tempUnit={tempUnit}
          activeMetric={activeMetric}
        />
      </div>

      {/* Legend & Station Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10 text-xs text-white/70">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold text-white">Legend:</span>
          {activeMetric === 'aqi' ? (
            <>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                <span>Good (0-50)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-lime-400 inline-block" />
                <span>Satisfactory (51-100)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                <span>Moderate (101-200)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                <span>Poor/Severe (201+)</span>
              </span>
            </>
          ) : activeMetric === 'rain' ? (
            <>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
                <span>Active Monsoon Precipitation</span>
              </span>
            </>
          ) : (
            <>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                <span>Current Surface Temperature</span>
              </span>
            </>
          )}
        </div>

        <div className="text-[11px] text-white/50">
          Source: IMD Radar Network & CPCB Air Quality Monitoring Stations
        </div>
      </div>
    </section>
  );
};
