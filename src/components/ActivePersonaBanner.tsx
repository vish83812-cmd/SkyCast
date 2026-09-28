import React from 'react';
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
  Sparkles,
  ArrowRightLeft,
} from 'lucide-react';
import { Language, PersonaId } from '../types';
import { getTranslation } from '../utils/translations';

interface ActivePersonaBannerProps {
  activeMode: PersonaId;
  onOpenPurposeGateway: () => void;
  language: Language;
  isDarkMode: boolean;
}

export const ActivePersonaBanner: React.FC<ActivePersonaBannerProps> = ({
  activeMode,
  onOpenPurposeGateway,
  language,
}) => {
  const t = getTranslation(language);
  const personaData = t.personas[activeMode];

  const getPersonaIcon = (id: PersonaId) => {
    switch (id) {
      case 'health': return <Activity className="w-6 h-6 text-emerald-400" />;
      case 'fitness': return <Footprints className="w-6 h-6 text-sky-400" />;
      case 'beach': return <Waves className="w-6 h-6 text-cyan-400" />;
      case 'travel': return <Plane className="w-6 h-6 text-indigo-400" />;
      case 'family': return <Baby className="w-6 h-6 text-amber-400" />;
      case 'agriculture': return <Sprout className="w-6 h-6 text-lime-400" />;
      case 'commuter': return <Train className="w-6 h-6 text-orange-400" />;
      case 'events': return <PartyPopper className="w-6 h-6 text-purple-400" />;
      default: return <Activity className="w-6 h-6 text-emerald-400" />;
    }
  };

  const getPersonaColor = (id: PersonaId) => {
    switch (id) {
      case 'health': return 'from-emerald-500/20 via-teal-500/10 border-emerald-500/40 text-emerald-300';
      case 'fitness': return 'from-sky-500/20 via-blue-500/10 border-sky-500/40 text-sky-300';
      case 'beach': return 'from-cyan-500/20 via-blue-600/10 border-cyan-500/40 text-cyan-300';
      case 'travel': return 'from-indigo-500/20 via-purple-500/10 border-indigo-500/40 text-indigo-300';
      case 'family': return 'from-amber-500/20 via-orange-500/10 border-amber-500/40 text-amber-300';
      case 'agriculture': return 'from-lime-500/20 via-emerald-600/10 border-lime-500/40 text-lime-300';
      case 'commuter': return 'from-orange-500/20 via-red-500/10 border-orange-500/40 text-orange-300';
      case 'events': return 'from-purple-500/20 via-pink-500/10 border-purple-500/40 text-purple-300';
      default: return 'from-emerald-500/20 via-teal-500/10 border-emerald-500/40 text-emerald-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-5 rounded-3xl bg-slate-900/80 backdrop-blur-2xl border bg-gradient-to-r ${getPersonaColor(activeMode)} shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}
    >
      <div className="flex items-center space-x-4">
        <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 shadow-inner shrink-0">
          {getPersonaIcon(activeMode)}
        </div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-white/15 text-white border border-white/20">
              Who You Are Today
            </span>
            <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {personaData.label}
          </h2>
          <p className="text-xs sm:text-sm text-white/80 font-medium leading-relaxed">
            {personaData.tagline}
          </p>
        </div>
      </div>

      <button
        onClick={onOpenPurposeGateway}
        className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-bold backdrop-blur-md transition shadow-lg flex items-center space-x-2 shrink-0 group"
      >
        <ArrowRightLeft className="w-4 h-4 text-emerald-300 group-hover:rotate-180 transition-transform duration-500" />
        <span>Switch Persona / Purpose</span>
      </button>
    </motion.div>
  );
};
