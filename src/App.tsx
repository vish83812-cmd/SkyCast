/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertCircle,
  Compass,
  RefreshCw,
  Radio,
  WifiOff,
} from 'lucide-react';
import {
  FullWeatherData,
  Language,
  LocationData,
  PersonaId,
  SpeedUnit,
  TemperatureUnit,
} from './types';
import {
  fetchWeatherData,
  POPULAR_LOCATIONS,
} from './services/weatherService';
import { WeatherHeader } from './components/WeatherHeader';
import { TrustStrip } from './components/TrustStrip';
import { SeasonalAdvisoryBanner } from './components/SeasonalAdvisoryBanner';
import { WeatherAlertsBanner } from './components/WeatherAlertsBanner';
import { ModeSwitcher } from './components/ModeSwitcher';
import { CurrentConditionsCard } from './components/CurrentConditionsCard';
import { ForecastStrip } from './components/ForecastStrip';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { CityComparisonModal } from './components/CityComparisonModal';
import { IndiaWeatherMap } from './components/IndiaWeatherMap';
import { IndiaLiveMapSection } from './components/IndiaLiveMapSection';
import { CycloneTracker } from './components/CycloneTracker';
import { FestivalTravelOverlay } from './components/FestivalTravelOverlay';
import { ShareWeatherModal } from './components/ShareWeatherModal';
import { NotificationOptIn } from './components/NotificationOptIn';
import { OnboardingTour } from './components/OnboardingTour';
import { getTranslation } from './utils/translations';

// Persona panel components
import { HealthPanel } from './components/personas/HealthPanel';
import { FitnessPanel } from './components/personas/FitnessPanel';
import { BeachPanel } from './components/personas/BeachPanel';
import { TravelPanel } from './components/personas/TravelPanel';
import { FamilyPanel } from './components/personas/FamilyPanel';
import { AgriculturePanel } from './components/personas/AgriculturePanel';
import { CommuterPanel } from './components/personas/CommuterPanel';
import { EventPlannerPanel } from './components/personas/EventPlannerPanel';

