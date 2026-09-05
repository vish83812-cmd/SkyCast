import React from 'react';
import {
  AlertTriangle,
  Droplets,
  Wind,
  Sun,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  Calendar,
  Activity,
} from 'lucide-react';
import { FullWeatherData, Language, SpeedUnit, TemperatureUnit } from '../types';
import {
  formatDateFull,
  formatSpeed,
  formatTemp,
  formatTime,
  getCpcbAqiInfo,
  getUvCategory,
  getWindDirectionName,
} from '../utils/formatters';
import { getLocalizedCityName, getTranslation, translateCondition } from '../utils/translations';
import { WeatherIcon } from './WeatherIcon';

interface CurrentConditionsCardProps {
  weather: FullWeatherData;
  tempUnit: TemperatureUnit;
  speedUnit: SpeedUnit;
  language: Language;
}

export const CurrentConditionsCard: React.FC<CurrentConditionsCardProps> = ({
  weather,
  tempUnit,
  speedUnit,
  language,
}) => {
  const { current, location, alerts, timezone_offset, airPollution } = weather;
  const condition = current.weather[0] || { main: 'Clear', description: 'clear sky', icon: '01d' };
  const uvInfo = getUvCategory(current.uvi, language);
  const t = getTranslation(language);
  const localizedCity = getLocalizedCityName(location.name, language);
  const aqiInfo = getCpcbAqiInfo(airPollution?.cpcbAqi ?? 75, language);

  return (
    <div className="w-full space-y-4">
      {/* Severe Weather Alert Banner if present */}
      {alerts && alerts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/20 backdrop-blur-md border border-amber-400/40 text-amber-100 flex items-start space-x-3 shadow-xl">
          <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-amber-200">{alerts[0].event}</span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-amber-400/30 text-amber-100 border border-amber-300/40">
                {alerts[0].severity}
              </span>
            </div>
            <p className="text-xs text-amber-100/90 leading-relaxed">{alerts[0].description}</p>
          </div>
        </div>
      )}

      {/* Main Glassmorphic Current Weather Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-6 md:p-8 shadow-2xl text-white">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Location & Primary Temperature */}
          <div className="lg:col-span-6 space-y-4">
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
                  {localizedCity}
                </h1>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-sm">
                  {location.country || 'IN'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-white/70 mt-1 flex items-center space-x-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-white/60" />
                <span>{formatDateFull(current.dt, language)}</span>
                <span>•</span>
                <span>{t.updatedAt}: {formatTime(current.dt, timezone_offset, language)}</span>
              </p>
            </div>

            {/* Temperature & Condition display */}
            <div className="flex items-center space-x-6">
              <div className="flex items-start">
                <span className="text-6xl sm:text-7xl font-black tracking-tighter text-white drop-shadow-md">
                  {formatTemp(current.temp, tempUnit).replace('°C', '').replace('°F', '')}
                </span>
                <span className="text-3xl sm:text-4xl font-bold text-white/90 mt-1 drop-shadow-sm">
                  °{tempUnit}
                </span>
              </div>

              <div className="flex flex-col items-start space-y-1">
                <div className="flex items-center space-x-2">
                  <WeatherIcon
                    condition={condition.main}
                    iconCode={condition.icon}
                    className="w-10 h-10 drop-shadow-sm"
                  />
                  <span className="font-bold text-lg sm:text-xl text-white capitalize drop-shadow-sm">
                    {translateCondition(condition.description, language)}
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-white/75 font-medium">
                  {t.feelsLike}{' '}
                  <span className="text-white font-semibold">
                    {formatTemp(current.feels_like, tempUnit)}
                  </span>{' '}
                  • {t.highLow}: {formatTemp(current.temp_max, tempUnit)} / {formatTemp(current.temp_min, tempUnit)}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Key Meteorological Grid Metrics */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Wind */}
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 flex flex-col justify-between hover:bg-white/15 transition backdrop-blur-sm shadow-sm">
              <div className="flex items-center justify-between text-white/70 text-xs font-medium">
                <span>{t.wind}</span>
                <Wind className="w-4 h-4 text-white" />
              </div>
              <div className="mt-2">
                <div className="text-base font-bold text-white">
                  {formatSpeed(current.wind_speed, speedUnit)}
                </div>
                <div className="text-[11px] text-white/60 mt-0.5">
                  {getWindDirectionName(current.wind_deg)} ({current.wind_deg}°)
                </div>
              </div>
            </div>

            {/* Humidity */}
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 flex flex-col justify-between hover:bg-white/15 transition backdrop-blur-sm shadow-sm">
              <div className="flex items-center justify-between text-white/70 text-xs font-medium">
                <span>{t.humidity}</span>
                <Droplets className="w-4 h-4 text-white" />
              </div>
              <div className="mt-2">
                <div className="text-base font-bold text-white">{current.humidity}%</div>
                <div className="text-[11px] text-white/60 mt-0.5">
                  {t.dewPoint} {formatTemp(current.dew_point, tempUnit)}
                </div>
              </div>
            </div>

            {/* UV Index */}
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 flex flex-col justify-between hover:bg-white/15 transition backdrop-blur-sm shadow-sm">
              <div className="flex items-center justify-between text-white/70 text-xs font-medium">
                <span>{t.uvIndex}</span>
                <Sun className="w-4 h-4 text-yellow-300" />
              </div>
              <div className="mt-2">
                <div className="text-base font-bold text-white">
                  {current.uvi} <span className="text-xs text-white/80 font-normal">({uvInfo.label})</span>
                </div>
                <div className="text-[11px] text-white/60 mt-0.5 line-clamp-1">
                  {uvInfo.advice}
                </div>
              </div>
            </div>

            {/* Visibility */}
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 flex flex-col justify-between hover:bg-white/15 transition backdrop-blur-sm shadow-sm">
              <div className="flex items-center justify-between text-white/70 text-xs font-medium">
                <span>{t.visibility}</span>
                <Eye className="w-4 h-4 text-white" />
              </div>
              <div className="mt-2">
                <div className="text-base font-bold text-white">
                  {(current.visibility / 1000).toFixed(1)} km
                </div>
                <div className="text-[11px] text-white/60 mt-0.5">
                  {current.visibility >= 9000 ? 'Clear vista' : 'Reduced view'}
                </div>
              </div>
            </div>

            {/* Pressure */}
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 flex flex-col justify-between hover:bg-white/15 transition backdrop-blur-sm shadow-sm">
              <div className="flex items-center justify-between text-white/70 text-xs font-medium">
                <span>{t.pressure}</span>
                <Gauge className="w-4 h-4 text-white" />
              </div>
              <div className="mt-2">
                <div className="text-base font-bold text-white">{current.pressure} hPa</div>
                <div className="text-[11px] text-white/60 mt-0.5">
                  {current.pressure >= 1013 ? 'High stability' : 'Low pressure'}
                </div>
              </div>
            </div>

            {/* CPCB AQI */}
            <div className={`p-3.5 rounded-2xl border ${aqiInfo.bg} ${aqiInfo.border} flex flex-col justify-between hover:bg-white/15 transition backdrop-blur-sm shadow-sm`}>
              <div className="flex items-center justify-between text-white/70 text-xs font-medium">
                <span>CPCB AQI</span>
                <Activity className="w-4 h-4 text-emerald-300" />
              </div>
              <div className="mt-2">
                <div className="text-base font-bold text-white">
                  {airPollution?.cpcbAqi ?? 75}
                </div>
                <div className="text-[11px] text-white/80 mt-0.5 font-semibold">
                  {aqiInfo.localizedCategory}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
