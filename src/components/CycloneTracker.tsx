import React from 'react';
import { Wind, ShieldAlert, Waves, Compass, AlertTriangle, Radio, X } from 'lucide-react';
import { CycloneData, Language } from '../types';
import { getTranslation } from '../utils/translations';

interface CycloneTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const CycloneTracker: React.FC<CycloneTrackerProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const t = getTranslation(language);

  if (!isOpen) return null;

  // IMD Standard Cyclone Scale Data
  const activeSystems: CycloneData[] = [
    {
      name: 'Bay of Bengal System (BoB-02)',
      basin: 'Bay of Bengal',
      intensity: 'Deep Depression',
      maxWindKmh: 65,
      centralPressureHpa: 994,
      affectedStates: ['Odisha', 'West Bengal', 'Andhra Pradesh'],
      status: 'Watch',
      advisoryEn: 'Squally weather with wind speed reaching 50-60 kmph gusting to 70 kmph over Westcentral & adjoining Northwest Bay of Bengal. Sea condition will be rough to very rough.',
      advisoryHi: 'पश्चिम-मध्य एवं उत्तर-पश्चिम बंगाल की खाड़ी में 50-60 किमी/घंटा की रफ्तार से तेज हवाएं। समुद्र में ऊंची लहरें। मछुआरों को गहरे समुद्र में न जाने की सलाह।',
      distanceKm: 280,
    },
    {
      name: 'Arabian Sea Maritime Trough',
      basin: 'Arabian Sea',
      intensity: 'Normal Sea State',
      maxWindKmh: 35,
      centralPressureHpa: 1008,
      affectedStates: ['Maharashtra', 'Goa', 'Gujarat'],
      status: 'Normal Monitoring',
      advisoryEn: 'Moderate swells with normal maritime tidal rhythms along the Konkan and Malabar coasts.',
      advisoryHi: 'कोंकण और मालाबार तट के किनारे सामान्य समुद्री ज्वार-भाटा और मध्यम लहरें।',
      distanceKm: 520,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-7 shadow-2xl text-white space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300">
              <Wind className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
                <span>{t.cycloneTrackerTitle}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  IMD Maritime Bulletins
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Authoritative cyclone tracking, depression stages, and coastal surge advisories
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

        {/* Cyclone Systems List */}
        <div className="space-y-4">
          {activeSystems.map((sys, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-3xl border ${
                sys.status === 'Watch'
                  ? 'bg-gradient-to-r from-cyan-950/70 via-blue-950/60 to-slate-950/80 border-cyan-500/40'
                  : 'bg-slate-950/60 border-slate-800'
              } shadow-lg space-y-3.5`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <Waves className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-extrabold text-base text-white">{sys.name}</h3>
                  <span className="text-xs text-slate-400">({sys.basin})</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                      sys.status === 'Watch'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                    }`}
                  >
                    {sys.status}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-200 border border-slate-700">
                    {sys.intensity}
                  </span>
                </div>
              </div>

              {/* Metrics strip */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Sustained Wind Speed</span>
                  <span className="font-bold text-white text-sm">{sys.maxWindKmh} km/h</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Central Pressure</span>
                  <span className="font-bold text-white text-sm">{sys.centralPressureHpa} hPa</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block text-[11px]">Coastline Proximity</span>
                  <span className="font-bold text-white text-sm">{sys.distanceKm} km offshore</span>
                </div>
              </div>

              {/* Advisory Text */}
              <p className="text-xs text-slate-300 leading-relaxed bg-black/30 p-3 rounded-2xl border border-white/5">
                {language === 'hi' ? sys.advisoryHi : sys.advisoryEn}
              </p>

              {/* Affected Coastal States */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-xs font-semibold text-slate-400">Monitored States:</span>
                {sys.affectedStates.map((st) => (
                  <span
                    key={st}
                    className="px-2.5 py-0.5 rounded-full bg-slate-800 text-[11px] font-medium text-slate-300 border border-slate-700"
                  >
                    {st}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* IMD Cyclone Classification Scale Guide */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
          <div className="font-bold uppercase tracking-wider text-slate-400 text-[11px]">
            IMD Cyclone Classification Standards:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
              <div className="font-bold text-sky-300">Depression</div>
              <div className="text-slate-400">31 - 49 km/h</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
              <div className="font-bold text-amber-300">Cyclonic Storm</div>
              <div className="text-slate-400">62 - 87 km/h</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
              <div className="font-bold text-orange-400">Severe Cyclone</div>
              <div className="text-slate-400">88 - 117 km/h</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
              <div className="font-bold text-rose-400">Super Cyclone</div>
              <div className="text-slate-400">≥ 222 km/h</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
