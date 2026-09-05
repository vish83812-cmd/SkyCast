import React, { useState } from 'react';
import {
  Baby,
  Clock,
  CloudRain,
  ShieldAlert,
  Backpack,
  Sun,
  Smile,
  AlertCircle,
} from 'lucide-react';
import { FullWeatherData, SpeedUnit, TemperatureUnit } from '../../types';
import { formatTemp } from '../../utils/formatters';

interface FamilyPanelProps {
  weather: FullWeatherData;
  tempUnit: TemperatureUnit;
  speedUnit: SpeedUnit;
}

export const FamilyPanel: React.FC<FamilyPanelProps> = ({ weather, tempUnit }) => {
  const { current, hourly, daily } = weather;
  const [commuteHour, setCommuteHour] = useState<number>(8); // 8 AM default

  // Find hourly forecast near commute hour
  const morningCommute = hourly.find((h) => new Date(h.dt * 1000).getHours() === commuteHour) || hourly[0];
  const afternoonPickup = hourly.find((h) => new Date(h.dt * 1000).getHours() === 15) || hourly[4];

  // Rain countdown logic
  const rainNextHour = hourly.slice(0, 6).findIndex((h) => h.pop > 0.45);
  let rainCountdownText = 'No rain expected for the next 6+ hours.';
  let rainStatusColor = 'bg-white/15 border-white/25 text-white';
  if (current.weather[0]?.main === 'Rain') {
    rainCountdownText = 'Active rain now. Expected to ease in ~45 minutes.';
    rainStatusColor = 'bg-white/20 border-white/30 text-white';
  } else if (rainNextHour === 0) {
    rainCountdownText = 'Rain starting within ~30-45 minutes. Grab raincoats!';
    rainStatusColor = 'bg-amber-500/20 border-amber-400/30 text-white';
  } else if (rainNextHour > 0) {
    rainCountdownText = `Precipitation likely starting in ~${(rainNextHour + 1) * 60} minutes.`;
    rainStatusColor = 'bg-amber-500/20 border-amber-400/30 text-white';
  }

  // Playground rating
  const getPlaygroundRating = () => {
    if (current.weather[0]?.main === 'Rain' || current.temp < 5 || current.temp > 33) {
      return {
        rating: 'Indoor Play Recommended',
        reason: 'Slick playground structures or harsh temperatures.',
        icon: AlertCircle,
        color: 'bg-rose-500/20 border-rose-400/30 text-white',
      };
    }
    if (current.uvi > 7) {
      return {
        rating: 'Shaded Play Only',
        reason: 'High UV exposure. Ensure kids wear hats and play in shaded parks.',
        icon: Sun,
        color: 'bg-amber-500/20 border-amber-400/30 text-white',
      };
    }
    return {
      rating: 'Great Playground Weather!',
      reason: 'Dry ground, comfortable breeze, and pleasant temperatures for outdoor play.',
      icon: Smile,
      color: 'bg-emerald-500/20 border-emerald-400/30 text-white',
    };
  };

  const playground = getPlaygroundRating();

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/20">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-white/20 border border-white/30 text-white">
            <Baby className="w-5 h-5 text-rose-300" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Parents & Family Planner</h3>
            <p className="text-xs text-white/70">
              School commute windows, rain alert timers, playground readiness, and kid packing notes
            </p>
          </div>
        </div>
      </div>

      {/* Rain Alert Countdown Banner */}
      <div className={`p-4 rounded-3xl backdrop-blur-md border ${rainStatusColor} flex items-center justify-between space-x-3 shadow-xl`}>
        <div className="flex items-center space-x-3">
          <CloudRain className="w-5 h-5 shrink-0 text-cyan-300" />
          <div>
            <span className="font-bold text-xs uppercase tracking-wider block text-white/80">Real-Time Rain Radar</span>
            <p className="text-sm font-semibold text-white">{rainCountdownText}</p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/20 border border-white/30 text-white backdrop-blur-sm">
          Live Nowcast
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. School Commute Forecast Window */}
        <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 space-y-4 flex flex-col justify-between shadow-xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-rose-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                School Commute Window
              </span>
            </div>
            <select
              value={commuteHour}
              onChange={(e) => setCommuteHour(Number(e.target.value))}
              className="px-2 py-1 bg-white/15 border border-white/25 rounded-lg text-xs text-white focus:outline-none focus:bg-white/25"
            >
              <option value={7} className="bg-slate-800 text-white">7:00 AM</option>
              <option value={8} className="bg-slate-800 text-white">8:00 AM</option>
              <option value={9} className="bg-slate-800 text-white">9:00 AM</option>
            </select>
          </div>

          <div className="space-y-3">
            {/* Morning Drop-off */}
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-white/60 block">Morning Drop-Off ({commuteHour}:00 AM)</span>
                <span className="text-sm font-extrabold text-white">
                  {formatTemp(morningCommute.temp, tempUnit)}
                </span>
                <span className="text-xs text-white/70 ml-2">
                  {morningCommute.weather[0]?.main || 'Clear'}
                </span>
              </div>
              <span className="text-xs font-bold text-sky-200">
                {Math.round(morningCommute.pop * 100)}% Rain
              </span>
            </div>

            {/* Afternoon Pickup */}
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-white/60 block">Afternoon Pickup (3:00 PM)</span>
                <span className="text-sm font-extrabold text-white">
                  {formatTemp(afternoonPickup.temp, tempUnit)}
                </span>
                <span className="text-xs text-white/70 ml-2">
                  {afternoonPickup.weather[0]?.main || 'Clear'}
                </span>
              </div>
              <span className="text-xs font-bold text-sky-200">
                {Math.round(afternoonPickup.pop * 100)}% Rain
              </span>
            </div>
          </div>

          <p className="text-[11px] text-white/70 italic">
            Customize drop-off hour to see exact temperatures and precipitation risk during walking or bus stops.
          </p>
        </div>

        {/* 2. What to Pack for Kids */}
        <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 space-y-4 flex flex-col justify-between shadow-xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Backpack className="w-4 h-4 text-amber-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Kid Backpack Essentials
              </span>
            </div>
            <span className="text-xs font-bold text-amber-200">Daily Checklist</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-300 shrink-0" />
              <span className="text-white/90">
                {current.temp < 14
                  ? 'Warm sweater + zip jacket (morning cold)'
                  : 'Light breathable cotton shirt + spare cardigan'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-sky-300 shrink-0" />
              <span className="text-white/90">
                {morningCommute.pop > 0.3 || afternoonPickup.pop > 0.3
                  ? 'Pack small folding umbrella + water-resistant shoes'
                  : 'No heavy rain gear required today'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-rose-300 shrink-0" />
              <span className="text-white/90">
                {current.uvi > 4
                  ? 'SPF 50 kid sunscreen + sun hat in backpack'
                  : 'Standard hydration water bottle'}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-white/70 italic pt-1">
            Dynamic dressing advice updated continuously from hourly temperature shifts.
          </p>
        </div>

        {/* 3. Outdoor Playground Condition Rating */}
        <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 space-y-4 flex flex-col justify-between shadow-xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <playground.icon className="w-4 h-4 text-emerald-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Playground & Park Index
              </span>
            </div>
          </div>

          <div className={`p-4 rounded-2xl backdrop-blur-sm border ${playground.color} space-y-1.5 shadow-sm`}>
            <span className="font-extrabold text-sm block">{playground.rating}</span>
            <p className="text-xs text-white/90 leading-relaxed">{playground.reason}</p>
          </div>

          <div className="pt-2 border-t border-white/15 flex justify-between text-xs text-white/70">
            <span>Peak Play Hours:</span>
            <span className="font-bold text-white">4:00 PM - 6:30 PM</span>
          </div>
        </div>
      </div>
    </div>
  );
};
