import React from 'react';
import { CloudRain, Droplets, Wind } from 'lucide-react';
import { FullWeatherData, Language } from '../types';
import { getTranslation } from '../utils/translations';

interface MonsoonBannerProps {
  weather: FullWeatherData;
  language: Language;
}

export const MonsoonBanner: React.FC<MonsoonBannerProps> = ({ weather, language }) => {
  const currentMonth = new Date().getMonth(); // 5 = June, 8 = September
  const isMonsoonSeason = currentMonth >= 5 && currentMonth <= 8;

  // If outside monsoon season, return null
  if (!isMonsoonSeason) return null;

  const t = getTranslation(language);
  const totalRain7Days = weather.daily.reduce((acc, d) => acc + (d.rain || 0), 0);
  const maxRainProb = Math.max(...weather.daily.map((d) => d.pop));

  return (
    <div className="w-full bg-gradient-to-r from-sky-600/30 via-indigo-600/30 to-blue-700/30 backdrop-blur-md border border-sky-300/40 rounded-3xl p-4 sm:p-5 shadow-2xl text-white animate-in fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 rounded-2xl bg-sky-400/20 border border-sky-300/40 shrink-0 text-sky-200">
            <CloudRain className="w-6 h-6 animate-bounce" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-sm sm:text-base text-white">
                {t.monsoonBannerTitle}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-400/30 text-sky-100 border border-sky-300/40">
                IMD Southwest Tracker
              </span>
            </div>
            <p className="text-xs text-white/80 max-w-3xl leading-relaxed">
              {t.monsoonBannerMsg}
            </p>
          </div>
        </div>

        {/* Real-time Monsoon Indicators */}
        <div className="flex items-center space-x-3 text-xs shrink-0 self-stretch md:self-auto justify-between md:justify-end bg-white/10 p-3 rounded-2xl border border-white/20">
          <div className="flex items-center space-x-2">
            <Droplets className="w-4 h-4 text-sky-300" />
            <div>
              <div className="text-[10px] text-white/60">7-Day Rainfall</div>
              <div className="font-bold text-white">{totalRain7Days.toFixed(1)} mm</div>
            </div>
          </div>
          <div className="h-6 w-px bg-white/20" />
          <div className="flex items-center space-x-2">
            <Wind className="w-4 h-4 text-teal-300" />
            <div>
              <div className="text-[10px] text-white/60">Peak Rain Chance</div>
              <div className="font-bold text-white">{Math.round(maxRainProb * 100)}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
