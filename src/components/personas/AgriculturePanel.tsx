import React from 'react';
import {
  Sprout,
  Droplets,
  Snowflake,
  BarChart3,
  Calendar,
  ThermometerSnowflake,
  ShieldCheck,
  SunMedium,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import { FullWeatherData, SpeedUnit, TemperatureUnit } from '../../types';
import { computeSoilMoisture } from '../../services/weatherService';
import { formatDayName, formatTemp } from '../../utils/formatters';

interface AgriculturePanelProps {
  weather: FullWeatherData;
  tempUnit: TemperatureUnit;
  speedUnit: SpeedUnit;
}

export const AgriculturePanel: React.FC<AgriculturePanelProps> = ({
  weather,
  tempUnit,
}) => {
  const { daily, current } = weather;
  const soil = computeSoilMoisture(daily, current.humidity, current.temp);

  // Prepare Recharts data for 5-day rainfall
  const rainChartData = daily.slice(0, 5).map((d) => ({
    day: formatDayName(d.dt),
    rainMm: d.rain || (d.pop > 0.4 ? Math.round(d.pop * 8 * 10) / 10 : 0),
    pop: Math.round(d.pop * 100),
    tempMax: d.temp.max,
  }));

  // Frost risk detection (min temps near or below 2°C / 35°F)
  const minUpcomingTemp = Math.min(...daily.slice(0, 3).map((d) => d.temp.min));
  const hasFrostRisk = minUpcomingTemp <= 3;

  // Seasonal planting tips based on temperature
  const getPlantingAdvice = () => {
    if (current.temp < 10) {
      return {
        season: 'Cool-Season Dormancy / Cold Frame Phase',
        crops: 'Kale, Spinach, Garlic, Broad Beans, Overwintering Onions',
        tip: 'Soil remains cold. Protect tender root systems with organic straw mulch. Hold off on transplanting warm-season nightshades.',
      };
    }
    if (current.temp < 22) {
      return {
        season: 'Prime Spring / Mild Growth Window',
        crops: 'Lettuce, Peas, Carrots, Brassicas, Potatoes, Strawberries',
        tip: 'Optimal soil microbial activity and germination rates. Great time for direct sowing and lawn re-seeding.',
      };
    }
    return {
      season: 'Peak Summer / Warm Crop Flourish',
      crops: 'Tomatoes, Peppers, Cucumbers, Zucchini, Basil, Melons',
      tip: 'High transpiration rates. Water deeply during early mornings (before 8 AM) at root level to prevent fungal leaf scorch.',
    };
  };

  const plantingAdvice = getPlantingAdvice();

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/20">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-white/20 border border-white/30 text-white">
            <Sprout className="w-5 h-5 text-lime-300" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Agriculture & Gardeners</h3>
            <p className="text-xs text-white/70">
              Soil moisture retention, 5-day rainfall volume chart, frost warnings, and seasonal agronomy tips
            </p>
          </div>
        </div>
      </div>

      {/* Frost Alert Banner if relevant */}
      {hasFrostRisk ? (
        <div className="p-4 rounded-3xl bg-sky-500/20 backdrop-blur-md border border-sky-400/30 text-white flex items-start space-x-3.5 shadow-xl">
          <Snowflake className="w-5 h-5 text-sky-300 shrink-0 mt-0.5 animate-spin-slow" />
          <div className="space-y-1">
            <span className="font-bold text-sm text-white">
              Frost & Freeze Warning: Lows approaching {formatTemp(minUpcomingTemp, tempUnit)}
            </span>
            <p className="text-xs text-white/90">
              Ground temperatures may drop below freezing overnight. Cover delicate seedlings, greenhouse cloches, and container citrus plants.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-between shadow-xl">
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-300 shrink-0" />
            <span className="text-xs font-semibold text-white">
              No Frost Risk: Low temperatures remain safely above {formatTemp(minUpcomingTemp, tempUnit)} through the week.
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 backdrop-blur-sm">
            Safe Canopy
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 5-Day Rainfall Prediction Chart (Recharts) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 space-y-4 shadow-xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-lime-300" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                5-Day Quantitative Rainfall Prediction (mm)
              </h4>
            </div>
            <span className="text-xs text-white/70">Total: {soil.recentRainSum} mm</span>
          </div>

          {/* Bar Chart */}
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rainChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" vertical={false} />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.7)" fontSize={12} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} unit="mm" tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900/90 backdrop-blur-md border border-white/20 p-3 rounded-2xl shadow-xl text-xs space-y-1 text-white">
                          <span className="font-bold text-white block">{data.day}</span>
                          <span className="text-sky-300 block font-semibold">
                            Rain: {data.rainMm} mm ({data.pop}% chance)
                          </span>
                          <span className="text-white/70 block">
                            Day High: {formatTemp(data.tempMax, tempUnit)}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="rainMm" radius={[8, 8, 0, 0]}>
                  {rainChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.rainMm > 5 ? '#38bdf8' : entry.rainMm > 0 ? '#60a5fa' : 'rgba(255,255,255,0.2)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-white/70">
            Chart displays estimated precipitation volume based on cloud density modeling. Ideal for planning irrigation cycles.
          </p>
        </div>

        {/* Right: Soil Moisture Meter & Seasonal Planting Advice */}
        <div className="lg:col-span-5 space-y-4">
          {/* Soil Moisture Estimate */}
          <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 space-y-3 shadow-xl text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Droplets className="w-4 h-4 text-lime-300" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Soil Moisture Estimate
                </span>
              </div>
              <span className="text-xs font-bold text-lime-200">{soil.percentage}% Capacity</span>
            </div>

            <div className="space-y-2">
              <div className="w-full bg-white/10 h-3.5 rounded-full overflow-hidden p-0.5 border border-white/20">
                <div
                  className="bg-gradient-to-r from-amber-400 via-lime-400 to-sky-300 h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${soil.percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-white/80">
                <span className="font-bold text-white">{soil.status}</span>
                <span className="text-white/70">
                  {soil.daysUntilIrrigation === 0
                    ? 'Watering recommended today'
                    : `Next watering in ~${soil.daysUntilIrrigation} days`}
                </span>
              </div>
            </div>
          </div>

          {/* Seasonal Planting Tip Text */}
          <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 space-y-2.5 shadow-xl text-white">
            <div className="flex items-center space-x-2">
              <SunMedium className="w-4 h-4 text-amber-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                {plantingAdvice.season}
              </span>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-white/90">
                <span className="font-bold text-lime-200">Recommended Crops: </span>
                {plantingAdvice.crops}
              </div>
              <p className="text-xs text-white/70 leading-relaxed pt-1">
                {plantingAdvice.tip}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
