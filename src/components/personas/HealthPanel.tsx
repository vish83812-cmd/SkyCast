import React from 'react';
import {
  HeartPulse,
  Wind,
  Flower2,
  Sun,
  Droplets,
  AlertCircle,
  ShieldCheck,
  Activity,
  Smile,
} from 'lucide-react';
import { FullWeatherData, Language, SpeedUnit, TemperatureUnit } from '../../types';
import {
  formatTemp,
  getCpcbAqiInfo,
  getUvCategory,
} from '../../utils/formatters';
import { getTranslation } from '../../utils/translations';

interface HealthPanelProps {
  weather: FullWeatherData;
  tempUnit: TemperatureUnit;
  speedUnit: SpeedUnit;
  language: Language;
}

export const HealthPanel: React.FC<HealthPanelProps> = ({
  weather,
  tempUnit,
  language,
}) => {
  const { airPollution, pollen, current } = weather;
  const cpcbAqi = airPollution.cpcbAqi ?? (airPollution.aqi * 60);
  const cpcbInfo = getCpcbAqiInfo(cpcbAqi, language);
  const uvInfo = getUvCategory(current.uvi, language);
  const t = getTranslation(language);

  // Respiratory comfort calculation
  const getRespiratoryAdvice = () => {
    if (cpcbAqi <= 100 && current.humidity >= 40 && current.humidity <= 65) {
      return {
        label: language === 'hi' ? 'इष्टतम वायु और श्वसन आराम' : 'Optimal Air & Respiratory Comfort',
        desc: language === 'hi' ? 'स्वच्छ हवा और आरामदायक आर्द्रता। सभी बाहरी गतिविधियों और योग के लिए आदर्श।' : 'Clean air and comfortable humidity. Ideal for all outdoor activities, jogging, and yoga.',
        icon: Smile,
        color: 'text-emerald-300',
      };
    }
    if (cpcbAqi > 200) {
      return {
        label: language === 'hi' ? 'उच्च कण चेतावनी (प्रदूषण)' : 'Elevated Particulate Warning',
        desc: language === 'hi' ? 'अस्वास्थ्यकर हवा। संवेदनशील व्यक्ति, बच्चे और बुजुर्ग N95 मास्क पहनें।' : 'Unhealthy air quality. Sensitive individuals, children, and seniors should wear N95 masks outdoors.',
        icon: AlertCircle,
        color: 'text-rose-300',
      };
    }
    if (current.humidity > 75) {
      return {
        label: language === 'hi' ? 'उच्च आर्द्रता और उमस' : 'High Humidity & Muggy Air',
        desc: language === 'hi' ? 'मानसून की नम हवा अस्थमा रोगियों के लिए भारी हो सकती है। इनडोर वेंटिलेशन सुनिश्चित करें।' : 'Moist monsoon air may feel heavy for asthma patients. Ensure good indoor ventilation.',
        icon: Activity,
        color: 'text-amber-300',
      };
    }
    return {
      label: language === 'hi' ? 'शुष्क वायु चेतावनी' : 'Dry Air Warning',
      desc: language === 'hi' ? 'कम आर्द्रता नासिका मार्ग को सुखा सकती है। पानी और तरल पदार्थों से हाइड्रेटेड रहें।' : 'Low humidity may dry nasal passages. Stay hydrated with water and warm fluids.',
      icon: Droplets,
      color: 'text-sky-300',
    };
  };

  const respiratory = getRespiratoryAdvice();

  return (
    <div className="w-full space-y-6">
      {/* Persona Header Banner */}
      <div className="flex items-center justify-between pb-2 border-b border-white/20">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-white/20 border border-white/30 text-white">
            <HeartPulse className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">{t.personas.health.label}</h3>
            <p className="text-xs text-white/70">
              {t.personas.health.tagline} • CPCB India Standards & NCAP Calibrated
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center space-x-1 text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-md">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
          <span>CPCB & IMD Calibrated</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. CPCB Air Quality Index Gauge (0 - 500 Scale) */}
        <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 space-y-4 flex flex-col justify-between shadow-xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wind className="w-4 h-4 text-emerald-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                CPCB India AQI
              </span>
            </div>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${cpcbInfo.badgeBg} shadow-sm`}>
              {cpcbInfo.localizedCategory}
            </span>
          </div>

          {/* AQI Numeric & CPCB Scale */}
          <div className="space-y-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-black tracking-tight text-white">{cpcbAqi}</span>
              <span className="text-xs text-white/60 font-medium">/ 500 CPCB Index</span>
            </div>

            {/* 6-segment CPCB meter */}
            <div className="grid grid-cols-6 gap-1 h-3 rounded-full overflow-hidden bg-white/15 p-0.5 border border-white/20">
              <div
                title="Good (0-50)"
                className={`h-full rounded-sm ${cpcbAqi >= 0 ? 'bg-emerald-400' : 'bg-white/10'}`}
              />
              <div
                title="Satisfactory (51-100)"
                className={`h-full rounded-sm ${cpcbAqi > 50 ? 'bg-lime-400' : 'bg-white/10'}`}
              />
              <div
                title="Moderate (101-200)"
                className={`h-full rounded-sm ${cpcbAqi > 100 ? 'bg-amber-400' : 'bg-white/10'}`}
              />
              <div
                title="Poor (201-300)"
                className={`h-full rounded-sm ${cpcbAqi > 200 ? 'bg-orange-400' : 'bg-white/10'}`}
              />
              <div
                title="Very Poor (301-400)"
                className={`h-full rounded-sm ${cpcbAqi > 300 ? 'bg-rose-500' : 'bg-white/10'}`}
              />
              <div
                title="Severe (401-500)"
                className={`h-full rounded-sm ${cpcbAqi > 400 ? 'bg-purple-700' : 'bg-white/10'}`}
              />
            </div>

            <p className="text-xs text-white/80 leading-relaxed pt-1">
              {cpcbInfo.description}
            </p>
          </div>

          {/* Key Indian Particulates */}
          <div className="pt-3 border-t border-white/15 grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-xl bg-white/10 border border-white/15">
              <span className="text-white/60 block text-[10px]">PM2.5 (Fine)</span>
              <span className="font-bold text-white">{airPollution.components.pm2_5} μg/m³</span>
            </div>
            <div className="p-2 rounded-xl bg-white/10 border border-white/15">
              <span className="text-white/60 block text-[10px]">PM10 (Coarse)</span>
              <span className="font-bold text-white">{airPollution.components.pm10} μg/m³</span>
            </div>
          </div>
        </div>

        {/* 2. Indian Botanical Pollen Model */}
        <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 space-y-4 flex flex-col justify-between shadow-xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Flower2 className="w-4 h-4 text-lime-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                {language === 'hi' ? 'पराग एलर्जी' : 'Pollen Allergens'}
              </span>
            </div>
            <span className="text-[10px] font-semibold text-white bg-white/20 px-2 py-0.5 rounded-full border border-white/30 backdrop-blur-sm">
              Botany Model
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Tree Pollen */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-white/80">{language === 'hi' ? 'वृक्ष (नीम/आम)' : 'Tree (Neem/Mango)'}</span>
                <span className="text-lime-200 font-bold">{pollen.tree.level}</span>
              </div>
              <div className="w-full bg-white/15 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-lime-300 h-full rounded-full"
                  style={{ width: `${pollen.tree.value}%` }}
                />
              </div>
            </div>

            {/* Grass Pollen */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-white/80">{language === 'hi' ? 'घास (दूर्वा)' : 'Grass (Durva)'}</span>
                <span className="text-yellow-200 font-bold">{pollen.grass.level}</span>
              </div>
              <div className="w-full bg-white/15 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-yellow-300 h-full rounded-full"
                  style={{ width: `${pollen.grass.value}%` }}
                />
              </div>
            </div>

            {/* Weed Pollen */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-white/80">{language === 'hi' ? 'खरपतवार (गाजर घास)' : 'Weed (Parthenium)'}</span>
                <span className="text-sky-200 font-bold">{pollen.weed.level}</span>
              </div>
              <div className="w-full bg-white/15 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-sky-300 h-full rounded-full"
                  style={{ width: `${pollen.weed.value}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-white/10 border border-white/15 text-[11px] text-white/80">
            <span className="text-white/60 block text-[10px]">{language === 'hi' ? 'प्रमुख वनस्पति:' : 'Dominant Flora:'}</span>
            <span className="font-semibold text-white">{pollen.dominantPollen}</span>
          </div>
        </div>

        {/* 3. UV Index & Sun Protection Guidance */}
        <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 space-y-4 flex flex-col justify-between shadow-xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sun className="w-4 h-4 text-yellow-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                {t.uvIndex}
              </span>
            </div>
            <span className="text-xs font-bold text-white/90">
              {current.uvi} • {uvInfo.label}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-white">{current.uvi}</span>
              <span className="text-xs text-white/60 font-medium">/ 12 Peak UV</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 border border-white/15 space-y-1 backdrop-blur-sm">
              <span className="text-[11px] font-bold text-yellow-200 block">
                {language === 'hi' ? 'धूप सुरक्षा सलाह:' : 'Sunscreen Recommendation:'}
              </span>
              <p className="text-xs text-white/80 leading-relaxed">
                {uvInfo.advice}
              </p>
            </div>
          </div>

          <div className="text-[11px] text-white/70 pt-2 border-t border-white/15 flex justify-between">
            <span>{language === 'hi' ? 'अनुमानित बर्न समय:' : 'Burn Time Estimate:'}</span>
            <span className="font-semibold text-white">
              {current.uvi >= 8 ? '~15 mins' : current.uvi >= 5 ? '~35 mins' : '60+ mins'}
            </span>
          </div>
        </div>

        {/* 4. Humidity & Skin / Respiratory Comfort */}
        <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 space-y-4 flex flex-col justify-between shadow-xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-sky-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                {language === 'hi' ? 'श्वसन आराम' : 'Respiratory Comfort'}
              </span>
            </div>
            <span className="text-xs font-bold text-white bg-white/20 px-2 py-0.5 rounded-full border border-white/30">
              {current.humidity}% RH
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <respiratory.icon className="w-4 h-4 text-emerald-300" />
              <span className="text-xs font-bold text-white">
                {respiratory.label}
              </span>
            </div>
            <p className="text-xs text-white/80 leading-relaxed">{respiratory.desc}</p>
          </div>

          <div className="pt-3 border-t border-white/15 flex justify-between items-center text-xs">
            <span className="text-white/60">{t.dewPoint}:</span>
            <span className="font-bold text-white">{formatTemp(current.dew_point, tempUnit)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
