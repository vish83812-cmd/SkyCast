import React from 'react';
import {
  Waves,
  Thermometer,
  Flag,
  Compass,
  Clock,
  ShieldAlert,
  LifeBuoy,
} from 'lucide-react';
import { FullWeatherData, SpeedUnit, TemperatureUnit } from '../../types';
import {
  formatSpeed,
  formatTemp,
  getWindDirectionName,
} from '../../utils/formatters';

interface BeachPanelProps {
  weather: FullWeatherData;
  tempUnit: TemperatureUnit;
  speedUnit: SpeedUnit;
}

export const BeachPanel: React.FC<BeachPanelProps> = ({
  weather,
  tempUnit,
  speedUnit,
}) => {
  const { marine, current } = weather;

  const getFlagDetails = () => {
    switch (marine.safetyFlag) {
      case 'green':
        return {
          title: 'Green Flag: Low Hazard',
          desc: 'Calm conditions. Safe for casual swimming, snorkeling, and entry-level water sports.',
          bg: 'bg-emerald-500/20 border-emerald-400/30 text-white',
          badgeBg: 'bg-emerald-400 text-slate-900',
        };
      case 'yellow':
        return {
          title: 'Yellow Flag: Medium Hazard',
          desc: 'Moderate surf and/or currents. Weak swimmers should stay near shoreline and lifeguard towers.',
          bg: 'bg-amber-500/20 border-amber-400/30 text-white',
          badgeBg: 'bg-amber-300 text-slate-900',
        };
      case 'red':
      default:
        return {
          title: 'Red Flag: High Hazard',
          desc: 'Rough surf, heavy rip currents, or gale winds. Water entry strongly discouraged.',
          bg: 'bg-rose-500/20 border-rose-400/30 text-white',
          badgeBg: 'bg-rose-400 text-slate-900',
        };
    }
  };

  const flagDetails = getFlagDetails();

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/20">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-white/20 border border-white/30 text-white">
            <Waves className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Beachgoers & Marine Surf Report</h3>
            <p className="text-xs text-white/70">
              Sea surface temperature, tide schedule, wave swell mechanics, and safety flags
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center space-x-1 text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-md">
          <LifeBuoy className="w-3.5 h-3.5 text-cyan-300" />
          <span>Coastal Oceanics</span>
        </span>
      </div>

      {/* Beach Safety Flag Alert */}
      <div className={`p-4 rounded-3xl backdrop-blur-md border ${flagDetails.bg} flex items-start space-x-3.5 shadow-xl`}>
        <div className="p-2 rounded-2xl bg-white/20 shrink-0 text-white">
          <Flag className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-white">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-sm">{flagDetails.title}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${flagDetails.badgeBg}`}>
              Active Beach Flag
            </span>
          </div>
          <p className="text-xs text-white/90">{flagDetails.desc}</p>
          <p className="text-[11px] font-medium text-white/80 pt-0.5">
            Advisory: {marine.safetyReason}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Sea Water Temperature */}
        <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 space-y-4 flex flex-col justify-between shadow-xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Thermometer className="w-4 h-4 text-cyan-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Sea Temperature
              </span>
            </div>
            <span className="text-xs font-bold text-cyan-200">
              {marine.waterTemp >= 22 ? 'Warm / Refreshing' : marine.waterTemp >= 17 ? 'Cool / Wetsuit' : 'Cold'}
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-black text-white">
              {formatTemp(marine.waterTemp, tempUnit)}
            </div>
            <p className="text-xs text-white/80">
              {marine.waterTemp >= 23
                ? 'Ideal swimming temperature without neoprene.'
                : marine.waterTemp >= 18
                ? 'Comfortable for active swimming; 2-3mm wetsuit recommended for extended sessions.'
                : 'Cold water shock risk. 4/3mm wetsuit required for surf sessions.'}
            </p>
          </div>

          <div className="pt-3 border-t border-white/15 flex justify-between text-xs text-white/70">
            <span>Air vs Water diff:</span>
            <span className="font-bold text-white">
              {Math.abs(current.temp - marine.waterTemp).toFixed(1)}°C
            </span>
          </div>
        </div>

        {/* 2. Wave Height & Swell Direction */}
        <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 space-y-4 flex flex-col justify-between shadow-xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Waves className="w-4 h-4 text-sky-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Wave & Swell
              </span>
            </div>
            <span className="text-[11px] font-semibold text-white bg-white/20 px-2 py-0.5 rounded-full border border-white/30 backdrop-blur-sm">
              {marine.wavePeriod}s Period
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-black text-white">
              {marine.waveHeight} <span className="text-lg font-medium text-white/70">meters</span>
            </div>
            <p className="text-xs text-white/80">
              Swell direction heading {getWindDirectionName(marine.swellDirection)} ({marine.swellDirection}°).
            </p>
          </div>

          <div className="pt-3 border-t border-white/15 flex justify-between text-xs text-white/70">
            <span>Surf Condition:</span>
            <span className="font-bold text-cyan-200">
              {marine.waveHeight > 1.8 ? 'Solid Swell' : marine.waveHeight > 0.9 ? 'Clean Peeling Waves' : 'Small / Longboard'}
            </span>
          </div>
        </div>

        {/* 3. Tide Timings Schedule */}
        <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 space-y-3 md:col-span-2 flex flex-col justify-between shadow-xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-purple-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                24-Hour Tidal Schedule
              </span>
            </div>
            <span className="text-xs text-white/70 font-medium">Coastal Reference</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {marine.tides.map((tide, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 text-center space-y-1"
              >
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                    tide.type === 'High'
                      ? 'bg-purple-500/30 text-purple-200 border-purple-400/40'
                      : 'bg-cyan-500/30 text-cyan-200 border-cyan-400/40'
                  }`}
                >
                  {tide.type} Tide
                </span>
                <div className="text-sm font-bold text-white pt-1">{tide.time}</div>
                <div className="text-xs text-white/70">{tide.height}</div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-white/70 italic pt-1">
            Incoming tide pushes fresh water over sandbars, commonly generating cleaner breaks 2 hours before peak high tide.
          </p>
        </div>
      </div>
    </div>
  );
};
