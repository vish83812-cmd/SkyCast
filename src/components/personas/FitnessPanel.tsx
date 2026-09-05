import React from 'react';
import {
  Flame,
  Sunrise,
  Sunset,
  Navigation,
  Activity,
  AlertTriangle,
  Award,
  Zap,
} from 'lucide-react';
import { FullWeatherData, SpeedUnit, TemperatureUnit } from '../../types';
import {
  computeBestRunningHours,
} from '../../services/weatherService';
import {
  formatSpeed,
  formatTemp,
  formatTime,
  getWindDirectionName,
} from '../../utils/formatters';

interface FitnessPanelProps {
  weather: FullWeatherData;
  tempUnit: TemperatureUnit;
  speedUnit: SpeedUnit;
}

export const FitnessPanel: React.FC<FitnessPanelProps> = ({
  weather,
  tempUnit,
  speedUnit,
}) => {
  const { current, hourly, airPollution, timezone_offset } = weather;
  const runningHours = computeBestRunningHours(hourly, airPollution.aqi);
  const bestWindows = runningHours.slice(0, 3);

  // Daylight calculation (percentage of sun elapsed today)
  const now = current.dt;
  const dayDuration = Math.max(1, current.sunset - current.sunrise);
  const sunProgress = Math.min(
    100,
    Math.max(0, Math.round(((now - current.sunrise) / dayDuration) * 100))
  );
  const isDaytime = now >= current.sunrise && now <= current.sunset;

  // Thermal risk calculation
  const getThermalRisk = () => {
    if (current.temp > 30) {
      return {
        level: 'High Heat Strain',
        message: 'High heat and humidity. Risk of dehydration, heat exhaustion, and cramps during prolonged workouts.',
        advice: 'Stick to early morning runs before 8 AM. Carry electrolyte fluid and wear breathable attire.',
        color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      };
    }
    if (current.temp < 4) {
      return {
        level: 'Wind Chill / Cold Strain',
        message: 'Frigid air may strain bronchial airways and extremities.',
        advice: 'Layer up with wind-resistant shells, thermal gloves, and warm up indoors before sprinting.',
        color: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
      };
    }
    return {
      level: 'Ideal Workout Conditions',
      message: 'Optimal thermal zone for endurance cardio, tempo runs, and cycling.',
      advice: 'Great aerobic performance window with minimal cardiovascular stress.',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    };
  };

  const thermalRisk = getThermalRisk();

  return (
    <div className="w-full space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between pb-2 border-b border-white/20">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-white/20 border border-white/30 text-white">
            <Flame className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Outdoor Fitness & Cardio Intelligence</h3>
            <p className="text-xs text-white/70">
              Optimal workout windows, daylight progress, wind compass, and thermal stress indexes
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center space-x-1 text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-md">
          <Zap className="w-3.5 h-3.5 text-amber-300" />
          <span>Biometric Optimization</span>
        </span>
      </div>

      {/* Thermal Exercise Alert */}
      <div className="p-4 rounded-3xl bg-white/15 backdrop-blur-md border border-white/25 flex items-start space-x-3.5 text-white shadow-lg">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-300" />
        <div className="space-y-1">
          <span className="font-bold text-sm block text-white">{thermalRisk.level}</span>
          <p className="text-xs text-white/90">{thermalRisk.message}</p>
          <p className="text-[11px] font-medium text-white/80 pt-1">{thermalRisk.advice}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Best Running & Workout Hours (Algorithm Picks) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 space-y-4 shadow-xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-300" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Algorithm-Selected Running Windows
              </h4>
            </div>
            <span className="text-[11px] text-white/70 font-medium">Scored 0 - 100</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {bestWindows.map((slot, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 flex flex-col justify-between space-y-2 relative overflow-hidden group hover:bg-white/20 transition shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{slot.time}</span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-sm"
                  >
                    {slot.rating} ({slot.score}/100)
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-white/80">
                    <span className="text-white/60">Temp:</span>
                    <span className="font-bold text-white">{formatTemp(slot.temp, tempUnit)}</span>
                  </div>
                  <div className="flex justify-between text-white/80">
                    <span className="text-white/60">Rain Prob:</span>
                    <span className="font-bold text-sky-200">{Math.round(slot.pop * 100)}%</span>
                  </div>
                  <div className="flex justify-between text-white/80">
                    <span className="text-white/60">Wind:</span>
                    <span className="font-bold text-white">{formatSpeed(slot.windSpeed, speedUnit)}</span>
                  </div>
                </div>

                <div className="w-full bg-white/15 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-300 h-full rounded-full"
                    style={{ width: `${slot.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-white/70 leading-relaxed pt-2">
            Calculated by scoring temperature proximity to the human performance sweet spot (12-16°C), wind drag penalties, precipitation probability, and air particulate resistance.
          </p>
        </div>

        {/* Right: Daylight Progression Bar & Wind Compass */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {/* Daylight Bar */}
          <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 space-y-3 shadow-xl text-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Daylight & Solar Tracker
              </span>
              <span className="text-xs text-amber-200 font-semibold">
                {isDaytime ? `${sunProgress}% elapsed` : 'Night Cycle'}
              </span>
            </div>

            {/* Visual Daylight Arch / Bar */}
            <div className="relative pt-2 pb-1">
              <div className="w-full bg-white/15 h-3 rounded-full overflow-hidden p-0.5 border border-white/20">
                <div
                  className="bg-gradient-to-r from-amber-300 via-amber-200 to-orange-300 h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${sunProgress}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-white/90 pt-1">
              <div className="flex items-center space-x-1.5">
                <Sunrise className="w-4 h-4 text-amber-300" />
                <span>{formatTime(current.sunrise, timezone_offset)}</span>
              </div>
              <div className="text-[11px] text-white/60">Golden Hour: ~5:45 PM</div>
              <div className="flex items-center space-x-1.5">
                <Sunset className="w-4 h-4 text-orange-300" />
                <span>{formatTime(current.sunset, timezone_offset)}</span>
              </div>
            </div>
          </div>

          {/* Wind Speed & Direction Compass */}
          <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-between space-x-4 shadow-xl text-white">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-white block">
                Wind Vector & Drag
              </span>
              <div className="text-xl font-black text-white">
                {formatSpeed(current.wind_speed, speedUnit)}
              </div>
              <p className="text-xs text-white/70">
                Heading {getWindDirectionName(current.wind_deg)} ({current.wind_deg}°)
              </p>
              <span className="text-[10px] text-teal-200 block pt-1 font-medium">
                {current.wind_speed * 3.6 > 25 ? 'Significant headwind resistance' : 'Low aerodynamic drag'}
              </span>
            </div>

            {/* Circular Compass Visualizer */}
            <div className="relative w-16 h-16 rounded-full border-2 border-white/30 flex items-center justify-center bg-white/10 shadow-inner shrink-0">
              <span className="absolute top-1 text-[9px] font-bold text-white/60">N</span>
              <span className="absolute bottom-1 text-[9px] font-bold text-white/40">S</span>
              <span className="absolute left-1 text-[9px] font-bold text-white/40">W</span>
              <span className="absolute right-1 text-[9px] font-bold text-white/40">E</span>
              <div
                className="transition-transform duration-700"
                style={{ transform: `rotate(${current.wind_deg}deg)` }}
              >
                <Navigation className="w-6 h-6 text-cyan-300 fill-cyan-300 drop-shadow-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
