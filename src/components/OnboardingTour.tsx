import React, { useState, useEffect } from 'react';
import { Sparkles, Search, Users, Layers, Share2, ArrowRight, Check, X } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';

interface OnboardingTourProps {
  language: Language;
}

const TOUR_STORAGE_KEY = 'skycast_onboarding_completed_v2';

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const t = getTranslation(language);

  useEffect(() => {
    try {
      const completed = localStorage.getItem(TOUR_STORAGE_KEY);
      if (!completed) {
        const timer = setTimeout(() => setIsOpen(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  const handleComplete = () => {
    setIsOpen(false);
    try {
      localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    } catch {}
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  if (!isOpen) return null;

  const steps = [
    {
      title: t.tourStep1Title,
      description: t.tourStep1Desc,
      icon: <Search className="w-6 h-6 text-sky-400" />,
      badge: 'Step 1 of 4',
      targetLabel: 'Instant India Search',
    },
    {
      title: t.tourStep2Title,
      description: t.tourStep2Desc,
      icon: <Users className="w-6 h-6 text-emerald-400" />,
      badge: 'Step 2 of 4',
      targetLabel: '8 Specialized Personas',
    },
    {
      title: t.tourStep3Title,
      description: t.tourStep3Desc,
      icon: <Layers className="w-6 h-6 text-indigo-400" />,
      badge: 'Step 3 of 4',
      targetLabel: 'Comparison & India Map',
    },
    {
      title: t.tourStep4Title,
      description: t.tourStep4Desc,
      icon: <Share2 className="w-6 h-6 text-pink-400" />,
      badge: 'Step 4 of 4',
      targetLabel: 'WhatsApp & 7 Languages',
    },
  ];

  const current = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl text-white space-y-5 relative">
        {/* Close Button */}
        <button
          onClick={handleComplete}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title={t.skipTour}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Step Indicator and Icon */}
        <div className="flex items-center justify-between">
          <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 shadow-inner">
            {current.icon}
          </div>
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
            {current.badge}
          </span>
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white tracking-tight">
            {current.title}
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            {current.description}
          </p>
        </div>

        {/* Step Dots */}
        <div className="flex items-center space-x-1.5 pt-2">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentStep ? 'w-8 bg-sky-400' : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleComplete}
            className="text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            {t.skipTour}
          </button>

          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center space-x-2 transition shadow-lg"
          >
            <span>{currentStep === 3 ? t.gotIt : t.next}</span>
            {currentStep === 3 ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
