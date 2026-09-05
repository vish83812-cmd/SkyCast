import React from 'react';
import {
  HeartPulse,
  Flame,
  Waves,
  Plane,
  Baby,
  Sprout,
  Car,
  CalendarCheck2,
} from 'lucide-react';
import { Language, PersonaId } from '../types';
import { getTranslation } from '../utils/translations';

interface ModeSwitcherProps {
  activeMode: PersonaId;
  onSelectMode: (mode: PersonaId) => void;
  language: Language;
}

interface PersonaConfig {
  id: PersonaId;
  icon: React.ElementType;
  color: string;
  borderColor: string;
  activeBg: string;
}

const PERSONA_CONFIGS: PersonaConfig[] = [
  {
    id: 'health',
    icon: HeartPulse,
    color: 'text-emerald-300',
    borderColor: 'border-white/40',
    activeBg: 'bg-white/30 border-white/50 text-white shadow-xl',
  },
  {
    id: 'fitness',
    icon: Flame,
    color: 'text-amber-300',
    borderColor: 'border-white/40',
    activeBg: 'bg-white/30 border-white/50 text-white shadow-xl',
  },
  {
    id: 'beach',
    icon: Waves,
    color: 'text-cyan-300',
    borderColor: 'border-white/40',
    activeBg: 'bg-white/30 border-white/50 text-white shadow-xl',
  },
  {
    id: 'travel',
    icon: Plane,
    color: 'text-indigo-200',
    borderColor: 'border-white/40',
    activeBg: 'bg-white/30 border-white/50 text-white shadow-xl',
  },
  {
    id: 'family',
    icon: Baby,
    color: 'text-rose-300',
    borderColor: 'border-white/40',
    activeBg: 'bg-white/30 border-white/50 text-white shadow-xl',
  },
  {
    id: 'agriculture',
    icon: Sprout,
    color: 'text-lime-300',
    borderColor: 'border-white/40',
    activeBg: 'bg-white/30 border-white/50 text-white shadow-xl',
  },
  {
    id: 'commuter',
    icon: Car,
    color: 'text-sky-300',
    borderColor: 'border-white/40',
    activeBg: 'bg-white/30 border-white/50 text-white shadow-xl',
  },
  {
    id: 'events',
    icon: CalendarCheck2,
    color: 'text-purple-300',
    borderColor: 'border-white/40',
    activeBg: 'bg-white/30 border-white/50 text-white shadow-xl',
  },
];

export const ModeSwitcher: React.FC<ModeSwitcherProps> = ({ activeMode, onSelectMode, language }) => {
  const t = getTranslation(language);

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center space-x-2">
            <span>{t.whoAreYouToday}</span>
            <span className="text-[11px] font-normal lowercase text-white/60">
              ({t.selectPersonaHelp})
            </span>
          </h2>
        </div>
      </div>

      {/* Mode Chips Carousel / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {PERSONA_CONFIGS.map((config) => {
          const Icon = config.icon;
          const isActive = activeMode === config.id;
          const label = t.personas[config.id].label;
          const tagline = t.personas[config.id].tagline;

          return (
            <button
              key={config.id}
              id={`mode-${config.id}-btn`}
              onClick={() => onSelectMode(config.id)}
              className={`relative text-left p-3 rounded-2xl border transition-all duration-200 flex flex-col justify-between backdrop-blur-md ${
                isActive
                  ? `${config.activeBg} ring-1 ring-white/50 scale-105 text-white font-bold`
                  : 'bg-white/10 hover:bg-white/20 border-white/15 text-white/80 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div
                  className={`p-2 rounded-xl ${
                    isActive ? 'bg-white/20 shadow-sm border border-white/30' : 'bg-white/10 border border-white/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? config.color : 'text-white/80'}`} />
                </div>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                )}
              </div>
              <div>
                <span className="block font-bold text-xs leading-tight tracking-tight">
                  {label}
                </span>
                <span className="text-[10px] text-white/70 block line-clamp-1 mt-0.5">
                  {tagline}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