export default function App() {
  // 1. Language state (English / Hindi / Marathi / Bengali / Tamil / Telugu / Kannada)
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('skycast_language') as Language;
      if (['en', 'hi', 'mr', 'bn', 'ta', 'te', 'kn'].includes(saved)) return saved;
    } catch {}
    return 'en';
  });

  // 2. Mode state (persisted in localStorage)
  const [activeMode, setActiveMode] = useState<PersonaId>(() => {
    try {
      const saved = localStorage.getItem('skycast_last_mode');
      if (saved) return saved as PersonaId;
    } catch {}
    return 'health';
  });

  // 3. Active Indian location state (Default: Mumbai)
  const [currentLocation, setCurrentLocation] = useState<LocationData>(() => {
    try {
      const saved = localStorage.getItem('skycast_active_location_in');
      if (saved) return JSON.parse(saved);
    } catch {}
    return POPULAR_LOCATIONS[0]; // Mumbai
  });

  // 4. Favorites state (Major Indian metros by default)
  const [favorites, setFavorites] = useState<LocationData[]>(() => {
    try {
      const saved = localStorage.getItem('skycast_favorites_in');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      POPULAR_LOCATIONS[0], // Mumbai
      POPULAR_LOCATIONS[1], // Delhi
      POPULAR_LOCATIONS[2], // Bengaluru
      POPULAR_LOCATIONS[3], // Chennai
      POPULAR_LOCATIONS[4], // Kolkata
    ];
  });

  // 5. Units state (Default: °C and km/h)
  const [tempUnit, setTempUnit] = useState<TemperatureUnit>(() => {
    try {
      const saved = localStorage.getItem('skycast_temp_unit');
      if (saved) return saved as TemperatureUnit;
    } catch {}
    return 'C';
  });

  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>(() => {
    try {
      const saved = localStorage.getItem('skycast_speed_unit');
      if (saved) return saved as SpeedUnit;
    } catch {}
    return 'kmh';
  });

  // 6. Theme state (Frosted Glass with ambient gradients)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('skycast_theme');
      if (saved !== null) return saved === 'dark';
    } catch {}
    return true;
  });

  // 7. Weather data state
  const [weatherData, setWeatherData] = useState<FullWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 8. Modals state
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isCycloneOpen, setIsCycloneOpen] = useState(false);
  const [isFestivalsOpen, setIsFestivalsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const t = getTranslation(language);

  // Load live weather data from real APIs
  const loadWeather = useCallback(async (loc: LocationData) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(loc);
      setWeatherData(data);
      localStorage.setItem('skycast_active_location_in', JSON.stringify(loc));
    } catch (err: any) {
      console.error('Failed to load live Indian weather data:', err);
      setError(
        err.message ||
          'Unable to retrieve real-time data from IMD/Open-Meteo. Please check network connectivity or choose another Indian city.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeather(currentLocation);
  }, [currentLocation, loadWeather]);

  // Handlers
  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('skycast_language', lang);
  };

  const handleSelectMode = (mode: PersonaId) => {
    setActiveMode(mode);
    try {
      localStorage.setItem('skycast_last_mode', mode);
    } catch {}
  };

  const handleToggleTempUnit = () => {
    const next = tempUnit === 'C' ? 'F' : 'C';
    setTempUnit(next);
    localStorage.setItem('skycast_temp_unit', next);
  };

  const handleToggleSpeedUnit = () => {
    const next = speedUnit === 'kmh' ? 'mph' : 'kmh';
    setSpeedUnit(next);
    localStorage.setItem('skycast_speed_unit', next);
  };

  const handleToggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem('skycast_theme', next ? 'dark' : 'light');
  };

  const handleToggleFavorite = (loc: LocationData) => {
    const exists = favorites.some((f) => f.name.toLowerCase() === loc.name.toLowerCase());
    let updated: LocationData[];
    if (exists) {
      updated = favorites.filter((f) => f.name.toLowerCase() !== loc.name.toLowerCase());
    } else {
      updated = [loc, ...favorites];
    }
    setFavorites(updated);
    localStorage.setItem('skycast_favorites_in', JSON.stringify(updated));
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 font-sans ${
        isDarkMode
          ? 'bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white'
          : 'bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-700 text-white'
      }`}
    >
      {/* Background ambient gradient glow orbs for frosted glass effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-sky-400/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-purple-500/25 rounded-full blur-3xl" />
        <div className="absolute top-2/3 left-10 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-yellow-400/15 rounded-full blur-3xl" />
      </div>

      {/* 4-Step First Visit Onboarding Tour */}
      <OnboardingTour language={language} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Global Shared Top Navigation & Header */}
        <WeatherHeader
          currentLocation={currentLocation}
          onSelectLocation={(loc) => setCurrentLocation(loc)}
          tempUnit={tempUnit}
          speedUnit={speedUnit}
          onToggleTempUnit={handleToggleTempUnit}
          onToggleSpeedUnit={handleToggleSpeedUnit}
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
          language={language}
          onSelectLanguage={handleSelectLanguage}
          onOpenCompare={() => setIsCompareOpen(true)}
          onOpenMap={() => setIsMapOpen(true)}
          onOpenShare={() => setIsShareOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenFestivals={() => setIsFestivalsOpen(true)}
          onOpenCyclone={() => setIsCycloneOpen(true)}
        />

        {/* Data You Can Trust Strip */}
        <TrustStrip language={language} isDarkMode={isDarkMode} />

        {/* Offline Cached Data Indicator */}
        {weatherData?.isCached && (
          <div className="p-3.5 rounded-2xl bg-amber-500/20 backdrop-blur-md border border-amber-400/40 text-amber-100 flex items-center justify-between text-xs shadow-xl">
            <div className="flex items-center space-x-2.5">
              <WifiOff className="w-4 h-4 text-amber-300 shrink-0" />
              <span>
                <strong>{t.cachedDataBanner}:</strong>{' '}
                {new Date(weatherData.cachedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <button
              onClick={() => loadWeather(currentLocation)}
              className="px-3 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold transition"
            >
              {t.retryBtn}
            </button>
          </div>
        )}

        {/* Loading State Skeleton */}
        {isLoading && !weatherData && <LoadingSkeleton />}

        {/* Live API Error Notice */}
        {error && (
          <div className="p-6 rounded-3xl bg-rose-500/20 backdrop-blur-md border border-rose-500/40 text-rose-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-rose-300 shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-rose-200">Live Meteorological Service Error</h4>
                <p className="text-xs text-rose-100/90">{error}</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentLocation(POPULAR_LOCATIONS[0])}
              className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 text-white text-xs font-semibold backdrop-blur-md transition shadow-md shrink-0"
            >
              Reset to Mumbai
            </button>
          </div>
        )}

        {/* Active Weather Dashboard */}
        {weatherData && (
          <div className="space-y-6">
            {/* Generalized Seasonal Advisory Banner (Monsoon / Heatwave / Winter Fog / Cyclone) */}
            <SeasonalAdvisoryBanner weather={weatherData} language={language} isDarkMode={isDarkMode} />

            {/* IMD Severe Weather Warning Alerts Banner */}
            {weatherData.alerts && weatherData.alerts.length > 0 && (
              <WeatherAlertsBanner alerts={weatherData.alerts} language={language} />
            )}

            {/* 1. Global Shared Section (Current Conditions + 7-Day Forecast Strip) */}
            <section id="global-weather-section" className="space-y-6">
              <CurrentConditionsCard
                weather={weatherData}
                tempUnit={tempUnit}
                speedUnit={speedUnit}
                language={language}
              />

              <ForecastStrip
                daily={weatherData.daily}
                hourly={weatherData.hourly}
                tempUnit={tempUnit}
                speedUnit={speedUnit}
                timezoneOffset={weatherData.timezone_offset}
                language={language}
              />
            </section>

            {/* 2. Persona Mode Switcher ("Who are you today?") */}
            <section id="persona-selector-section" className="pt-2">
              <ModeSwitcher
                activeMode={activeMode}
                onSelectMode={handleSelectMode}
                language={language}
              />
            </section>

            {/* 3. Persona Dynamic Content Panel (Changes Based on Selected Mode) */}
            <section id="persona-content-section" className="pt-2 min-h-[360px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMode}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  {activeMode === 'health' && (
                    <HealthPanel
                      weather={weatherData}
                      tempUnit={tempUnit}
                      speedUnit={speedUnit}
                      language={language}
                    />
                  )}

                  {activeMode === 'fitness' && (
                    <FitnessPanel
                      weather={weatherData}
                      tempUnit={tempUnit}
                      speedUnit={speedUnit}
                    />
                  )}

                  {activeMode === 'beach' && (
                    <BeachPanel
                      weather={weatherData}
                      tempUnit={tempUnit}
                      speedUnit={speedUnit}
                    />
                  )}

                  {activeMode === 'travel' && (
                    <TravelPanel
                      weather={weatherData}
                      tempUnit={tempUnit}
                      speedUnit={speedUnit}
                      favorites={favorites}
                      onSelectCity={(loc) => setCurrentLocation(loc)}
                    />
                  )}

                  {activeMode === 'family' && (
                    <FamilyPanel
                      weather={weatherData}
                      tempUnit={tempUnit}
                      speedUnit={speedUnit}
                    />
                  )}

                  {activeMode === 'agriculture' && (
                    <AgriculturePanel
                      weather={weatherData}
                      tempUnit={tempUnit}
                      speedUnit={speedUnit}
                    />
                  )}

                  {activeMode === 'commuter' && (
                    <CommuterPanel
                      weather={weatherData}
                      tempUnit={tempUnit}
                      speedUnit={speedUnit}
                    />
                  )}

                  {activeMode === 'events' && (
                    <EventPlannerPanel
                      weather={weatherData}
                      tempUnit={tempUnit}
                      speedUnit={speedUnit}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </section>
          </div>
        )}

        {/* Live India Regional Meteorological Map at bottom of landing page */}
        <IndiaLiveMapSection
          currentLocation={currentLocation}
          onSelectLocation={(loc) => setCurrentLocation(loc)}
          language={language}
          tempUnit={tempUnit}
          onOpenFullMap={() => setIsMapOpen(true)}
          isDarkMode={isDarkMode}
        />

        {/* Clean Frosted Glass Footer with Official Indian Source Credits */}
        <footer className="pt-8 pb-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-white/10 border border-white/20">
              <Compass className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white">SkyCast India</span>
            <span>•</span>
            <span className="text-white/70">
              {t.footerAttribution}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Radio className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
              <span className="text-white/80">IMD & CPCB Station Network</span>
            </span>
            <span>•</span>
            <button
              onClick={() => loadWeather(currentLocation)}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition font-medium backdrop-blur-md"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{t.retryBtn}</span>
            </button>
          </div>
        </footer>
      </div>

      {/* Modals & Dialogs */}
      <CityComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        currentLocation={currentLocation}
        onSelectLocation={(loc) => setCurrentLocation(loc)}
        language={language}
        tempUnit={tempUnit}
        speedUnit={speedUnit}
        favorites={favorites}
      />

      <IndiaWeatherMap
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        currentLocation={currentLocation}
        onSelectLocation={(loc) => setCurrentLocation(loc)}
        language={language}
        tempUnit={tempUnit}
      />

      <CycloneTracker
        isOpen={isCycloneOpen}
        onClose={() => setIsCycloneOpen(false)}
        language={language}
      />

      <FestivalTravelOverlay
        isOpen={isFestivalsOpen}
        onClose={() => setIsFestivalsOpen(false)}
        language={language}
        onSelectLocation={(loc) => setCurrentLocation(loc)}
      />

      {weatherData && (
        <ShareWeatherModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          weather={weatherData}
          language={language}
          tempUnit={tempUnit}
        />
      )}

      <NotificationOptIn
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        currentLocation={currentLocation}
        language={language}
      />
    </div>
  );
}
