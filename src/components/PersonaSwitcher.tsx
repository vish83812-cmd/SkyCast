import React from 'react';
import {
  Activity,
  Footprints,
  Waves,
  Plane,
  Baby,
  Sprout,
  Train,
  PartyPopper,
} from 'lucide-react';
import { Language, PersonaId } from '../types';
import { getTranslation } from '../utils/translations';

interface PersonaSwitcherProps {
  activePersona: PersonaId;
  onSelectPersona: (id: PersonaId) => void;
  language: Language;
}

export const PersonaSwitcher: React.FC<PersonaSwitcherProps> = ({
  activePersona,
  onSelectPersona,
  language,
}) => {
  const t = getTranslation(language);

  const personas: {
    id: PersonaId;
    icon: React.ReactNode;
    color: string;
    activeBg: string;
  }[] = [
    {
      id: 'health',
      icon: <Activity className="w-4 h-4" />,
      color: 'text-emerald-400',
      activeBg: 'bg-emerald-500/25 border-emerald-400/50 text-white shadow-emerald-500/20',
    },
    {
      id: 'fitness',
      icon: <Footprints className="w-4 h-4" />,
      color: 'text-sky-400',
      activeBg: 'bg-sky-500/25 border-sky-400/50 text-white shadow-sky-500/20',
    },
    {
      id: 'beach',
      icon: <Waves className="w-4 h-4" />,
      color: 'text-cyan-400',
      activeBg: 'bg-cyan-500/25 border-cyan-400/50 text-white shadow-cyan-500/20',
    },
    {
      id: 'travel',
      icon: <Plane className="w-4 h-4" />,
      color: 'text-indigo-400',
      activeBg: 'bg-indigo-500/25 border-indigo-400/50 text-white shadow-indigo-500/20',
    },
    {
      id: 'family',
      icon: <Baby className="w-4 h-4" />,
      color: 'text-amber-400',
      activeBg: 'bg-amber-500/25 border-amber-400/50 text-white shadow-amber-500/20',
    },
    {
      id: 'agriculture',
      icon: <Sprout className="w-4 h-4" />,
      color: 'text-lime-400',
      activeBg: 'bg-lime-500/25 border-lime-400/50 text-white shadow-lime-500/20',
    },
    {
      id: 'commuter',
      icon: <Train className="w-4 h-4" />,
      color: 'text-orange-400',
      activeBg: 'bg-orange-500/25 border-orange-400/50 text-white shadow-orange-500/20',
    },
    {
      id: 'events',
      icon: <PartyPopper className="w-4 h-4" />,
      color: 'text-purple-400',
      activeBg: 'bg-purple-500/25 border-purple-400/50 text-white shadow-purple-500/20',
    },
  ];

  return (
    <div className="w-full space-y-2">
      {/* Title */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-white/80">
          {t.whoAreYouToday}
        </h3>
        <span className="text-[11px] text-white/50 hidden sm:inline">
          {t.selectPersonaHelp}
        </span>
      </div>

      {/* Horizontal scrollable tabs on mobile, responsive wrapped grid on larger screens */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none md:grid md:grid-cols-4 lg:grid-cols-8 md:gap-2.5 md:space-x-0">
        {personas.map((p) => {
          const isActive = activePersona === p.id;
          const personaData = t.personas[p.id];
          return (
            <button
              key={p.id}
              onClick={() => onSelectPersona(p.id)}
              className={`shrink-0 md:w-full flex items-center md:flex-col md:items-center text-left md:text-center p-3 rounded-2xl border transition-all duration-200 ${
                isActive
                  ? `${p.activeBg} shadow-lg scale-102 border-opacity-80`
                  : 'bg-slate-900/50 border-white/10 hover:bg-slate-800/70 hover:border-white/20 text-white/70'
              }`}
            >
              <div
                className={`p-2 rounded-xl mb-0 md:mb-1.5 mr-2.5 md:mr-0 ${
                  isActive ? 'bg-white/15' : 'bg-black/20'
                } ${p.color}`}
              >
                {p.icon}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold whitespace-nowrap md:whitespace-normal truncate md:truncate-none text-white">
                  {personaData.label}
                </div>
                <div className="hidden lg:block text-[10px] text-white/60 line-clamp-1 mt-0.5">
                  {personaData.tagline}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
