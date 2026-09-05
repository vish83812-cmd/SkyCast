import React, { useState } from 'react';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Droplets,
  Wind,
  Sun,
  Clock,
} from 'lucide-react';
import { DailyForecast, HourlyForecast, Language, SpeedUnit, TemperatureUnit } from '../types';
import {
  formatDayName,
  formatSpeed,
  formatTemp,
  formatTime,
} from '../utils/formatters';
import { getTranslation, translateCondition } from '../utils/translations';
import { WeatherIcon } from './WeatherIcon';

interface ForecastStripProps {
  daily: DailyForecast[];
  hourly: HourlyForecast[];
  tempUnit: TemperatureUnit;
  speedUnit: SpeedUnit;
  timezoneOffset: number;
  language: Language;
}

export const ForecastStrip: React.FC<ForecastStripProps> = ({
  daily,
  hourly,
  tempUnit,
  speedUnit,
  timezoneOffset,
  language,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(0);
  const t = getTranslation(language);

  // Calculate global min and max across all 7 days for temperature bar normalization
  const globalMin = Math.min(...daily.map((d) => d.temp.min));
  const globalMax = Math.max(...daily.map((d) => d.temp.max));
  const tempRange = Math.max(1, globalMax - globalMin);

  return (
    <div className="w-full rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-5 md:p-6 shadow-xl text-white space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-white" />
          <h3 className="font-bold text-sm uppercase tracking-wider text-white">
            {t.forecast7Day}
          </h3>
        </div>
        <span className="text-xs text-white/70">
          {t.dailyWeatherOutlook}
        </span>
      </div>

      {/* 7-Day Horizontal Strip Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {daily.map((day, idx) => {
          const isSelected = selectedDayIndex === idx;
          const condition = day.weather[0] || { main: 'Clear', description: 'clear sky', icon: '01d' };
          const minPos = ((day.temp.min - globalMin) / tempRange) * 100;
          const maxPos = ((day.temp.max - globalMin) / tempRange) * 100;

          return (
            <button
              key={day.dt}
              onClick={() => setSelectedDayIndex(isSelected ? null : idx)}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between backdrop-blur-md ${
                isSelected
                  ? 'bg-white/30 border-white/50 shadow-lg ring-1 ring-white/40 scale-102 text-white'
                  : 'bg-white/10 hover:bg-white/20 border-white/15 text-white/90'
              }`}
            >
              {/* Day & Rain badge */}
              <div className="flex items-center justify-between w-full">
                <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-white/90'}`}>
                  {formatDayName(day.dt, language)}
                </span>
                {day.pop > 0.15 && (
                  <span className="flex items-center space-x-0.5 text-[10px] font-semibold text-white bg-white/20 px-1.5 py-0.5 rounded-full border border-white/20">
                    <Droplets className="w-2.5 h-2.5" />
                    <span>{Math.round(day.pop * 100)}%</span>
                  </span>
                )}
              </div>

              {/* Weather Icon & Condition */}
              <div className="my-3 flex flex-col items-center justify-center">
                <WeatherIcon
                  condition={condition.main}
                  iconCode={condition.icon}
                  className="w-8 h-8 mb-1 drop-shadow-sm"
                />
                <span className="text-[11px] text-white/75 text-center line-clamp-1 capitalize font-medium">
                  {translateCondition(condition.description, language)}
                </span>
              </div>

              {/* Temperatures & relative scale bar */}
              <div className="space-y-1.5 w-full">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-white">{formatTemp(day.temp.max, tempUnit)}</span>
                  <span className="text-white/60 text-[11px]">{formatTemp(day.temp.min, tempUnit)}</span>
                </div>
                {/* Visual range temperature line */}
                <div className="w-full bg-white/20 h-1.5 rounded-full relative overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-200 via-amber-200 to-rose-300"
                    style={{
                      left: `${Math.max(0, minPos)}%`,
                      width: `${Math.max(15, maxPos - minPos)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Toggle indicator */}
              <div className="mt-2 pt-1 border-t border-white/15 flex items-center justify-center text-[10px] text-white/70">
                {isSelected ? (
                  <span className="flex items-center space-x-1 text-white font-semibold">
                    <span>{language === 'hi' ? 'विस्तारित' : 'Expanded'}</span>
                    <ChevronUp className="w-3 h-3" />
                  </span>
                ) : (
                  <span className="flex items-center space-x-1 hover:text-white">
                    <span>{language === 'hi' ? 'घंटेवार' : 'Hourly'}</span>
                    <ChevronDown className="w-3 h-3" />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Expanded 24-Hour Timeline for Selected Day */}
      {selectedDayIndex !== null && daily[selectedDayIndex] && (
        <div className="mt-4 pt-4 border-t border-white/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-white" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                {language === 'hi' ? 'घंटेवार प्रगति' : 'Hourly Progression'} ({formatDayName(daily[selectedDayIndex].dt, language)})
              </h4>
            </div>
            <span className="text-xs text-white/70 italic">
              {daily[selectedDayIndex].summary || 'Comfortable meteorological trends through the period.'}
            </span>
          </div>

          {/* Horizontal scrollable hourly strip */}
          <div className="flex space-x-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
            {hourly.slice(0, 16).map((h, i) => {
              const hCond = h.weather[0] || { main: 'Clear', description: 'clear sky', icon: '01d' };
              return (
                <div
                  key={i}
                  className="shrink-0 w-24 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-between space-y-2 text-center shadow-sm"
                >
                  <span className="text-xs font-medium text-white/80">
                    {formatTime(h.dt, timezoneOffset, language)}
                  </span>
                  <WeatherIcon
                    condition={hCond.main}
                    iconCode={hCond.icon}
                    className="w-7 h-7 drop-shadow-sm"
                  />
                  <div className="font-bold text-sm text-white">
                    {formatTemp(h.temp, tempUnit)}
                  </div>
                  <div className="space-y-1 w-full pt-1 border-t border-white/10 text-[10px]">
                    <div className="flex items-center justify-center space-x-1 text-white font-semibold">
                      <Droplets className="w-2.5 h-2.5" />
                      <span>{Math.round(h.pop * 100)}%</span>
                    </div>
                    <div className="text-white/60">
                      {formatSpeed(h.wind_speed, speedUnit)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
