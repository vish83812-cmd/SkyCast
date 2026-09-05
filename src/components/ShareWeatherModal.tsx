import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import {
  X,
  Share2,
  Download,
  Copy,
  Check,
  Loader2,
  Sparkles,
  MapPin,
  Calendar,
  Compass,
} from 'lucide-react';
import { FullWeatherData, Language, TemperatureUnit } from '../types';
import { formatDateFull, formatTemp, getCpcbAqiInfo } from '../utils/formatters';
import { getLocalizedCityName, getTranslation, translateCondition } from '../utils/translations';
import { WeatherIcon } from './WeatherIcon';

interface ShareWeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
  weather: FullWeatherData;
  language: Language;
  tempUnit: TemperatureUnit;
}

export const ShareWeatherModal: React.FC<ShareWeatherModalProps> = ({
  isOpen,
  onClose,
  weather,
  language,
  tempUnit,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const t = getTranslation(language);

  if (!isOpen) return null;

  const { location, current, airPollution } = weather;
  const localizedCity = getLocalizedCityName(location.name, language);
  const aqiInfo = getCpcbAqiInfo(airPollution.cpcbAqi, language);

  const shareText = `🇮🇳 SkyCast Weather Snapshot for ${localizedCity}, India:
🌡️ Temp: ${formatTemp(current.temp, tempUnit)} (Feels like ${formatTemp(current.feels_like, tempUnit)})
☁️ Condition: ${translateCondition(current.weather[0]?.description || 'Clear sky', language)}
💨 Wind: ${Math.round(current.wind_speed * 3.6)} km/h | 💧 Humidity: ${current.humidity}%
🏭 CPCB AQI: ${airPollution.cpcbAqi} (${aqiInfo.localizedCategory})
📡 Live IMD & CPCB data on SkyCast India.`;

  const handleShareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 3000);
    } catch {}
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#0f172a',
        useCORS: true,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `SkyCast-${location.name}-Weather.png`;
      link.href = dataUrl;
      link.click();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to generate card image', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-white space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-300">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{t.shareCard}</h3>
              <p className="text-xs text-slate-400">Export high-resolution snapshot for WhatsApp or Socials</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Snapshot Card to be exported as Image */}
        <div
          ref={cardRef}
          className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-slate-700 shadow-2xl space-y-5 text-white"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-400/30">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-black text-xl tracking-tight text-white">SkyCast India</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              IMD · CPCB Live
            </span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-sky-400" />
                <h4 className="text-2xl font-black text-white">{localizedCity}</h4>
              </div>
              <p className="text-xs text-slate-400 ml-5">
                {location.state ? `${location.state}, ` : ''}India
              </p>
              <p className="text-[11px] text-slate-400 ml-5 mt-1 flex items-center space-x-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>{formatDateFull(current.dt, language)}</span>
              </p>
            </div>

            <div className="text-right">
              <div className="flex items-center justify-end space-x-2">
                <WeatherIcon
                  condition={current.weather[0]?.main || 'Clear'}
                  iconCode={current.weather[0]?.icon || '01d'}
                  className="w-12 h-12"
                />
                <span className="text-4xl font-black tracking-tight text-white">
                  {formatTemp(current.temp, tempUnit)}
                </span>
              </div>
              <p className="text-xs text-slate-300 capitalize font-medium">
                {translateCondition(current.weather[0]?.description || 'Clear sky', language)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className={`p-2.5 rounded-2xl border ${aqiInfo.bg} ${aqiInfo.border}`}>
              <div className="text-[10px] uppercase font-bold text-slate-300">CPCB AQI Index</div>
              <div className="text-sm font-black text-white mt-0.5">
                {airPollution.cpcbAqi} · {aqiInfo.localizedCategory}
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div className="text-[10px] uppercase font-bold text-slate-400">Precipitation & Wind</div>
              <div className="text-sm font-black text-white mt-0.5">
                {Math.round((weather.daily[0]?.pop || 0) * 100)}% Rain · {Math.round(current.wind_speed * 3.6)} km/h
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <button
            onClick={handleShareWhatsApp}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition shadow-lg"
          >
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handleCopyText}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition border border-slate-700 shadow-md"
          >
            {copiedText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-sky-400" />}
            <span>{copiedText ? 'Copied Text!' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handleDownloadImage}
            disabled={isGenerating}
            className="px-4 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 transition shadow-lg"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : downloadSuccess ? (
              <Check className="w-4 h-4" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{downloadSuccess ? 'Downloaded!' : 'Save PNG'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
