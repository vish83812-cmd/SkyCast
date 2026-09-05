import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, X, ChevronRight, Wind, CloudRain, Flame } from 'lucide-react';
import { Language, WeatherAlert } from '../types';
import { formatTime } from '../utils/formatters';
import { getTranslation } from '../utils/translations';

interface WeatherAlertsBannerProps {
  alerts: WeatherAlert[];
  language: Language;
}

export const WeatherAlertsBanner: React.FC<WeatherAlertsBannerProps> = ({
  alerts,
  language,
}) => {
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);

  const t = getTranslation(language);

  if (!alerts || alerts.length === 0) return null;

  const activeAlerts = alerts.filter((a) => !dismissedAlerts.includes(a.event));
  if (activeAlerts.length === 0) return null;

  const handleDismiss = (event: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissedAlerts([...dismissedAlerts, event]);
  };

  const getAlertSeverityStyle = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'extreme':
      case 'red':
        return {
          bg: 'bg-gradient-to-r from-red-950/90 via-rose-950/80 to-slate-950/90',
          border: 'border-rose-500/50',
          badge: 'bg-rose-500/30 text-rose-200 border-rose-400/40',
          icon: <ShieldAlert className="w-5 h-5 text-rose-300 shrink-0" />,
        };
      case 'severe':
      case 'orange':
        return {
          bg: 'bg-gradient-to-r from-orange-950/90 via-amber-950/80 to-slate-950/90',
          border: 'border-orange-500/50',
          badge: 'bg-orange-500/30 text-orange-200 border-orange-400/40',
          icon: <AlertTriangle className="w-5 h-5 text-orange-300 shrink-0" />,
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-amber-950/80 via-yellow-950/70 to-slate-950/80',
          border: 'border-amber-500/40',
          badge: 'bg-amber-500/25 text-amber-200 border-amber-400/30',
          icon: <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0" />,
        };
    }
  };

  return (
    <div className="w-full space-y-2">
      {activeAlerts.map((alert) => {
        const style = getAlertSeverityStyle(alert.severity);
        const isExpanded = expandedAlert === alert.event;

        return (
          <div
            key={alert.event}
            onClick={() => setExpandedAlert(isExpanded ? null : alert.event)}
            className={`w-full rounded-3xl ${style.bg} backdrop-blur-xl border ${style.border} p-4 shadow-xl text-white transition cursor-pointer`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-2xl bg-white/10 shrink-0 mt-0.5">
                  {style.icon}
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-extrabold text-sm md:text-base text-white">
                      {alert.event}
                    </h3>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${style.badge}`}>
                      {alert.severity} Alert
                    </span>
                    <span className="text-[10px] text-white/60">
                      {alert.sender_name}
                    </span>
                  </div>

                  <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                    {alert.description}
                  </p>

                  <div className="flex items-center space-x-3 text-[11px] text-white/60 pt-1">
                    <span>Valid until: {formatTime(alert.end, 0, language)}</span>
                    <span className="text-sky-300 underline font-medium flex items-center space-x-0.5">
                      <span>{isExpanded ? 'Show less' : 'View safety protocol'}</span>
                      <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={(e) => handleDismiss(alert.event, e)}
                className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Expanded details */}
            {isExpanded && (
              <div className="mt-3 pt-3 border-t border-white/10 space-y-2 animate-in fade-in duration-150 text-xs">
                <div className="font-bold text-white/90">Official IMD Advisory Details:</div>
                <p className="text-slate-200 leading-relaxed bg-black/30 p-3 rounded-2xl">
                  {alert.description}
                </p>
                {alert.tags && alert.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {alert.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-white/80">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
