import React, { useState, useEffect } from 'react';
import { Bell, ShieldAlert, Check, X, Smartphone, Mail, AlertTriangle, Send } from 'lucide-react';
import { Language, LocationData } from '../types';
import { getLocalizedCityName, getTranslation } from '../utils/translations';

interface NotificationOptInProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: LocationData;
  language: Language;
}

const NOTIFICATION_PREF_KEY = 'skycast_notification_pref_v1';

export const NotificationOptIn: React.FC<NotificationOptInProps> = ({
  isOpen,
  onClose,
  currentLocation,
  language,
}) => {
  const [imdRedAlert, setImdRedAlert] = useState(true);
  const [aqiThreshold, setAqiThreshold] = useState(true);
  const [heatwaveAlert, setHeatwaveAlert] = useState(true);
  const [cycloneAlert, setCycloneAlert] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [testSent, setTestSent] = useState(false);

  const t = getTranslation(language);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(NOTIFICATION_PREF_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setImdRedAlert(parsed.imdRedAlert ?? true);
        setAqiThreshold(parsed.aqiThreshold ?? true);
        setHeatwaveAlert(parsed.heatwaveAlert ?? true);
        setCycloneAlert(parsed.cycloneAlert ?? true);
        setEmailInput(parsed.email || '');
      }
    } catch {}
  }, []);

  if (!isOpen) return null;

  const handleSave = () => {
    try {
      localStorage.setItem(
        NOTIFICATION_PREF_KEY,
        JSON.stringify({
          imdRedAlert,
          aqiThreshold,
          heatwaveAlert,
          cycloneAlert,
          email: emailInput,
          updatedAt: new Date().toISOString(),
        })
      );
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        onClose();
      }, 1500);
    } catch {}
  };

  const handleSendTestNotification = () => {
    setTestSent(true);
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('SkyCast India IMD Alert', {
        body: `Severe weather alert testing active for ${currentLocation.name}.`,
        icon: '/favicon.ico',
      });
    }
    setTimeout(() => setTestSent(false), 4000);
  };

  const requestBrowserPermission = async () => {
    if ('Notification' in window) {
      await Notification.requestPermission();
    }
  };

  const localizedCity = getLocalizedCityName(currentLocation.name, language);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-white space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{t.pushAlerts}</h3>
              <p className="text-xs text-slate-400">
                IMD severe weather warnings & CPCB hazardous AQI alerts for {localizedCity}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Channels */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Alert Triggers & Thresholds
          </div>

          <div className="space-y-2">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer hover:bg-slate-800/50 transition">
              <div className="flex items-center space-x-3">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-white">IMD Red & Orange Warnings</div>
                  <div className="text-xs text-slate-400">Heavy rainfall (&gt;64mm) & urban waterlogging warnings</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={imdRedAlert}
                onChange={(e) => setImdRedAlert(e.target.checked)}
                className="w-4 h-4 rounded text-sky-500 focus:ring-0 cursor-pointer accent-sky-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer hover:bg-slate-800/50 transition">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-white">Severe CPCB AQI Spikes</div>
                  <div className="text-xs text-slate-400">Notify when PM2.5 AQI surpasses 250 (Poor/Severe)</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={aqiThreshold}
                onChange={(e) => setAqiThreshold(e.target.checked)}
                className="w-4 h-4 rounded text-sky-500 focus:ring-0 cursor-pointer accent-sky-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer hover:bg-slate-800/50 transition">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-4 h-4 text-orange-400 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-white">Heatwave & Warm Nights</div>
                  <div className="text-xs text-slate-400">Daytime max temperatures ≥ 40°C or Heat Index &gt; 42°C</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={heatwaveAlert}
                onChange={(e) => setHeatwaveAlert(e.target.checked)}
                className="w-4 h-4 rounded text-sky-500 focus:ring-0 cursor-pointer accent-sky-500"
              />
            </label>
          </div>
        </div>

        {/* Email or SMS optional field */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            Email or WhatsApp Dispatch (Optional)
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="e.g. user@example.in or +91 98765 43210"
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
        </div>

        {/* Test Trigger Banner */}
        {testSent && (
          <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>Simulated test alert dispatched for {localizedCity}!</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => {
              requestBrowserPermission();
              handleSendTestNotification();
            }}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center space-x-1"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Test Alert</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition shadow-lg"
            >
              {isSaved ? <Check className="w-4 h-4" /> : null}
              <span>{isSaved ? 'Preferences Saved!' : 'Save & Opt In'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
