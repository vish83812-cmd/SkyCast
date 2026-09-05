import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  Sun,
  Moon,
  Compass,
  X,
  Loader2,
  Languages,
  AlertCircle,
  Radio,
  Clock,
  Trash2,
  ChevronDown,
  Layers,
  Map as MapIcon,
  Share2,
  Bell,
  Sparkles,
  MoreVertical,
  Wind,
} from 'lucide-react';
import { Language, LocationData, SpeedUnit, TemperatureUnit } from '../types';
import {
  isInsideIndia,
  POPULAR_LOCATIONS,
  searchLocations,
} from '../services/weatherService';
import { getLocalizedCityName, getTranslation } from '../utils/translations';

interface WeatherHeaderProps {
  currentLocation: LocationData;
  onSelectLocation: (loc: LocationData) => void;
  tempUnit: TemperatureUnit;
  speedUnit: SpeedUnit;
  onToggleTempUnit: () => void;
  onToggleSpeedUnit: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  onOpenCompare: () => void;
  onOpenMap: () => void;
  onOpenShare: () => void;
  onOpenNotifications: () => void;
  onOpenFestivals: () => void;
  onOpenCyclone?: () => void;
}

const RECENT_SEARCHES_KEY = 'skycast_recent_searches_in';

export const WeatherHeader: React.FC<WeatherHeaderProps> = ({
  currentLocation,
  onSelectLocation,
  tempUnit,
  speedUnit,
  onToggleTempUnit,
  onToggleSpeedUnit,
  isDarkMode,
  onToggleTheme,
  language,
  onSelectLanguage,
  onOpenCompare,
  onOpenMap,
  onOpenShare,
  onOpenNotifications,
  onOpenFestivals,
  onOpenCyclone,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [isGeoLoading, setIsGeoLoading] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showMoreToolsMenu, setShowMoreToolsMenu] = useState(false);
  const [indiaNotice, setIndiaNotice] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<LocationData[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const t = getTranslation(language);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const langContainerRef = useRef<HTMLDivElement>(null);
  const moreToolsContainerRef = useRef<HTMLDivElement>(null);

  // Load recent searches on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const saveRecentSearch = (loc: LocationData) => {
    try {
      const updated = [loc, ...recentSearches.filter((item) => item.name.toLowerCase() !== loc.name.toLowerCase())].slice(0, 6);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {}
  };

  const clearRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {}
  };

  // Debounced search with strict India filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIndiaNotice(null);
      setHighlightedIndex(-1);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      setIndiaNotice(null);
      const results = await searchLocations(searchQuery);
      setSearchResults(results);
      setHighlightedIndex(-1);
      if (results.length === 0) {
        setIndiaNotice(t.indiaOnlyNotice);
      }
      setIsSearching(false);
      setIsOpenDropdown(true);
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery, t.indiaOnlyNotice]);

  // Click outside and escape key listener for all popovers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (searchContainerRef.current && !searchContainerRef.current.contains(target)) {
        setIsOpenDropdown(false);
      }
      if (langContainerRef.current && !langContainerRef.current.contains(target)) {
        setShowLangDropdown(false);
      }
      if (moreToolsContainerRef.current && !moreToolsContainerRef.current.contains(target)) {
        setShowMoreToolsMenu(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpenDropdown(false);
        setShowLangDropdown(false);
        setShowMoreToolsMenu(false);
        searchInputRef.current?.blur();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Keyboard navigation for search results
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const list = searchQuery.trim() ? searchResults : recentSearches;
    if (!isOpenDropdown || list.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < list.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : list.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < list.length) {
        handleSelectLocation(list[highlightedIndex]);
      } else if (list.length > 0) {
        handleSelectLocation(list[0]);
      }
    }
  };

  const handleSelectLocation = (loc: LocationData) => {
    onSelectLocation(loc);
    saveRecentSearch(loc);
    setSearchQuery('');
    setIsOpenDropdown(false);
    setShowMoreToolsMenu(false);
    setShowLangDropdown(false);
    setHighlightedIndex(-1);
    searchInputRef.current?.blur();
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setIndiaNotice('Geolocation is not supported by your browser.');
      return;
    }
    setIsGeoLoading(true);
    setIndiaNotice(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsGeoLoading(false);
        const { latitude, longitude } = pos.coords;

        if (!isInsideIndia(latitude, longitude)) {
          setIndiaNotice(t.gpsOutsideIndia);
          setTimeout(() => setIndiaNotice(null), 6000);
          return;
        }

        const geoLoc: LocationData = {
          name: 'Current Indian Location',
          lat: latitude,
          lon: longitude,
          country: 'IN',
          state: 'GPS Detected',
        };
        handleSelectLocation(geoLoc);
      },
      (err) => {
        setIsGeoLoading(false);
        console.warn('Geolocation error:', err);
        setIndiaNotice('Unable to retrieve GPS coordinates. Please select an Indian city below.');
        setTimeout(() => setIndiaNotice(null), 5000);
      },
      { timeout: 9000 }
    );
  };

  // Substring bold highlighting helper
  const renderHighlightedText = (text: string, query: string) => {
    if (!query.trim()) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={i} className="font-extrabold text-sky-300 underline decoration-sky-400/60 underline-offset-2">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  const languagesList: { code: Language; name: string; native: string }[] = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  ];

  const currentLangObj = languagesList.find((l) => l.code === language) || languagesList[0];

  return (
    <header className="w-full relative z-40 pb-2 space-y-2.5">
      {/* Toast Notice if outside India or notice active */}
      {indiaNotice && (
        <div className="bg-rose-950/95 backdrop-blur-md border border-rose-500/60 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-2 z-50">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />
            <span className="font-semibold">{indiaNotice}</span>
          </div>
          <button
            onClick={() => setIndiaNotice(null)}
            className="p-1 rounded-full text-white/70 hover:text-white"
            title={t.close}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Glassmorphic Header */}
      <div className={`backdrop-blur-xl border rounded-3xl p-3.5 sm:p-4 shadow-2xl text-white flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 md:gap-4 relative z-30 transition-colors ${
        isDarkMode
          ? 'bg-slate-900/80 border-white/20'
          : 'bg-white/15 border-white/25 shadow-xl'
      }`}>
        {/* Brand & Live Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-sky-400/30 to-indigo-600/40 p-2 sm:p-2.5 rounded-2xl border border-sky-300/30 shadow-lg text-white font-bold flex items-center justify-center">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-sky-200 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-xl sm:text-2xl tracking-tight text-white drop-shadow-sm">
                  {t.appTitle}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 backdrop-blur-sm flex items-center space-x-1 shadow-sm">
                  <Radio className="w-2.5 h-2.5 text-emerald-300 animate-pulse" />
                  <span>IMD · CPCB</span>
                </span>
              </div>
              <p className="text-xs text-white/75 font-medium">{t.appSubtitle}</p>
            </div>
          </div>

          {/* Compact Mobile Quick Toggles */}
          <div className="flex md:hidden items-center space-x-1.5">
            <button
              id="mobile-temp-unit"
              onClick={onToggleTempUnit}
              title={`${tempUnit === 'C' ? '°F' : '°C'}`}
              className={`px-2.5 py-1 text-xs font-bold rounded-full border text-white backdrop-blur-md shadow-sm transition ${
                isDarkMode
                  ? 'bg-slate-800/90 border-white/20'
                  : 'bg-white/20 border-white/30 hover:bg-white/30'
              }`}
            >
              °{tempUnit}
            </button>
            <button
              id="mobile-theme-btn"
              onClick={onToggleTheme}
              className={`p-2 rounded-full border text-white backdrop-blur-md shadow-sm transition ${
                isDarkMode
                  ? 'bg-slate-800/90 border-white/20'
                  : 'bg-white/20 border-white/30 hover:bg-white/30'
              }`}
              title={isDarkMode ? t.themeLight : t.themeDark}
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-sky-200" />}
            </button>
          </div>
        </div>

        {/* Search Bar & Geolocation (Container with isolated high z-index) */}
        <div className="flex-1 max-w-xl mx-0 md:mx-2 relative z-40" ref={searchContainerRef}>
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-white/70 pointer-events-none" />
            <input
              ref={searchInputRef}
              id="city-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                setIsOpenDropdown(true);
                setShowLangDropdown(false);
                setShowMoreToolsMenu(false);
              }}
              onKeyDown={handleKeyDown}
              placeholder={t.searchPlaceholder}
              autoComplete="off"
              className={`w-full pl-10 pr-24 py-2.5 rounded-full text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:border-white/40 transition-all shadow-inner backdrop-blur-md ${
                isDarkMode
                  ? 'bg-slate-950/85 border border-white/25 focus:ring-sky-400 focus:border-sky-300'
                  : 'bg-white/20 border border-white/30 focus:ring-white/50 focus:bg-white/25'
              }`}
            />
            <div className="absolute right-1.5 flex items-center space-x-1">
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10"
                  title={t.close}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                id="use-my-location-btn"
                onClick={handleGeolocation}
                disabled={isGeoLoading}
                title={t.useMyLocation}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold transition backdrop-blur-md shadow-sm border ${
                  isDarkMode
                    ? 'bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 border-sky-400/40'
                    : 'bg-white/20 hover:bg-white/30 text-white border-white/30'
                }`}
              >
                {isGeoLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-300" />
                ) : (
                  <MapPin className="w-3.5 h-3.5 text-sky-300" />
                )}
                <span className="hidden sm:inline">{t.gpsLabel}</span>
              </button>
            </div>
          </div>

          {/* Search suggestions dropdown (Layered with z-[100], solid dark background, clean shadow) */}
          {isOpenDropdown && (
            <div
              id="search-suggestions-dropdown"
              className="absolute top-full left-0 right-0 mt-2 bg-slate-950 border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden z-[100] divide-y divide-slate-800 text-white animate-in fade-in zoom-in-95 duration-150"
              style={{ maxHeight: '380px', overflowY: 'auto' }}
            >
              {isSearching ? (
                <div className="p-4 flex items-center justify-center space-x-2 text-sm text-slate-300 bg-slate-950">
                  <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                  <span>{t.searchingStatus}</span>
                </div>
              ) : searchQuery.trim().length > 0 ? (
                searchResults.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-300 space-y-1.5 bg-slate-950">
                    <p className="font-bold text-rose-300">{t.noResultsFound}</p>
                    <p className="text-slate-400">
                      {t.trySearchingCities}
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="px-3.5 py-2 bg-slate-900 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>{t.searchResultsHeader} ({searchResults.length})</span>
                      <span className="text-[10px] text-slate-500 font-normal">{t.useArrowsToNavigate}</span>
                    </div>
                    {searchResults.map((loc, idx) => {
                      const isHighlighted = highlightedIndex === idx;
                      const localizedName = getLocalizedCityName(loc.name, language);
                      return (
                        <button
                          key={`${loc.name}-${idx}`}
                          onClick={() => handleSelectLocation(loc)}
                          onMouseEnter={() => setHighlightedIndex(idx)}
                          className={`w-full px-4 py-3 text-left flex items-center justify-between transition text-sm ${
                            isHighlighted ? 'bg-sky-600/40 text-white border-l-4 border-sky-400' : 'hover:bg-slate-900/90 text-slate-200'
                          }`}
                        >
                          <div className="flex items-center space-x-3 min-w-0 pr-2">
                            <div className="p-1.5 rounded-lg bg-slate-800 shrink-0 text-sky-400">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-white truncate">
                                {renderHighlightedText(localizedName, searchQuery)}
                              </div>
                              <div className="text-xs text-slate-400 truncate">
                                {loc.state ? `${loc.state}, ` : ''}India
                              </div>
                            </div>
                          </div>
                          <span className="text-[11px] text-slate-400 shrink-0 font-mono bg-slate-800/60 px-2 py-0.5 rounded">
                            {loc.lat.toFixed(2)}°N, {loc.lon.toFixed(2)}°E
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )
              ) : (
                /* Recent searches */
                <div>
                  <div className="px-3.5 py-2 bg-slate-900 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-sky-400" />
                      <span>{t.recentSearches}</span>
                    </span>
                    {recentSearches.length > 0 && (
                      <button
                        onClick={clearRecentSearches}
                        className="text-[10px] text-rose-400 hover:text-rose-300 font-medium flex items-center space-x-1"
                        title={t.clearRecent}
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>{t.clearRecent}</span>
                      </button>
                    )}
                  </div>
                  {recentSearches.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      {t.popularCities}
                    </div>
                  ) : (
                    recentSearches.map((loc, idx) => {
                      const isHighlighted = highlightedIndex === idx;
                      return (
                        <button
                          key={`recent-${loc.name}-${idx}`}
                          onClick={() => handleSelectLocation(loc)}
                          onMouseEnter={() => setHighlightedIndex(idx)}
                          className={`w-full px-4 py-2.5 text-left flex items-center justify-between transition text-sm ${
                            isHighlighted ? 'bg-sky-600/40 text-white' : 'hover:bg-slate-900/80 text-slate-200'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="font-medium text-white truncate">
                              {getLocalizedCityName(loc.name, language)}
                            </span>
                            <span className="text-xs text-slate-400 truncate">
                              ({loc.state || 'India'})
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {loc.lat.toFixed(2)}°N
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Streamlined Action Bar: Language + Units + Light/Dark Toggle + More Tools */}
        <div className="flex items-center space-x-2 justify-end relative z-40">
          {/* Primary Language Switcher (High z-index, crisp list) */}
          <div className="relative z-50" ref={langContainerRef}>
            <button
              id="lang-dropdown-btn"
              onClick={() => {
                setShowLangDropdown(!showLangDropdown);
                setIsOpenDropdown(false);
                setShowMoreToolsMenu(false);
              }}
              title={t.selectLanguage}
              className={`px-3 py-1.5 text-xs font-bold rounded-full border text-white flex items-center space-x-1.5 transition backdrop-blur-md shadow-sm ${
                isDarkMode
                  ? 'bg-slate-800/90 border-white/25 hover:bg-slate-700/90'
                  : 'bg-white/20 border-white/30 hover:bg-white/30'
              }`}
            >
              <Languages className="w-3.5 h-3.5 text-sky-300" />
              <span>{currentLangObj.native}</span>
              <ChevronDown className="w-3 h-3 text-white/70" />
            </button>

            {/* Language dropdown menu with high z-index & solid background */}
            {showLangDropdown && (
              <div
                id="language-dropdown-menu"
                className="absolute right-0 mt-2 w-56 bg-slate-950 border border-slate-700/90 rounded-2xl shadow-2xl p-1.5 z-[100] divide-y divide-slate-800 text-white animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {t.selectLanguage}
                </div>
                <div className="py-1 space-y-0.5 max-h-64 overflow-y-auto">
                  {languagesList.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => {
                        onSelectLanguage(item.code);
                        setShowLangDropdown(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs rounded-xl flex items-center justify-between transition ${
                        language === item.code
                          ? 'bg-sky-500/25 text-sky-300 font-bold border border-sky-500/40'
                          : 'hover:bg-slate-900 text-slate-200'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">{item.native}</span>
                        <span className="text-[10px] text-slate-400">{item.name}</span>
                      </div>
                      {language === item.code && (
                        <span className="w-2 h-2 rounded-full bg-sky-400 shadow-sm" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Temperature Unit Switcher */}
          <div className={`hidden sm:flex p-1 rounded-full border backdrop-blur-md shadow-sm ${
            isDarkMode
              ? 'bg-slate-800/90 border-white/20'
              : 'bg-white/20 border-white/30'
          }`}>
            <button
              id="unit-c-btn"
              onClick={() => tempUnit !== 'C' && onToggleTempUnit()}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition ${
                tempUnit === 'C' ? 'bg-sky-500 text-white shadow-sm' : 'text-white/70 hover:text-white'
              }`}
              title="Celsius (°C)"
            >
              °C
            </button>
            <button
              id="unit-f-btn"
              onClick={() => tempUnit !== 'F' && onToggleTempUnit()}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition ${
                tempUnit === 'F' ? 'bg-sky-500 text-white shadow-sm' : 'text-white/70 hover:text-white'
              }`}
              title="Fahrenheit (°F)"
            >
              °F
            </button>
          </div>

          {/* Light / Dark Mode Toggle Button */}
          <button
            id="header-theme-toggle"
            onClick={onToggleTheme}
            className={`p-2 sm:px-3 sm:py-1.5 text-xs font-semibold rounded-full border text-white flex items-center space-x-1.5 transition backdrop-blur-md shadow-sm ${
              isDarkMode
                ? 'bg-slate-800/90 border-white/20 hover:bg-slate-700/90'
                : 'bg-white/20 border-white/30 hover:bg-white/30'
            }`}
            title={isDarkMode ? t.themeLight : t.themeDark}
            aria-label="Toggle light and dark theme"
          >
            {isDarkMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden lg:inline">{t.themeLight}</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-sky-200" />
                <span className="hidden lg:inline">{t.themeDark}</span>
              </>
            )}
          </button>

          {/* Unified "More Tools" (•••) Dropdown Menu */}
          <div className="relative z-50" ref={moreToolsContainerRef}>
            <button
              id="more-tools-btn"
              onClick={() => {
                setShowMoreToolsMenu(!showMoreToolsMenu);
                setIsOpenDropdown(false);
                setShowLangDropdown(false);
              }}
              title={t.moreTools}
              className={`p-2 sm:px-3 sm:py-1.5 text-xs font-semibold rounded-full border text-white flex items-center space-x-1.5 transition backdrop-blur-md shadow-sm ${
                isDarkMode
                  ? 'bg-slate-800/90 border-white/25 hover:bg-slate-700/90'
                  : 'bg-white/20 border-white/30 hover:bg-white/30'
              }`}
            >
              <MoreVertical className="w-4 h-4 text-sky-300" />
              <span className="hidden lg:inline">{t.moreTools}</span>
            </button>

            {/* Consolidated More Tools Menu with solid dark background & high z-index */}
            {showMoreToolsMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-950 border border-slate-700/90 rounded-2xl shadow-2xl p-2 z-[100] divide-y divide-slate-800 text-white animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2">
                  <div className="text-xs font-bold text-white">{t.moreTools}</div>
                  <div className="text-[11px] text-slate-400">{t.toolsSubtitle}</div>
                </div>

                <div className="py-1.5 space-y-1">
                  {/* Weather Map */}
                  <button
                    onClick={() => {
                      setShowMoreToolsMenu(false);
                      onOpenMap();
                    }}
                    className="w-full px-3 py-2 text-left text-xs rounded-xl hover:bg-slate-900 flex items-center space-x-2.5 text-slate-200 hover:text-white transition"
                  >
                    <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                      <MapIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 font-medium">{t.weatherMap}</div>
                  </button>

                  {/* Compare Cities */}
                  <button
                    onClick={() => {
                      setShowMoreToolsMenu(false);
                      onOpenCompare();
                    }}
                    className="w-full px-3 py-2 text-left text-xs rounded-xl hover:bg-slate-900 flex items-center space-x-2.5 text-slate-200 hover:text-white transition"
                  >
                    <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-300">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div className="flex-1 font-medium">{t.compareCities}</div>
                  </button>

                  {/* Festival and Travel */}
                  <button
                    onClick={() => {
                      setShowMoreToolsMenu(false);
                      onOpenFestivals();
                    }}
                    className="w-full px-3 py-2 text-left text-xs rounded-xl hover:bg-slate-900 flex items-center space-x-2.5 text-slate-200 hover:text-white transition"
                  >
                    <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="flex-1 font-medium">{t.festivalsAndTravel}</div>
                  </button>

                  {/* Cyclone Tracker */}
                  {onOpenCyclone && (
                    <button
                      onClick={() => {
                        setShowMoreToolsMenu(false);
                        onOpenCyclone();
                      }}
                      className="w-full px-3 py-2 text-left text-xs rounded-xl hover:bg-slate-900 flex items-center space-x-2.5 text-slate-200 hover:text-white transition"
                    >
                      <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300">
                        <Radio className="w-4 h-4" />
                      </div>
                      <div className="flex-1 font-medium">{t.cycloneTracker}</div>
                    </button>
                  )}

                  {/* Share Card */}
                  <button
                    onClick={() => {
                      setShowMoreToolsMenu(false);
                      onOpenShare();
                    }}
                    className="w-full px-3 py-2 text-left text-xs rounded-xl hover:bg-slate-900 flex items-center space-x-2.5 text-slate-200 hover:text-white transition"
                  >
                    <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1 font-medium">{t.shareCard}</div>
                  </button>

                  {/* Weather Alerts */}
                  <button
                    onClick={() => {
                      setShowMoreToolsMenu(false);
                      onOpenNotifications();
                    }}
                    className="w-full px-3 py-2 text-left text-xs rounded-xl hover:bg-slate-900 flex items-center space-x-2.5 text-slate-200 hover:text-white transition"
                  >
                    <div className="p-1.5 rounded-lg bg-yellow-500/20 text-yellow-300">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="flex-1 font-medium">{t.pushAlerts}</div>
                  </button>
                </div>

                {/* Quick Unit & Wind Speed Toggles inside menu */}
                <div className="p-2 space-y-2">
                  <div className="flex items-center justify-between text-xs px-1">
                    <span className="text-slate-400 font-medium">{speedUnit === 'kmh' ? 'km/h' : 'mph'}</span>
                    <button
                      onClick={onToggleSpeedUnit}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs flex items-center space-x-1.5 transition"
                    >
                      <Wind className="w-3.5 h-3.5 text-sky-300" />
                      <span>{speedUnit === 'kmh' ? 'km/h' : 'mph'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Indian Cities Jump Bar with Pure Localized City Names (low z-index so dropdowns stack over it) */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs px-1 relative z-0">
        <span className="text-white/80 shrink-0 font-bold drop-shadow-sm">{t.popularCities}:</span>
        {POPULAR_LOCATIONS.slice(0, 10).map((city, idx) => {
          const isSelected = currentLocation.name.toLowerCase() === city.name.toLowerCase();
          return (
            <button
              key={`pop-${city.name}-${idx}`}
              onClick={() => handleSelectLocation(city)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full border transition backdrop-blur-md font-medium text-xs ${
                isSelected
                  ? 'bg-sky-500 border-sky-300 text-white font-bold shadow-lg scale-105'
                  : isDarkMode
                  ? 'bg-slate-900/60 border-white/15 text-white/90 hover:text-white hover:bg-slate-800/80'
                  : 'bg-white/20 border-white/25 text-white hover:bg-white/30 hover:text-white'
              }`}
            >
              {getLocalizedCityName(city.name, language)}
            </button>
          );
        })}
      </div>
    </header>
  );
};
