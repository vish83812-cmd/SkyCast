import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  Footprints,
  Waves,
  Plane,
  Baby,
  Sprout,
  Train,
  PartyPopper,
  Compass,
  ArrowRight,
  ShieldCheck,
  CloudSun,
  UserCheck,
  Sparkles,
  Search,
} from 'lucide-react';
import { Language, PersonaId } from '../types';
import { getTranslation } from '../utils/translations';

interface PurposeGatewayProps {
  onSelectPurpose: (persona: PersonaId) => void;
  language: Language;
  isDarkMode: boolean;
}

export const PurposeGateway: React.FC<PurposeGatewayProps> = ({
  onSelectPurpose,
  language,
  isDarkMode,
}) => {
  const t = getTranslation(language);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const purposeCards: {
    id: PersonaId;
    icon: React.ReactNode;
    color: string;
    gradient: string;
    border: string;
    badgeText: string;
    category: string;
    keyMetrics: string[];
  }[] = [
    {
      id: 'health',
      icon: <Activity className="w-7 h-7 text-emerald-400" />,
      color: 'text-emerald-400',
      gradient: 'from-emerald-500/30 via-teal-500/15 to-transparent',
      border: 'border-emerald-500/40 hover:border-emerald-400',
      badgeText: 'CPCB AQI & Respiratory',
      category: 'health',
      keyMetrics: ['Air Quality Index', 'PM2.5 / PM10', 'Pollen & Allergy Index'],
    },
    {
      id: 'fitness',
      icon: <Footprints className="w-7 h-7 text-sky-400" />,
      color: 'text-sky-400',
      gradient: 'from-sky-500/30 via-blue-500/15 to-transparent',
      border: 'border-sky-500/40 hover:border-sky-400',
      badgeText: 'Running & Outdoor',
      category: 'fitness',
      keyMetrics: ['UV Index', 'Sweat Rate & Heat Stress', 'Optimal Workout Windows'],
    },
    {
      id: 'beach',
      icon: <Waves className="w-7 h-7 text-cyan-400" />,
      color: 'text-cyan-400',
      gradient: 'from-cyan-500/30 via-blue-600/15 to-transparent',
      border: 'border-cyan-500/40 hover:border-cyan-400',
      badgeText: 'Coastal & Marine',
      category: 'outdoor',
      keyMetrics: ['Tide Timings', 'Wave Heights', 'Sea Surface Temp'],
    },
    {
      id: 'travel',
      icon: <Plane className="w-7 h-7 text-indigo-400" />,
      color: 'text-indigo-400',
      gradient: 'from-indigo-500/30 via-purple-500/15 to-transparent',
      border: 'border-indigo-500/40 hover:border-indigo-400',
      badgeText: 'Trip & Hill Stations',
      category: 'travel',
      keyMetrics: ['Road Passability', 'Hill Fog Alerts', 'Destination Weather'],
    },
    {
      id: 'family',
      icon: <Baby className="w-7 h-7 text-amber-400" />,
      color: 'text-amber-400',
      gradient: 'from-amber-500/30 via-orange-500/15 to-transparent',
      border: 'border-amber-500/40 hover:border-amber-400',
      badgeText: 'Kids & School',
      category: 'family',
      keyMetrics: ['Hydration Advisories', 'School Recess Safety', 'Playground UV'],
    },
    {
      id: 'agriculture',
      icon: <Sprout className="w-7 h-7 text-lime-400" />,
      color: 'text-lime-400',
      gradient: 'from-lime-500/30 via-emerald-600/15 to-transparent',
      border: 'border-lime-500/40 hover:border-lime-400',
      badgeText: 'Farming & Crops',
      category: 'agriculture',
      keyMetrics: ['Soil Moisture', 'Rainfall Forecast', 'Crop Protection Advice'],
    },
    {
      id: 'commuter',
      icon: <Train className="w-7 h-7 text-orange-400" />,
      color: 'text-orange-400',
      gradient: 'from-orange-500/30 via-red-500/15 to-transparent',
      border: 'border-orange-500/40 hover:border-orange-400',
      badgeText: 'Transit & Fog',
      category: 'commuter',
      keyMetrics: ['Visibility & Dense Fog', 'Train & Flight Disruptions', 'Rain Commute Index'],
    },
    {
      id: 'events',
      icon: <PartyPopper className="w-7 h-7 text-purple-400" />,
      color: 'text-purple-400',
      gradient: 'from-purple-500/30 via-pink-500/15 to-transparent',
      border: 'border-purple-500/40 hover:border-purple-400',
      badgeText: 'Weddings & Venues',
      category: 'events',
      keyMetrics: ['Outdoor Rain Radar', 'Tent Stability Wind', 'Sunset/Golden Hour'],
    },
  ];

  const filteredCards = purposeCards.filter((card) => {
    const personaData = t.personas[card.id];
    const matchesSearch =
      personaData.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      personaData.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.badgeText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || card.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-between">
      {/* Background ambient glowing orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-500/25 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-10 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-10 w-full">
        {/* Header Branding & "Who Are You Today?" Section */}
        <div className="text-center space-y-5">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2.5 px-4.5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-emerald-300 shadow-xl"
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Mausam Persona & Purpose Gateway</span>
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" style={{ animationDuration: '6s' }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg"
          >
            Who Are You <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-400">Today?</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-white/85 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Select your role or activity to instantly generate a custom-built weather intelligence dashboard tailored with the precise metrics, alerts, and advisories you need.
          </motion.p>

          {/* Search & Category Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-3 pt-2"
          >
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                type="text"
                placeholder="Search purpose (e.g. Health, Running, Wedding, Farming...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-white/50 text-xs sm:text-sm focus:outline-none focus:border-emerald-400 shadow-lg transition"
              />
            </div>
          </motion.div>

          {/* Category Filter Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-2 pt-1"
          >
            {[
              { id: 'all', label: 'All Personas' },
              { id: 'health', label: 'Health & AQI' },
              { id: 'fitness', label: 'Fitness & Sports' },
              { id: 'outdoor', label: 'Beach & Coastal' },
              { id: 'travel', label: 'Travel & Trips' },
              { id: 'family', label: 'Family & Kids' },
              { id: 'agriculture', label: 'Farming' },
              { id: 'commuter', label: 'Commute' },
              { id: 'events', label: 'Events & Weddings' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition backdrop-blur-md border ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/30'
                    : 'bg-white/10 text-white/80 border-white/15 hover:bg-white/20'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Persona Purpose Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {filteredCards.map((card, idx) => {
            const personaData = t.personas[card.id];
            return (
              <motion.button
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * idx }}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectPurpose(card.id)}
                className={`text-left p-6 rounded-3xl bg-slate-900/70 backdrop-blur-2xl border ${card.border} shadow-2xl relative overflow-hidden group flex flex-col justify-between transition-all duration-300`}
              >
                {/* Background Gradient Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 shadow-inner group-hover:scale-110 transition-transform">
                      {card.icon}
                    </div>
                    <span className="text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/10 text-white/90 border border-white/15">
                      {card.badgeText}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-xl font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                      {personaData.label}
                    </h3>
                    <p className="text-xs text-white/75 line-clamp-2 font-normal leading-relaxed">
                      {personaData.tagline}
                    </p>
                  </div>

                  {/* Key Metrics Preview Pills */}
                  <div className="space-y-1.5 pt-2 border-t border-white/10">
                    <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Priority Metrics:</span>
                    <div className="flex flex-wrap gap-1">
                      {card.keyMetrics.map((metric, mIdx) => (
                        <span
                          key={mIdx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-white/80 border border-white/10 font-medium"
                        >
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative z-10 pt-6 flex items-center justify-between text-xs font-bold text-white/90 group-hover:text-white">
                  <span>Launch Custom View</span>
                  <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-emerald-500 flex items-center justify-center transition-all group-hover:translate-x-1 shadow-md">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {filteredCards.length === 0 && (
          <div className="text-center py-12 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/15">
            <p className="text-white/70 text-sm font-semibold">No matching personas found for "{searchQuery}". Try another search term or category.</p>
          </div>
        )}

        {/* Footer Trust & Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4 text-center sm:text-left"
        >
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official IMD, CPCB & Open-Meteo Meteorological Integration</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              <span>Pan-India Coverage across 500+ Districts</span>
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
