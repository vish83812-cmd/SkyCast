import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudFog,
  Wind,
} from 'lucide-react';

interface WeatherIconProps {
  condition: string;
  iconCode?: string;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ condition, iconCode = '01d', className = 'w-6 h-6' }) => {
  const isNight = iconCode.endsWith('n');
  const condLower = condition.toLowerCase();

  if (condLower.includes('thunder') || condLower.includes('lightning')) {
    return <CloudLightning className={`${className} text-amber-400`} />;
  }
  if (condLower.includes('snow') || condLower.includes('sleet') || condLower.includes('ice')) {
    return <CloudSnow className={`${className} text-sky-200`} />;
  }
  if (condLower.includes('rain') || condLower.includes('drizzle') || condLower.includes('shower')) {
    return <CloudRain className={`${className} text-sky-400`} />;
  }
  if (condLower.includes('fog') || condLower.includes('mist') || condLower.includes('haze')) {
    return <CloudFog className={`${className} text-slate-300`} />;
  }
  if (condLower.includes('wind') || condLower.includes('squall')) {
    return <Wind className={`${className} text-teal-300`} />;
  }
  if (condLower.includes('cloud') || iconCode.startsWith('03') || iconCode.startsWith('04')) {
    if (iconCode.startsWith('02')) {
      return isNight ? (
        <CloudMoon className={`${className} text-indigo-300`} />
      ) : (
        <CloudSun className={`${className} text-amber-300`} />
      );
    }
    return <Cloud className={`${className} text-slate-300`} />;
  }

  // Clear / Sunny
  if (isNight) {
    return <Moon className={`${className} text-indigo-300`} />;
  }
  return <Sun className={`${className} text-amber-400 animate-spin-slow`} />;
};
