import React, { useState } from 'react';
import { X, Thermometer, Activity, CloudRain } from 'lucide-react';
import { Language, LocationData, TemperatureUnit } from '../types';
import { getTranslation } from '../utils/translations';
import { IndiaGeoMapCanvas } from './IndiaGeoMapCanvas';

interface IndiaWeatherMapProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: LocationData;
  onSelectLocation: (loc: LocationData) => void;
  language: Language;
  tempUnit: TemperatureUnit;
}

export const IndiaWeatherMap: React.FC<IndiaWeatherMapProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
  language,
  tempUnit,
}) => {
  const [activeMetric, setActiveMetric] = useState<'temp' | 'aqi' | 'rain'>('temp');
  const t = getTranslation(language);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-7 shadow-2xl text-white space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
              <span>{t.weatherMap}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                All Indian Regions
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Interactive meteorological radar across Northern, Southern, Eastern, Western & North-Eastern India
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metric Layer Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Map Layer:</span>
            <button
              onClick={() => setActiveMetric('temp')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center space-x-1.5 ${
                activeMetric === 'temp'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Thermometer className="w-3.5 h-3.5" />
              <span>Temperature</span>
            </button>
            <button
              onClick={() => setActiveMetric('aqi')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center space-x-1.5 ${
                activeMetric === 'aqi'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>CPCB AQI</span>
            </button>
            <button
              onClick={() => setActiveMetric('rain')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center space-x-1.5 ${
                activeMetric === 'rain'
                  ? 'bg-sky-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span>Rainfall Probability</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400">
            Click any pin to inspect that city
          </div>
        </div>

        {/* Map Canvas / Grid Stage */}
        <div className="relative w-full aspect-[4/3] max-h-[460px] bg-slate-950/90 rounded-3xl border border-slate-800/90 overflow-hidden flex items-center justify-center p-2">
          <IndiaGeoMapCanvas
            currentLocation={currentLocation}
            onSelectLocation={onSelectLocation}
            language={language}
            tempUnit={tempUnit}
            activeMetric={activeMetric}
            onCityClick={() => onClose()}
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-white">Legend:</span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
              <span>Good (0-50)</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              <span>Moderate (101-200)</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              <span>Poor / Severe (201+)</span>
            </span>
          </div>

          <div className="text-[11px] text-slate-500">
            Source: IMD & CPCB Station Network
          </div>
        </div>
      </div>
    </div>
  );
};
