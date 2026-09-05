import { CpcbAqiCategory, Language, SpeedUnit, TemperatureUnit } from '../types';
import { getTranslation } from './translations';

export const LOCALE_MAP: Record<Language, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  kn: 'kn-IN',
};

export function formatTemp(tempC: number, unit: TemperatureUnit): string {
  if (unit === 'F') {
    return `${Math.round((tempC * 9) / 5 + 32)}°F`;
  }
  return `${Math.round(tempC)}°C`;
}

export function formatSpeed(speedMs: number, unit: SpeedUnit): string {
  if (unit === 'mph') {
    return `${Math.round(speedMs * 2.23694)} mph`;
  }
  return `${Math.round(speedMs * 3.6)} km/h`;
}

export function getWindDirectionName(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

export function formatTime(timestamp: number, timezoneOffset = 0, lang: Language = 'en'): string {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  const locale = LOCALE_MAP[lang] || 'en-IN';
  try {
    return date.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit', hour12: true });
  } catch {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  }
}

export function formatDayName(timestamp: number, lang: Language = 'en'): string {
  const date = new Date(timestamp * 1000);
  const today = new Date();
  const t = getTranslation(lang);
  if (date.toDateString() === today.toDateString()) return t.today;
  const locale = LOCALE_MAP[lang] || 'en-IN';
  try {
    return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date);
  } catch {
    return date.toLocaleDateString([], { weekday: 'short' });
  }
}

export function formatDateFull(timestamp: number, lang: Language = 'en'): string {
  const date = new Date(timestamp * 1000);
  const locale = LOCALE_MAP[lang] || 'en-IN';
  try {
    return new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
    }).format(date);
  } catch {
    return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
  }
}

/**
 * CPCB (Central Pollution Control Board) India AQI Scale:
 * 0 - 50: Good (Minimal impact)
 * 51 - 100: Satisfactory (Minor breathing discomfort to sensitive people)
 * 101 - 200: Moderate (Breathing discomfort to people with lungs, asthma and heart diseases)
 * 201 - 300: Poor (Breathing discomfort to most people on prolonged exposure)
 * 301 - 400: Very Poor (Respiratory illness on prolonged exposure)
 * 401 - 500: Severe (Affects healthy people and seriously impacts those with existing diseases)
 */
