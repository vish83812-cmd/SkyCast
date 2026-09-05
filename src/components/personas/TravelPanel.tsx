import React, { useState } from 'react';
import {
  Plane,
  Luggage,
  Plus,
  Trash2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import {
  FullWeatherData,
  ItineraryItem,
  LocationData,
  SpeedUnit,
  TemperatureUnit,
} from '../../types';
import { computePackingSuggestions } from '../../services/weatherService';

interface TravelPanelProps {
  weather: FullWeatherData;
  tempUnit: TemperatureUnit;
  speedUnit: SpeedUnit;
  favorites: LocationData[];
  onSelectCity: (loc: LocationData) => void;
}

export const TravelPanel: React.FC<TravelPanelProps> = ({
  weather,
  tempUnit,
  speedUnit,
  favorites,
  onSelectCity,
}) => {
  const { daily, alerts, current } = weather;
  const packing = computePackingSuggestions(daily, alerts);

  // Itinerary state (saved to localStorage with Indian destinations)
  const [itinerary, setItinerary] = useState<ItineraryItem[]>(() => {
    try {
      const saved = localStorage.getItem('skycast_itinerary_india');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: '1',
        city: 'Jaipur',
        country: 'IN',
        startDate: '2026-09-12',
        endDate: '2026-09-16',
        notes: 'Heritage forts exploration & desert sunset excursion.',
      },
      {
        id: '2',
        city: 'Kochi',
        country: 'IN',
        startDate: '2026-09-20',
        endDate: '2026-09-25',
        notes: 'Kerala backwaters & coastal spice market tour.',
      },
    ];
  });

  const [newCityName, setNewCityName] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddItinerary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCityName.trim()) return;
    const newItem: ItineraryItem = {
      id: Date.now().toString(),
      city: newCityName.trim(),
      country: 'IN',
      startDate: newStartDate || 'Upcoming',
      endDate: newEndDate || 'Upcoming',
      notes: newNotes.trim() || 'General travel & exploration',
    };
    const updated = [newItem, ...itinerary];
    setItinerary(updated);
    localStorage.setItem('skycast_itinerary_india', JSON.stringify(updated));
    setNewCityName('');
    setNewStartDate('');
    setNewEndDate('');
    setNewNotes('');
    setShowAddForm(false);
  };

  const handleDeleteItinerary = (id: string) => {
    const updated = itinerary.filter((item) => item.id !== id);
    setItinerary(updated);
    localStorage.setItem('skycast_itinerary_india', JSON.stringify(updated));
  };

  // Flight Weather Hazards Assessment (Aviation Meteorological Guidance)
  const getFlightHazard = () => {
    const windKmh = current.wind_speed * 3.6;
    if (current.weather[0]?.main === 'Rain' && windKmh > 35) {
      return {
        severity: 'Monsoon Air Traffic Delay Advisory',
        desc: 'Convective monsoon downpours and crosswind shear may lead to flight holding patterns and airport transit buffers.',
        color: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
      };
    }
    if (current.visibility < 2500) {
      return {
        severity: 'Low Visibility / Fog Advisory',
        desc: 'Reduced runway visibility in the terminal area. CAT II/III instrument landing protocols active.',
        color: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
      };
    }
    return {
      severity: 'Clear Flight Operations Expected',
      desc: 'Optimal air corridor with clear approaches and high ceilings across regional routes.',
      color: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
    };
  };

  const flightHazard = getFlightHazard();

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/20">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-white/20 border border-white/30 text-white">
            <Plane className="w-5 h-5 text-indigo-200" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Travelers & Explorers</h3>
            <p className="text-xs text-white/70">
              Inter-city travel conditions, DGCA / aviation weather alerts, smart packing recommendations & itinerary log
            </p>
          </div>
        </div>
      </div>

      {/* Flight Operations Banner */}
      <div className="p-4 rounded-3xl bg-white/15 backdrop-blur-md border border-white/25 flex items-start space-x-3.5 shadow-xl text-white">
        <Plane className="w-5 h-5 shrink-0 mt-0.5 text-indigo-200" />
        <div className="space-y-1">
          <span className="font-bold text-sm block text-white">{flightHazard.severity}</span>
          <p className="text-xs text-white/90">{flightHazard.desc}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Smart Auto-Generated Packing Checklist */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 space-y-4 shadow-xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Luggage className="w-4 h-4 text-indigo-200" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Smart Packing Checklist ({weather.location.name})
              </h4>
            </div>
          </div>

          <p className="text-xs text-white bg-white/15 p-2.5 rounded-xl border border-white/20 backdrop-blur-sm">
            {packing.summary}
          </p>

          <div className="space-y-2.5">
            {packing.items.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-start space-x-3 text-white"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{item.item}</span>
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                        item.priority === 'High'
                          ? 'bg-rose-500/30 text-rose-200 border-rose-400/40'
                          : 'bg-indigo-500/30 text-indigo-200 border-indigo-400/40'
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/70">{item.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Trip Itinerary & Saved Destinations Hub */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 space-y-4 shadow-xl text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-indigo-200" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Indian Trip Itinerary Planner
                </h4>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-3 py-1 text-xs font-semibold rounded-xl bg-white/20 text-white border border-white/30 hover:bg-white/30 flex items-center space-x-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Destination</span>
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleAddItinerary} className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 space-y-3 shadow-lg">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="City (e.g., Shillong)"
                    value={newCityName}
                    onChange={(e) => setNewCityName(e.target.value)}
                    className="px-3 py-1.5 bg-white/10 rounded-xl text-xs text-white placeholder-white/50 border border-white/20 focus:outline-none focus:bg-white/20"
                  />
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="px-3 py-1.5 bg-white/10 rounded-xl text-xs text-white border border-white/20"
                  />
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="px-3 py-1.5 bg-white/10 rounded-xl text-xs text-white border border-white/20"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Notes (e.g., Mountain trekking, Temples tour)"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white/10 rounded-xl text-xs text-white placeholder-white/50 border border-white/20"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1 text-xs text-white/70 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 bg-white/30 hover:bg-white/40 border border-white/40 text-white rounded-xl text-xs font-semibold shadow-sm"
                  >
                    Save Destination
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {itinerary.length === 0 ? (
                <p className="text-xs text-white/50 text-center py-4">No upcoming Indian destinations added yet.</p>
              ) : (
                itinerary.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-between hover:bg-white/20 transition text-white"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3.5 h-3.5 text-indigo-200" />
                        <span className="font-bold text-xs text-white">{item.city}</span>
                        <span className="text-[10px] text-white/60">({item.startDate} → {item.endDate})</span>
                      </div>
                      <p className="text-[11px] text-white/70 pl-5">{item.notes}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteItinerary(item.id)}
                      className="text-white/60 hover:text-rose-300 p-1.5 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
