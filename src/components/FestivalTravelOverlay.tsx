import React, { useState } from 'react';
import { Sparkles, Calendar, MapPin, Compass, AlertCircle, CheckCircle, X } from 'lucide-react';
import { FestivalEvent, Language, LocationData } from '../types';
import { getTranslation } from '../utils/translations';

interface FestivalTravelOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSelectLocation: (loc: LocationData) => void;
}

export const FestivalTravelOverlay: React.FC<FestivalTravelOverlayProps> = ({
  isOpen,
  onClose,
  language,
  onSelectLocation,
}) => {
  const t = getTranslation(language);

  if (!isOpen) return null;

  const festivalList: FestivalEvent[] = [
    {
      name: 'Diwali & Post-Festival AQI Advisory',
      dates: 'October - November',
      regions: ['Delhi-NCR', 'Varanasi', 'Jaipur', 'Lucknow', 'Ahmedabad'],
      description: 'Cooling autumn temperatures combined with post-Diwali inversions typically lead to severe PM2.5 particulate spikes in Northern Indo-Gangetic plains. Pre-booking indoor air purifiers and wearing N95 masks is recommended.',
      weatherTip: 'High particulate matter accumulation during morning hours. Plan outdoor celebrations in late afternoons with moderate winds.',
      bestTime: 'Post-sunset before calm night inversion sets in',
    },
    {
      name: 'Durga Puja Pandal Hopping',
      dates: 'October (Autumn / Sharat Ritu)',
      regions: ['Kolkata', 'Siliguri', 'Guwahati', 'Ranchi'],
      description: 'Pleasant autumn breeze with occasional brief post-monsoon passing showers (Kaalbaisakhi/Norwesters). High humidity during early pandal tours.',
      weatherTip: 'Carry compact foldable umbrellas and breathable cotton kurtas. Evening breezes are comfortable around the Hooghly riverbank.',
      bestTime: 'Evening 6:00 PM to midnight',
    },
    {
      name: 'Goa Coastal Peak Beach Season',
      dates: 'November - February',
      regions: ['Goa (North & South)', 'Gokarna', 'Tarkarli'],
      description: 'Crystal clear skies, warm daytime sunshine (30°C–32°C), and gentle offshore breeze. Pristine Arabian Sea swell for surfing, catamaran sailing, and beach sunsets.',
      weatherTip: 'Minimal rain probability (<5%). Apply SPF 50+ mineral sunscreen for midday beach sports.',
      bestTime: 'Morning 7:00 AM – 11:00 AM and sunset 4:30 PM – 7:00 PM',
    },
    {
      name: 'Char Dham & Himalayan Pilgrimage Yatra',
      dates: 'May - October',
      regions: ['Kedarnath', 'Badrinath', 'Gangotri', 'Yamunotri'],
      description: 'Rapidly shifting mountain microclimates. Clear mornings frequently transform into afternoon thunderclouds or sudden freezing rainfall.',
      weatherTip: 'Check IMD Mountain Weather Bulletins before high-altitude trekking. Heavy monsoon landslides occur in July-August.',
      bestTime: 'Early morning departures before 1:00 PM mountain cloud buildup',
    },
    {
      name: 'Ganesh Chaturthi Festivities',
      dates: 'August - September',
      regions: ['Mumbai', 'Pune', 'Nagpur', 'Hyderabad'],
      description: 'Vibrant procession season coinciding with active late-monsoon showers. Coastal high tides frequently occur during visarjan immersion days.',
      weatherTip: 'Monitor municipal tide timetables along Marine Drive, Girgaon Chowpatty, and Juhu beach during visarjan.',
      bestTime: 'Mid-morning or post-shower dry intervals',
    },
    {
      name: 'Holi Spring Festival',
      dates: 'March (Vasant Ritu)',
      regions: ['Mathura-Vrindavan', 'Jaipur', 'Delhi', 'Indore'],
      description: 'Transition into warm spring weather (28°C–32°C). High UV intensity with clear skies and low humidity.',
      weatherTip: 'Use organic, natural skin-safe colors. Apply coconut oil skin barrier against harsh midday UV exposure.',
      bestTime: '9:00 AM to 1:00 PM',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-7 shadow-2xl text-white space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-300">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
                <span>{t.festivalTitle}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  Cultural & Travel Seasons
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Seasonal meteorology and air quality planning for major Indian celebrations & pilgrimage corridors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Festival Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {festivalList.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-950/70 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-3.5 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-extrabold text-base text-white">{item.name}</h3>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-sky-300 border border-slate-700 shrink-0 flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-sky-400" />
                    <span>{item.dates}</span>
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.regions.map((reg) => (
                    <span
                      key={reg}
                      className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-medium"
                    >
                      {reg}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {item.description}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1 text-xs">
                <div className="font-bold text-amber-300 flex items-center space-x-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Weather & Safety Advisory:</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {item.weatherTip}
                </p>
                <div className="text-[10px] text-amber-200 font-medium pt-0.5">
                  Recommended Time: {item.bestTime}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
