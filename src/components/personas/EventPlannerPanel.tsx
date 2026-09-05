import React from 'react';
import {
  CalendarCheck2,
  Trophy,
  Sparkles,
  Sun,
  Droplets,
  Wind,
  ShieldCheck,
  PartyPopper,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { FullWeatherData, SpeedUnit, TemperatureUnit } from '../../types';
import { computeComfortIndex } from '../../services/weatherService';
import { formatDayName, formatTemp } from '../../utils/formatters';
import { WeatherIcon } from '../WeatherIcon';

interface EventPlannerPanelProps {
  weather: FullWeatherData;
  tempUnit: TemperatureUnit;
  speedUnit: SpeedUnit;
}

export const EventPlannerPanel: React.FC<EventPlannerPanelProps> = ({
  weather,
  tempUnit,
}) => {
  const { daily, current } = weather;
  const comfort = computeComfortIndex(
    current.temp,
    current.humidity,
    current.wind_speed,
    current.uvi
  );

  // 7-14 Day rain probability chart data
  const chartData = daily.map((d) => ({
    day: formatDayName(d.dt),
    pop: Math.round(d.pop * 100),
    tempMax: d.temp.max,
    tempMin: d.temp.min,
    rainMm: d.rain || 0,
    uv: d.uvi,
  }));

  // Identify Best Event Day (Lowest POP + Moderate Temp + Moderate Wind)
  const scoredDays = daily.map((d, index) => {
    let score = 100;
    score -= d.pop * 55; // rain heavily penalizes
    const tempDiff = Math.abs(d.temp.day - 21);
    score -= tempDiff * 2.5;
    if (d.wind_speed * 3.6 > 25) score -= (d.wind_speed * 3.6 - 25) * 1.5;
    if (d.uvi > 8) score -= 10;
    return {
      day: d,
      index,
      dayName: formatDayName(d.dt),
      score: Math.round(score),
    };
  });

  scoredDays.sort((a, b) => b.score - a.score);
  const bestDay = scoredDays[0];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/20">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-white/20 border border-white/30 text-white">
            <CalendarCheck2 className="w-5 h-5 text-purple-300" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Event & Wedding Planners</h3>
            <p className="text-xs text-white/70">
              Outdoor comfort index (0-100), precipitation probability curves, and top venue date picks
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center space-x-1 text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-md">
          <PartyPopper className="w-3.5 h-3.5 text-purple-300" />
          <span>Venue Intelligence</span>
        </span>
      </div>

      {/* Top Best-Day Highlight Banner */}
      <div className="p-5 rounded-3xl bg-white/15 backdrop-blur-md border border-white/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl text-white">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-white/20 text-purple-200 border border-white/30 shrink-0">
            <Trophy className="w-7 h-7 animate-bounce text-amber-300" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-200">
                Top Recommended Event Day
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/25 text-white border border-white/30">
                Score: {bestDay.score}/100
              </span>
            </div>
            <h4 className="text-lg font-black text-white">
              {bestDay.dayName} — Prime Window for Outdoor Gatherings
            </h4>
            <p className="text-xs text-white/80">
              Only {Math.round(bestDay.day.pop * 100)}% rain risk, gentle breeze ({bestDay.day.wind_speed} m/s), and high of{' '}
              {formatTemp(bestDay.day.temp.max, tempUnit)}.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <WeatherIcon
            condition={bestDay.day.weather[0]?.main || 'Clear'}
            iconCode={bestDay.day.weather[0]?.icon}
            className="w-10 h-10 drop-shadow"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Probability of Rain Chart (Recharts Area) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 space-y-4 shadow-xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-purple-300" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Daily Rain Probability (%) & Risk Trend
              </h4>
            </div>
            <span className="text-xs text-white/70">7-Day Confidence</span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="popGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c084fc" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#c084fc" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" vertical={false} />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.7)" fontSize={12} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} unit="%" domain={[0, 100]} tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900/90 backdrop-blur-md border border-white/20 p-3 rounded-2xl shadow-xl text-xs space-y-1 text-white">
                          <span className="font-bold text-white block">{data.day}</span>
                          <span className="text-purple-300 block font-semibold">
                            Precipitation Probability: {data.pop}%
                          </span>
                          <span className="text-white/70 block">
                            Peak UV: {data.uv} • Max: {formatTemp(data.tempMax, tempUnit)}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="pop"
                  stroke="#e9d5ff"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#popGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-white/70">
            Probability models reflect convective storm chances. Any day under 25% is generally safe for non-tented setups.
          </p>
        </div>

        {/* Right: Outdoor Comfort Index Score (0-100) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 space-y-4 flex flex-col justify-between shadow-xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Composite Comfort Index
              </h4>
            </div>
            <span className="text-xs font-bold text-purple-200">0 - 100 Scale</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-5xl font-black text-white">{comfort.score}</span>
              <span className="text-sm font-semibold text-white/70">/ 100</span>
            </div>
            <span className="text-xs font-bold text-purple-200 block">
              {comfort.label}
            </span>
            <p className="text-xs text-white/80 leading-relaxed">
              Synthesizes Thom&apos;s Discomfort Index, wind draft gusts, solar radiant heat, and relative humidity into a single guest satisfaction score.
            </p>
          </div>

          <div className="pt-3 border-t border-white/15 space-y-2 text-xs">
            <div className="flex justify-between text-white/80">
              <span className="text-white/70">Tented Canopy Need:</span>
              <span className="font-bold text-white">
                {current.humidity > 70 || current.uvi > 7 ? 'Recommended' : 'Optional'}
              </span>
            </div>
            <div className="flex justify-between text-white/80">
              <span className="text-white/70">Evening Outerwear:</span>
              <span className="font-bold text-white">
                {daily[0]?.temp.night < 15 ? 'Light Shawls / Patio Heaters' : 'Warm Ambient Night'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
