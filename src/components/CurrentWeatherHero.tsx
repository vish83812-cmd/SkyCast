import React from 'react';
import {
  MapPin,
  Wind,
  Droplets,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  Calendar,
  Activity,
  Compass,
} from 'lucide-react';
import { FullWeatherData, Language, SpeedUnit, TemperatureUnit } from '../types';
import {
  formatDateFull,
  formatSpeed,
  formatTemp,
  formatTime,
  getCpcbAqiInfo,
  getWindDirectionName,
} from '../utils/formatters';
import { getLocalizedCityName, getTranslation, translateCondition } from '../utils/translations';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherHeroProps {
  weather: FullWeatherData;
  tempUnit: TemperatureUnit;
  speedUnit: SpeedUnit;
  language: Language;
}

export const CurrentWeatherHero: React.FC<CurrentWeatherHeroProps> = ({
  weather,
  tempUnit,
  speedUnit,
  language,
}) => {
  const { current, location, airPollution } = weather;
  const t = getTranslation(language);

  const mainWeather = current.weather[0]?.main || 'Clear';
  const description = current.weather[0]?.description || 'Clear sky';
  const iconCode = current.weather[0]?.icon || '01d';

  const localizedCity = getLocalizedCityName(location.name, language);
  const aqiInfo = getCpcbAqiInfo(airPollution.cpcbAqi, language);

  // Dynamic condition-aware background gradient
  const getDynamicGradient = () => {
    const mainLower = mainWeather.toLowerCase();
    if (mainLower.includes('thunderstorm') || mainLower.includes('tornado')) {
      return 'from-slate-950/80 via-purple-950/70 to-slate-900/80 border-purple-500/30';
    }
    if (mainLower.includes('rain') || mainLower.includes('drizzle')) {
      return 'from-blue-950/80 via-cyan-950/70 to-slate-900/80 border-cyan-500/30';
    }
    if (mainLower.includes('snow')) {
      return 'from-slate-900/80 via-sky-950/70 to-slate-900/80 border-sky-400/30';
    }
    if (mainLower.includes('cloud')) {
      return 'from-slate-900/75 via-indigo-950/65 to-slate-900/75 border-indigo-400/30';
    }
    if (mainLower.includes('mist') || mainLower.includes('fog') || mainLower.includes('haze')) {
      return 'from-stone-900/80 via-slate-900/70 to-stone-900/80 border-stone-500/30';
    }
    // Clear / Sunny (Golden day or twilight starfield)
    return 'from-sky-900/60 via-indigo-950/60 to-slate-900/70 border-white/20';
  };

  return (
    <section
      className={`w-full bg-gradient-to-br ${getDynamicGradient()} backdrop-blur-2xl border rounded-3xl p-6 md:p-8 shadow-2xl text-white relative overflow-hidden`}
    >
      {/* Background Decorative Blur Orb */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-stretch justify-between gap-6">
        {/* Left Column: Location, Condition, Temperature */}
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-sky-400" />
              <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white drop-shadow-sm">
                {localizedCity}
              </h1>
              <span className="text-xs uppercase px-2 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold text-white/80">
                India
              </span>
            </div>
            <p className="text-sm text-white/70 ml-7 mt-0.5">
              {location.state ? `${location.state}, ` : ''}India ({location.lat.toFixed(2)}°N, {location.lon.toFixed(2)}°E)
            </p>
            <p className="text-xs text-white/60 ml-7 mt-1 flex items-center space-x-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-white/50" />
              <span>{formatDateFull(current.dt, language)}</span>
              <span>•</span>
              <span>{t.updatedAt}: {formatTime(current.dt, weather.timezone_offset, language)}</span>
            </p>
          </div>

          {/* Large Hero Temp & Visual Icon */}
          <div className="flex items-center space-x-6 pt-2">
            <div className="relative">
              <WeatherIcon
                condition={mainWeather}
                iconCode={iconCode}
                className="w-20 h-20 md:w-28 md:h-28 drop-shadow-xl"
              />
            </div>
            <div>
              <div className="text-5xl md:text-7xl font-black tracking-tighter text-white drop-shadow-md">
                {formatTemp(current.temp, tempUnit)}
              </div>
              <div className="text-base md:text-xl font-bold text-white/90 capitalize flex items-center space-x-2">
                <span>{translateCondition(description, language)}</span>
              </div>
              <div className="text-xs text-white/70 font-medium mt-1">
                {t.feelsLike} <strong className="text-white font-bold">{formatTemp(current.feels_like, tempUnit)}</strong> · {t.highLow}: {formatTemp(current.temp_max, tempUnit)} / {formatTemp(current.temp_min, tempUnit)}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: CPCB AQI Banner & Key Meteorological Metrics */}
        <div className="w-full lg:w-96 flex flex-col justify-between gap-4">
          {/* CPCB National Air Quality Index Pill */}
          <div className={`p-4 rounded-2xl border ${aqiInfo.bg} ${aqiInfo.border} backdrop-blur-md shadow-lg space-y-2`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 font-bold text-xs uppercase tracking-wider text-white">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>{t.cpcbNationalAqi}</span>
              </div>
              <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${aqiInfo.badgeBg} shadow-sm`}>
                {airPollution.cpcbAqi} · {aqiInfo.localizedCategory}
              </span>
            </div>

            <p className="text-xs text-white/90 leading-relaxed font-medium">
              {aqiInfo.description}
            </p>

            <div className="text-[10px] text-white/70 flex items-center justify-between pt-1 border-t border-white/10 font-mono">
              <span>PM2.5: {airPollution.components.pm2_5} µg/m³</span>
              <span>PM10: {airPollution.components.pm10} µg/m³</span>
              <span>NO₂: {airPollution.components.no2} µg/m³</span>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2 text-xs">
            {/* Humidity */}
            <div className="p-3 rounded-2xl bg-black/25 border border-white/10 flex items-center space-x-2.5">
              <Droplets className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <div className="text-[10px] uppercase font-bold text-white/60">{t.humidity}</div>
                <div className="text-sm font-black text-white">{current.humidity}%</div>
              </div>
            </div>

            {/* Wind Speed & Direction */}
            <div className="p-3 rounded-2xl bg-black/25 border border-white/10 flex items-center space-x-2.5">
              <Wind className="w-4 h-4 text-teal-300 shrink-0" />
              <div>
                <div className="text-[10px] uppercase font-bold text-white/60">{t.wind}</div>
                <div className="text-sm font-black text-white">
                  {formatSpeed(current.wind_speed, speedUnit)}{' '}
                  <span className="text-[10px] font-normal text-white/70">
                    ({getWindDirectionName(current.wind_deg)})
                  </span>
                </div>
              </div>
            </div>

            {/* Pressure */}
            <div className="p-3 rounded-2xl bg-black/25 border border-white/10 flex items-center space-x-2.5">
              <Gauge className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <div className="text-[10px] uppercase font-bold text-white/60">{t.pressure}</div>
                <div className="text-sm font-black text-white">{current.pressure} hPa</div>
              </div>
            </div>

            {/* Visibility */}
            <div className="p-3 rounded-2xl bg-black/25 border border-white/10 flex items-center space-x-2.5">
              <Eye className="w-4 h-4 text-amber-300 shrink-0" />
              <div>
                <div className="text-[10px] uppercase font-bold text-white/60">{t.visibility}</div>
                <div className="text-sm font-black text-white">
                  {(current.visibility / 1000).toFixed(1)} km
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
