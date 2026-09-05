import React from 'react';
import { ShieldCheck, Database, Waves, Activity, Info } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';

interface TrustStripProps {
  language: Language;
  isDarkMode?: boolean;
}

export const TrustStrip: React.FC<TrustStripProps> = ({ language, isDarkMode = false }) => {
  const t = getTranslation(language);

  return (
    <div className={`w-full flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-2xl backdrop-blur-md border text-xs text-white/90 shadow-sm transition-colors ${
      isDarkMode
        ? 'bg-slate-900/50 border-white/10'
        : 'bg-white/15 border-white/25 shadow-md'
    }`}>
      <div className="flex items-center space-x-1.5 font-semibold text-white">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
        <span className="text-[11px] tracking-wide uppercase font-bold text-white drop-shadow-sm">{t.dataYouCanTrust}:</span>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
        <div className="flex items-center space-x-1 text-white/90 hover:text-white transition">
          <Database className="w-3 h-3 text-sky-300" />
          <span><strong className="font-semibold text-white">IMD</strong> (Met Dept)</span>
        </div>
        <div className="flex items-center space-x-1 text-white/90 hover:text-white transition">
          <Activity className="w-3 h-3 text-emerald-300" />
          <span><strong className="font-semibold text-white">CPCB</strong> (National AQI)</span>
        </div>
        <div className="flex items-center space-x-1 text-white/90 hover:text-white transition">
          <Info className="w-3 h-3 text-indigo-300" />
          <span><strong className="font-semibold text-white">Open-Meteo</strong> (Live Global Grid)</span>
        </div>
        <div className="flex items-center space-x-1 text-white/90 hover:text-white transition">
          <Waves className="w-3 h-3 text-cyan-300" />
          <span><strong className="font-semibold text-white">INCOIS</strong> (Oceanics)</span>
        </div>
      </div>
    </div>
  );
};
