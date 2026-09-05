import React from 'react';
import { DailyForecastData, Language, TemperatureUnit } from '../types';
import { formatDateFull, formatDayName, formatTemp } from '../utils/formatters';
import { getTranslation, translateCondition } from '../utils/translations';
import { WeatherIcon } from './WeatherIcon';
import { Droplets, Wind, Sun } from 'lucide-react';

interface DailyForecastStripProps {
  daily: DailyForecastData[];
  tempUnit: TemperatureUnit;
  language: Language;
}

export const DailyForecastStrip: React.FC<DailyForecastStripProps> = ({
  daily,
  tempUnit,
  language,
}) => {
  const t = getTranslation(language);

  return (
    <section className="w-full bg-slate-900/60 backdrop-blur-xl border border-white/20 rounded-3xl p-5 shadow-2xl text-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-extrabold uppercase tracking-wider text-white/90 flex items-center space-x-2">
          <span>{t.forecast7Day}</span>
          <span className="text-[10px] lowercase text-white/60 font-medium">({t.imdVerified})</span>
        </h2>
        <span className="text-xs text-white/60 font-medium">{t.dailyWeatherOutlook}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {daily.map((day, idx) => {
          const isToday = idx === 0;
          const conditionDesc = day.weather[0]?.description || 'Clear sky';
          const conditionMain = day.weather[0]?.main || 'Clear';
          const iconCode = day.weather[0]?.icon || '01d';
          const rainPercent = Math.round(day.pop * 100);

          return (
            <div
              key={day.dt}
              className={`flex flex-col items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 ${
                isToday
                  ? 'bg-sky-500/25 border-sky-400/50 shadow-lg scale-105 z-10'
                  : 'bg-slate-950/40 border-white/10 hover:bg-slate-900/60 hover:border-white/20'
              }`}
            >
              {/* Day header */}
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-white">
                  {formatDayName(day.dt, language)}
                </p>
                <p className="text-[10px] text-white/60 mt-0.5">
                  {new Date(day.dt * 1000).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </p>
              </div>

              {/* Weather Icon & Condition */}
              <div className="my-3 flex flex-col items-center">
                <WeatherIcon
                  condition={conditionMain}
                  iconCode={iconCode}
                  className="w-10 h-10 drop-shadow-md"
                />
                <span className="text-[11px] text-white/80 font-medium text-center line-clamp-1 mt-1 capitalize">
                  {translateCondition(conditionDesc, language)}
                </span>
              </div>

              {/* High & Low Temp */}
              <div className="w-full flex items-center justify-center space-x-2 text-xs pt-1 border-t border-white/10">
                <span className="font-extrabold text-white">
                  {formatTemp(day.temp.max, tempUnit)}
                </span>
                <span className="text-white/60 font-medium">
                  {formatTemp(day.temp.min, tempUnit)}
                </span>
              </div>

              {/* Rainfall and UV tags */}
              <div className="w-full mt-2 flex items-center justify-between text-[10px] text-white/70 px-1">
                <span className="flex items-center space-x-0.5" title="Precipitation Probability">
                  <Droplets className="w-2.5 h-2.5 text-sky-300" />
                  <span>{rainPercent}%</span>
                </span>
                <span className="flex items-center space-x-0.5" title="UV Index">
                  <Sun className="w-2.5 h-2.5 text-amber-300" />
                  <span>{Math.round(day.uvi)}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