export function getCpcbAqiInfo(cpcbAqi: number, lang: Language = 'en'): {
  category: CpcbAqiCategory;
  localizedCategory: string;
  bg: string;
  badgeBg: string;
  text: string;
  border: string;
  description: string;
} {
  const t = getTranslation(lang);

  if (cpcbAqi <= 50) {
    return {
      category: 'Good',
      localizedCategory: t.aqiCategories.Good,
      bg: 'bg-emerald-500/20',
      badgeBg: 'bg-emerald-400 text-slate-900',
      text: 'text-emerald-300',
      border: 'border-emerald-400/40',
      description: lang === 'hi'
        ? 'न्यूनतम प्रभाव। सभी बाहरी गतिविधियों और व्यायाम के लिए आदर्श।'
        : 'Minimal impact. Ideal for all outdoor activities and exercise.',
    };
  }
  if (cpcbAqi <= 100) {
    return {
      category: 'Satisfactory',
      localizedCategory: t.aqiCategories.Satisfactory,
      bg: 'bg-lime-500/20',
      badgeBg: 'bg-lime-400 text-slate-900',
      text: 'text-lime-300',
      border: 'border-lime-400/40',
      description: lang === 'hi'
        ? 'संवेदनशील व्यक्तियों को सांस लेने में मामूली असुविधा हो सकती है। सामान्यतः सुरक्षित।'
        : 'Minor breathing discomfort to sensitive people. Generally safe.',
    };
  }
  if (cpcbAqi <= 200) {
    return {
      category: 'Moderate',
      localizedCategory: t.aqiCategories.Moderate,
      bg: 'bg-amber-500/20',
      badgeBg: 'bg-amber-400 text-slate-900',
      text: 'text-amber-300',
      border: 'border-amber-400/40',
      description: lang === 'hi'
        ? 'अस्थमा या फेफड़ों/हृदय रोग वाले लोगों को सांस लेने में कठिनाई हो सकती है।'
        : 'Breathing discomfort to people with asthma or lung/heart issues.',
    };
  }
  if (cpcbAqi <= 300) {
    return {
      category: 'Poor',
      localizedCategory: t.aqiCategories.Poor,
      bg: 'bg-orange-500/20',
      badgeBg: 'bg-orange-400 text-slate-900',
      text: 'text-orange-300',
      border: 'border-orange-400/40',
      description: lang === 'hi'
        ? 'लंबे समय तक संपर्क में रहने पर अधिकांश लोगों को सांस लेने में परेशानी। N95 मास्क पहनें।'
        : 'Breathing discomfort to most people on prolonged exposure. Wear N95 masks.',
    };
  }
  if (cpcbAqi <= 400) {
    return {
      category: 'Very Poor',
      localizedCategory: t.aqiCategories['Very Poor'],
      bg: 'bg-rose-500/25',
      badgeBg: 'bg-rose-400 text-white',
      text: 'text-rose-300',
      border: 'border-rose-400/40',
      description: lang === 'hi'
        ? 'लंबे समय तक संपर्क से श्वसन संबंधी बीमारियां हो सकती हैं। बाहरी गतिविधियों को सीमित करें।'
        : 'Respiratory illness on prolonged exposure. Limit outdoor activities.',
    };
  }
  return {
    category: 'Severe',
    localizedCategory: t.aqiCategories.Severe,
    bg: 'bg-purple-950/40',
    badgeBg: 'bg-red-700 text-white',
    text: 'text-rose-400',
    border: 'border-rose-600/50',
    description: lang === 'hi'
      ? 'स्वस्थ लोगों को भी प्रभावित करता है; श्वसन रोगियों के लिए आपातकालीन स्वास्थ्य जोखिम।'
      : 'Affects healthy people; emergency health hazard for those with respiratory issues.',
  };
}

export function getUvCategory(uv: number, lang: Language = 'en'): { label: string; color: string; advice: string } {
  if (uv < 3) {
    return {
      label: lang === 'hi' ? 'निम्न (Low)' : 'Low',
      color: 'text-emerald-400',
      advice: lang === 'hi' ? 'न्यूनतम धूप संरक्षण आवश्यक।' : 'Minimal sun protection required.',
    };
  }
  if (uv < 6) {
    return {
      label: lang === 'hi' ? 'मध्यम (Moderate)' : 'Moderate',
      color: 'text-amber-400',
      advice: lang === 'hi' ? 'सनस्क्रीन और धूप का चश्मा पहनें।' : 'Wear SPF 30+ sunscreen and sunglasses.',
    };
  }
  if (uv < 8) {
    return {
      label: lang === 'hi' ? 'उच्च (High)' : 'High',
      color: 'text-orange-400',
      advice: lang === 'hi' ? 'दोपहर में धूप से बचें।' : 'Protection required. Seek shade during midday.',
    };
  }
  if (uv < 11) {
    return {
      label: lang === 'hi' ? 'अत्यधिक उच्च (Very High)' : 'Very High',
      color: 'text-rose-400',
      advice: lang === 'hi' ? 'अतिरिक्त सुरक्षा की आवश्यकता। दोपहर की धूप से बचें।' : 'Extra protection needed. Avoid midday sun.',
    };
  }
  return {
    label: lang === 'hi' ? 'चरम (Extreme)' : 'Extreme',
    color: 'text-purple-400',
    advice: lang === 'hi' ? 'सभी सावधानियां बरतें। त्वचा को तुरंत नुकसान हो सकता है।' : 'Take all precautions. Skin damage can occur in minutes.',
  };
}
