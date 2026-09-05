import React, { useState } from 'react';
import {
  CloudRain,
  Flame,
  Snowflake,
  Wind,
  AlertTriangle,
  ChevronRight,
  ShieldAlert,
  Droplets,
  ExternalLink,
  X,
} from 'lucide-react';
import { FullWeatherData, Language } from '../types';
import { getTranslation } from '../utils/translations';

interface SeasonalAdvisoryBannerProps {
  weather: FullWeatherData;
  language: Language;
  isDarkMode?: boolean;
}

export const SeasonalAdvisoryBanner: React.FC<SeasonalAdvisoryBannerProps> = ({
  weather,
  language,
  isDarkMode = true,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  if (isDismissed) return null;

  const t = getTranslation(language);
  const month = new Date().getMonth(); // 0 = Jan, 11 = Dec
  const { current, daily } = weather;

  // Determine active seasonal advisory type:
  // 1. Monsoon: June (5) to September (8)
  // 2. Heatwave: April (3) to June (5) or Temp >= 38°C
  // 3. Winter Cold Wave & Dense Fog: November (10) to February (1) or (temp < 14°C & visibility < 3000)
  // 4. Post-Monsoon Cyclone Watch: October (9) to December (11) near coastal regions

  let bannerType: 'monsoon' | 'heatwave' | 'winterFog' | 'cyclone' = 'monsoon';

  if (current.temp >= 38 || (month >= 3 && month <= 5 && current.temp >= 34)) {
    bannerType = 'heatwave';
  } else if (month >= 5 && month <= 8) {
    bannerType = 'monsoon';
  } else if (month >= 9 && month <= 11 && (weather.location.lon < 75 || weather.location.lon > 80)) {
    bannerType = 'cyclone';
  } else if (month >= 10 || month <= 1 || current.visibility < 3000) {
    bannerType = 'winterFog';
  }

  // Aggregate stats
  const total7DayRain = Math.round(
    daily.reduce((sum, day) => sum + (day.rain || 0), 0) * 10
  ) / 10;
  const maxRainProbability = Math.max(
    ...daily.map((day) => Math.round(day.pop * 100))
  );

  const getBannerDetails = () => {
    const protocols = t.safetyProtocols?.[bannerType] || [];
    const badgeText = t.advisoryBadges?.[bannerType] || 'Advisory';

    switch (bannerType) {
      case 'heatwave':
        return {
          title: t.heatwaveBannerTitle,
          message: t.heatwaveBannerMsg,
          icon: <Flame className="w-5 h-5 shrink-0 text-amber-300" />,
          bg: isDarkMode
            ? 'bg-gradient-to-r from-amber-950/80 via-orange-950/70 to-rose-950/80 border-amber-500/40 text-white'
            : 'bg-amber-600/25 border-amber-300/40 text-white shadow-xl',
          badgeText,
          badgeStyle: 'bg-amber-400/25 text-amber-200 border-amber-300/40 font-bold',
          tips: protocols,
          iconContainer: 'bg-amber-500/20 border-amber-400/30 text-amber-300',
          accentText: 'text-amber-300',
        };
      case 'winterFog':
        return {
          title: t.winterFogBannerTitle,
          message: t.winterFogBannerMsg,
          icon: <Snowflake className="w-5 h-5 shrink-0 text-sky-300" />,
          bg: isDarkMode
            ? 'bg-gradient-to-r from-slate-950/90 via-indigo-950/70 to-slate-900/80 border-indigo-400/40 text-white'
            : 'bg-indigo-600/25 border-indigo-300/40 text-white shadow-xl',
          badgeText,
          badgeStyle: 'bg-sky-400/25 text-sky-200 border-sky-300/40 font-bold',
          tips: protocols,
          iconContainer: 'bg-indigo-500/20 border-indigo-400/30 text-sky-300',
          accentText: 'text-sky-300',
        };
      case 'cyclone':
        return {
          title: t.cycloneBannerTitle,
          message: t.cycloneBannerMsg,
          icon: <Wind className="w-5 h-5 shrink-0 text-cyan-300" />,
          bg: isDarkMode
            ? 'bg-gradient-to-r from-cyan-950/90 via-blue-950/80 to-slate-950/80 border-cyan-400/40 text-white'
            : 'bg-teal-600/25 border-cyan-300/40 text-white shadow-xl',
          badgeText,
          badgeStyle: 'bg-cyan-400/25 text-cyan-200 border-cyan-300/40 font-bold',
          tips: protocols,
          iconContainer: 'bg-teal-500/20 border-cyan-400/30 text-cyan-300',
          accentText: 'text-cyan-300',
        };
      case 'monsoon':
      default:
        return {
          title: t.monsoonBannerTitle,
          message: t.monsoonBannerMsg,
          icon: <CloudRain className="w-5 h-5 shrink-0 text-sky-300" />,
          bg: isDarkMode
            ? 'bg-gradient-to-r from-blue-950/85 via-indigo-950/75 to-slate-950/85 border-sky-400/40 text-white'
            : 'bg-blue-600/25 border-sky-300/40 text-white shadow-xl',
          badgeText,
          badgeStyle: 'bg-sky-400/25 text-sky-200 border-sky-300/40 font-bold',
          tips: protocols,
          iconContainer: 'bg-sky-500/20 border-sky-400/30 text-sky-300',
          accentText: 'text-sky-300',
        };
    }
  };

  const details = getBannerDetails();

  return (
    <div className={`w-full rounded-3xl ${details.bg} backdrop-blur-xl border p-4 md:p-5 shadow-2xl transition-all`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3.5">
          <div className={`p-2.5 rounded-2xl ${details.iconContainer} border shrink-0 mt-0.5 shadow-md`}>
            {details.icon}
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-extrabold text-base md:text-lg tracking-tight text-white drop-shadow-sm">
                {details.title}
              </h3>
              <span className={`text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border backdrop-blur-sm shadow-sm ${details.badgeStyle}`}>
                {details.badgeText}
              </span>
            </div>
            <p className="text-xs md:text-sm leading-relaxed max-w-4xl text-white/90 font-normal">
              {details.message}
            </p>

            {/* Quick stats strip */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-white/90">
              {bannerType === 'monsoon' && (
                <>
                  <div className="flex items-center space-x-1.5 font-medium px-2.5 py-1 rounded-xl border bg-white/15 border-white/20 text-white backdrop-blur-sm shadow-sm">
                    <Droplets className="w-3.5 h-3.5 text-sky-300" />
                    <span>{t.advisoryStats?.rainTotal7Day || '7-Day Rain Total'}: <strong className="font-bold text-white">{total7DayRain} mm</strong></span>
                  </div>
                  <div className="flex items-center space-x-1.5 font-medium px-2.5 py-1 rounded-xl border bg-white/15 border-white/20 text-white backdrop-blur-sm shadow-sm">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
                    <span>{t.advisoryStats?.peakPrecipRisk || 'Peak Precip Risk'}: <strong className="font-bold text-white">{maxRainProbability}%</strong></span>
                  </div>
                </>
              )}
              {bannerType === 'heatwave' && (
                <div className="flex items-center space-x-1.5 font-medium px-2.5 py-1 rounded-xl border bg-white/15 border-white/20 text-white backdrop-blur-sm shadow-sm">
                  <Flame className="w-3.5 h-3.5 text-amber-300" />
                  <span>{t.advisoryStats?.heatIndex || 'Heat Index'}: <strong className="font-bold text-white">{Math.round(current.feels_like)}°C</strong></span>
                </div>
              )}
              {bannerType === 'winterFog' && (
                <div className="flex items-center space-x-1.5 font-medium px-2.5 py-1 rounded-xl border bg-white/15 border-white/20 text-white backdrop-blur-sm shadow-sm">
                  <Snowflake className="w-3.5 h-3.5 text-sky-300" />
                  <span>{t.advisoryStats?.visibilityRange || 'Visibility'}: <strong className="font-bold text-white">{(current.visibility / 1000).toFixed(1)} km</strong></span>
                </div>
              )}
              {bannerType === 'cyclone' && (
                <div className="flex items-center space-x-1.5 font-medium px-2.5 py-1 rounded-xl border bg-white/15 border-white/20 text-white backdrop-blur-sm shadow-sm">
                  <Wind className="w-3.5 h-3.5 text-cyan-300" />
                  <span>{t.advisoryStats?.coastalWindGusts || 'Wind Gusts'}: <strong className="font-bold text-white">{Math.round(current.wind_speed * 3.6)} km/h</strong></span>
                </div>
              )}

              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs font-semibold underline flex items-center space-x-1 transition text-sky-200 hover:text-white decoration-sky-300/60"
              >
                <span>{showDetails ? (t.hideSafetyProtocols || 'Hide Safety Protocols') : (t.viewSafetyProtocols || 'View Safety Protocols')}</span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="p-1.5 rounded-full transition shrink-0 text-white/70 hover:text-white hover:bg-white/15"
          title="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Expanded Safety Checklist */}
      {showDetails && (
        <div className="mt-3.5 pt-3 border-t border-white/20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5 animate-in fade-in duration-200">
          {details.tips.map((tip, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl border bg-white/15 border-white/20 text-white backdrop-blur-md flex items-start space-x-2 text-xs leading-relaxed shadow-sm"
            >
              <ShieldAlert className={`w-4 h-4 shrink-0 mt-0.5 ${details.accentText}`} />
              <span className="text-white/90 font-medium">{tip}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
