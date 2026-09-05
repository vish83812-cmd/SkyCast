import React from 'react';
import {
  Car,
  Eye,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Compass,
  Zap,
  Gauge,
} from 'lucide-react';
import { FullWeatherData, SpeedUnit, TemperatureUnit } from '../../types';
import { computeCommuterTrafficImpact } from '../../services/weatherService';
import { formatSpeed } from '../../utils/formatters';

interface CommuterPanelProps {
  weather: FullWeatherData;
  tempUnit: TemperatureUnit;
  speedUnit: SpeedUnit;
}

export const CommuterPanel: React.FC<CommuterPanelProps> = ({
  weather,
  speedUnit,
}) => {
  const { current, hourly } = weather;
  const currentCondition = current.weather[0]?.main || 'Clear';
  const rainProb = current.rain_1h ? 0.7 : hourly[0]?.pop || 0.1;

  const traffic = computeCommuterTrafficImpact(
    current.visibility,
    currentCondition,
    rainProb,
    current.wind_speed
  );

  // Commute route alerts
  const getRouteAlert = () => {
    if (current.visibility < 4000) {
      return {
        title: 'Reduced Roadway Visibility / Fog Hazard',
        desc: 'Dense fog or mist patches along low-elevation highway corridors. Use low-beam fog lights and maintain double stopping distance.',
        badge: 'Visibility Hazard',
        color: 'bg-amber-500/20 border-amber-400/30 text-white',
      };
    }
    if (current.wind_speed * 3.6 > 35) {
      return {
        title: 'High Crosswind Advisory on Bridges',
        desc: 'Sustained crosswinds exceeding 35 km/h. High-profile vehicles, vans, and motorcycles should use alternate routes or reduce speed.',
        badge: 'Wind Warning',
        color: 'bg-rose-500/20 border-rose-400/30 text-white',
      };
    }
    return {
      title: 'Optimal Commute Conditions',
      desc: 'Pavements are dry with high optical clarity across arterial highways and transit routes.',
      badge: 'Green Corridors',
      color: 'bg-emerald-500/20 border-emerald-400/30 text-white',
    };
  };

  const routeAlert = getRouteAlert();

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/20">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-white/20 border border-white/30 text-white">
            <Car className="w-5 h-5 text-sky-300" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Daily Commuters & Transit</h3>
            <p className="text-xs text-white/70">
              Weather-induced traffic delays, road visibility, bridge crosswinds, and congestion risk tags
            </p>
          </div>
        </div>
      </div>

      {/* Route Alert Banner */}
      <div className={`p-4 rounded-3xl backdrop-blur-md border ${routeAlert.color} flex items-start space-x-3.5 shadow-xl text-white`}>
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-white/90" />
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-sm text-white">{routeAlert.title}</span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/20 border border-white/30 text-white backdrop-blur-sm">
              {routeAlert.badge}
            </span>
          </div>
          <p className="text-xs text-white/90">{routeAlert.desc}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Congestion Risk Tag & Weather Impact */}
        <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 space-y-4 flex flex-col justify-between shadow-xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Gauge className="w-4 h-4 text-sky-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Congestion Risk
              </span>
            </div>
            <span
              className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${
                traffic.riskLevel === 'High'
                  ? 'bg-rose-500/30 text-rose-200 border-rose-400/40'
                  : traffic.riskLevel === 'Medium'
                  ? 'bg-amber-500/30 text-amber-200 border-amber-400/40'
                  : 'bg-emerald-500/30 text-emerald-200 border-emerald-400/40'
              }`}
            >
              {traffic.riskLevel} Risk
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-black text-white">
              {traffic.impactScore} <span className="text-sm font-normal text-white/70">/ 100 Delay Index</span>
            </div>
            <p className="text-xs text-white/90 leading-relaxed">{traffic.message}</p>
          </div>

          <div className="pt-3 border-t border-white/15 flex justify-between text-xs text-white/70">
            <span>Buffer Time:</span>
            <span className="font-bold text-sky-200">{traffic.delayBuffer}</span>
          </div>
        </div>

        {/* 2. Visibility Distance Reading */}
        <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 space-y-4 flex flex-col justify-between shadow-xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-indigo-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Sightline Visibility
              </span>
            </div>
            <span className="text-xs font-bold text-indigo-200">
              {traffic.visibilityKm >= 9 ? 'Clear Highway' : 'Restricted'}
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-black text-white">
              {traffic.visibilityKm} <span className="text-lg font-medium text-white/70">km</span>
            </div>
            <p className="text-xs text-white/80">
              {traffic.visibilityKm < 3
                ? 'Heavy particulate or mist causing major headlight scatter.'
                : 'Excellent forward sightlines for cruising speeds.'}
            </p>
          </div>

          <div className="pt-3 border-t border-white/15 flex justify-between text-xs text-white/70">
            <span>Optical Status:</span>
            <span className="font-bold text-white">
              {current.clouds > 60 ? 'Overcast / Flat Light' : 'High Contrast Sunshine'}
            </span>
          </div>
        </div>

        {/* 3. Pavement Traction & Hydroplaning */}
        <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 space-y-4 flex flex-col justify-between shadow-xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Tire Traction Index
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-base font-bold text-white">
              {currentCondition === 'Rain' ? 'Wet Pavement / Oil Slick Risk' : 'High Grip Dry Asphalt'}
            </div>
            <p className="text-xs text-white/80">
              {currentCondition === 'Rain'
                ? 'First 20 minutes of rainfall loosens road oil residues. Avoid sudden braking.'
                : 'Optimal tire friction coefficients.'}
            </p>
          </div>

          <div className="pt-3 border-t border-white/15 flex justify-between text-xs text-white/70">
            <span>Hydroplaning Risk:</span>
            <span className={`font-bold ${currentCondition === 'Rain' ? 'text-amber-300' : 'text-emerald-300'}`}>
              {currentCondition === 'Rain' ? 'Elevated at >80 km/h' : 'Minimal'}
            </span>
          </div>
        </div>

        {/* 4. Crosswind & Bridge Status */}
        <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 space-y-4 flex flex-col justify-between shadow-xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-teal-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Bridge Crosswinds
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xl font-bold text-white">
              {formatSpeed(current.wind_speed, speedUnit)}
            </div>
            <p className="text-xs text-white/80">
              Lateral wind vector angle: {current.wind_deg}°
            </p>
          </div>

          <div className="pt-3 border-t border-white/15 flex justify-between text-xs text-white/70">
            <span>Overpass Stability:</span>
            <span className="font-bold text-emerald-300">Stable</span>
          </div>
        </div>
      </div>
    </div>
  );
};
