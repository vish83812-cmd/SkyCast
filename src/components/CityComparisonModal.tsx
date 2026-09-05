import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Layers,
  Thermometer,
  Activity,
  CloudRain,
  Wind,
  Droplets,
  Sun,
  Loader2,
  CheckCircle2,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { FullWeatherData, Language, LocationData, TemperatureUnit, SpeedUnit } from '../types';
import { POPULAR_LOCATIONS, fetchWeatherData } from '../services/weatherService';
import { formatSpeed, formatTemp, getCpcbAqiInfo } from '../utils/formatters';
import { getLocalizedCityName, getTranslation, translateCondition } from '../utils/translations';
import { WeatherIcon } from './WeatherIcon';

interface CityComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: LocationData;
  onSelectLocation: (loc: LocationData) => void;
  language: Language;
  tempUnit: TemperatureUnit;
  speedUnit: SpeedUnit;
  favorites: LocationData[];
}

interface ComparedCityData {
  location: LocationData;
  weather: FullWeatherData | null;
  loading: boolean;
  error?: string;
}

export const CityComparisonModal: React.FC<CityComparisonModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
  language,
  tempUnit,
  speedUnit,
  favorites,
}) => {
  const getInitialCities = (): LocationData[] => {
    const list: LocationData[] = [currentLocation];
    for (const pop of POPULAR_LOCATIONS) {
      if (list.length >= 3) break;
      if (!list.some((c) => c.name.toLowerCase() === pop.name.toLowerCase())) {
        list.push(pop);
      }
    }
    return list;
  };

  const [selectedCities, setSelectedCities] = useState<LocationData[]>(getInitialCities);

  const [comparedData, setComparedData] = useState<ComparedCityData[]>([]);
  const t = getTranslation(language);

  // Fetch weather data for each selected city
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const fetchAll = async () => {
      // Initialize loading state
      setComparedData(
        selectedCities.map((loc) => ({
          location: loc,
          weather: null,
          loading: true,
        }))
      );

      const results = await Promise.all(
        selectedCities.map(async (loc) => {
          try {
            const data = await fetchWeatherData(loc);
            return {
              location: loc,
              weather: data,
              loading: false,
            };
          } catch (err: any) {
            return {
              location: loc,
              weather: null,
              loading: false,
              error: err.message || 'Failed to fetch',
            };
          }
        })
      );

      if (isMounted) {
        setComparedData(results);
      }
    };

    fetchAll();

    return () => {
      isMounted = false;
    };
  }, [isOpen, selectedCities]);

  if (!isOpen) return null;

  const handleAddCity = (city: LocationData) => {
    if (selectedCities.some((c) => c.name.toLowerCase() === city.name.toLowerCase())) return;
    if (selectedCities.length < 3) {
      setSelectedCities([...selectedCities, city]);
    } else {
      setSelectedCities([selectedCities[0], selectedCities[1], city]);
    }
  };

  const handleRemoveCity = (cityName: string) => {
    if (selectedCities.length <= 1) return;
    setSelectedCities(selectedCities.filter((c) => c.name.toLowerCase() !== cityName.toLowerCase()));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-700/90 rounded-3xl p-5 sm:p-7 shadow-2xl text-white space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-sky-500/20 border border-sky-400/30 text-sky-300">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {t.compareCities}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Compare temperatures, CPCB AQI levels, and precipitation risks across Indian destinations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* City Selection Pills */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Select 2 or 3 Indian Hubs to Compare:
          </div>
          <div className="flex flex-wrap gap-2">
            {POPULAR_LOCATIONS.map((city) => {
              const isSelected = selectedCities.some(
                (c) => c.name.toLowerCase() === city.name.toLowerCase()
              );
              return (
                <button
                  key={city.name}
                  onClick={() =>
                    isSelected ? handleRemoveCity(city.name) : handleAddCity(city)
                  }
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-sky-500 border-sky-300 text-slate-950 font-bold shadow-md'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <span>{getLocalizedCityName(city.name, language)}</span>
                  {isSelected && <X className="w-3 h-3" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Comparison Grid (Side-by-Side Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {comparedData.map((item, idx) => {
            const loc = item.location;
            const weather = item.weather;
            const localizedCity = getLocalizedCityName(loc.name, language);

            return (
              <div
                key={`${loc.name}-${idx}`}
                className="bg-slate-950/70 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 relative flex flex-col justify-between"
              >
                {/* City Title */}
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <MapPin className="w-4 h-4 text-sky-400" />
                        <h3 className="font-extrabold text-lg text-white">
                          {localizedCity}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400 ml-5">{loc.state || 'India'}</p>
                    </div>

                    <button
                      onClick={() => {
                        onSelectLocation(loc);
                        onClose();
                      }}
                      className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center space-x-1 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-400/30"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {item.loading ? (
                    <div className="py-16 flex flex-col items-center justify-center space-y-2 text-slate-400">
                      <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
                      <span className="text-xs">Fetching live IMD / CPCB data...</span>
                    </div>
                  ) : weather ? (
                    <div className="space-y-4 pt-3">
                      {/* Current Temp & Condition */}
                      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800">
                        <div className="flex items-center space-x-3">
                          <WeatherIcon
                            condition={weather.current.weather[0]?.main || 'Clear'}
                            iconCode={weather.current.weather[0]?.icon || '01d'}
                            className="w-10 h-10"
                          />
                          <div>
                            <div className="text-2xl font-black text-white">
                              {formatTemp(weather.current.temp, tempUnit)}
                            </div>
                            <div className="text-xs text-slate-400 capitalize">
                              {translateCondition(
                                weather.current.weather[0]?.description || 'Clear sky',
                                language
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right text-xs text-slate-400">
                          <div>Feels: <strong className="text-white">{formatTemp(weather.current.feels_like, tempUnit)}</strong></div>
                          <div>H: {formatTemp(weather.current.temp_max, tempUnit)} / L: {formatTemp(weather.current.temp_min, tempUnit)}</div>
                        </div>
                      </div>

                      {/* CPCB Air Quality */}
                      {(() => {
                        const aqiInfo = getCpcbAqiInfo(weather.airPollution.cpcbAqi, language);
                        return (
                          <div className={`p-3 rounded-2xl border ${aqiInfo.bg} ${aqiInfo.border}`}>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-slate-300">CPCB AQI Index:</span>
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${aqiInfo.badgeBg}`}>
                                {weather.airPollution.cpcbAqi} · {aqiInfo.localizedCategory}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-300 mt-1 line-clamp-1">
                              Prominent: {weather.airPollution.prominentPollutant}
                            </div>
                          </div>
                        );
                      })()}

                      {/* Meteorological Metrics Breakdown */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                          <span className="text-slate-400 flex items-center space-x-1">
                            <CloudRain className="w-3.5 h-3.5 text-sky-400" />
                            <span>Rain Risk</span>
                          </span>
                          <span className="font-bold text-white">
                            {Math.round((weather.daily[0]?.pop || 0) * 100)}%
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                          <span className="text-slate-400 flex items-center space-x-1">
                            <Droplets className="w-3.5 h-3.5 text-blue-400" />
                            <span>Humidity</span>
                          </span>
                          <span className="font-bold text-white">{weather.current.humidity}%</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                          <span className="text-slate-400 flex items-center space-x-1">
                            <Wind className="w-3.5 h-3.5 text-slate-300" />
                            <span>Wind</span>
                          </span>
                          <span className="font-bold text-white">
                            {formatSpeed(weather.current.wind_speed, speedUnit)}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                          <span className="text-slate-400 flex items-center space-x-1">
                            <Sun className="w-3.5 h-3.5 text-amber-400" />
                            <span>UV Index</span>
                          </span>
                          <span className="font-bold text-white">{weather.current.uvi}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-xs text-rose-400">
                      {item.error || 'Unable to load weather metrics'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
