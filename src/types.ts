export type PersonaId =
  | 'health'
  | 'fitness'
  | 'beach'
  | 'travel'
  | 'family'
  | 'agriculture'
  | 'commuter'
  | 'events';

export type TemperatureUnit = 'C' | 'F';
export type SpeedUnit = 'kmh' | 'mph';
export type Language = 'en' | 'hi' | 'mr' | 'bn' | 'ta' | 'te' | 'kn';

export type CpcbAqiCategory =
  | 'Good'
  | 'Satisfactory'
  | 'Moderate'
  | 'Poor'
  | 'Very Poor'
  | 'Severe';

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeather {
  dt: number;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  clouds: number;
  uvi: number;
  visibility: number; // in meters
  wind_speed: number; // m/s
  wind_deg: number;
  wind_gust?: number;
  sunrise: number;
  sunset: number;
  weather: WeatherCondition[];
  rain_1h?: number;
}

export interface HourlyForecast {
  dt: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  pop: number; // Probability of precipitation 0 - 1
  rain?: { '1h': number };
  weather: WeatherCondition[];
}

export interface DailyForecast {
  dt: number;
  sunrise: number;
  sunset: number;
  moonrise?: number;
  moonset?: number;
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  feels_like: {
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
  pressure: number;
  humidity: number;
  dew_point: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  weather: WeatherCondition[];
  clouds: number;
  pop: number; // Probability of precipitation
  rain?: number; // mm
  uvi: number;
  summary?: string;
  cpcbAqiEstimate?: number;
}

export interface AirPollution {
  aqi: number; // Standard 1 to 5 mapped
  cpcbAqi: number; // 0 to 500 CPCB standard numerical index
  cpcbCategory: CpcbAqiCategory;
  prominentPollutant: string;
  components: {
    co: number;
    no: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
    nh3: number;
  };
}

export interface PollenBreakdown {
  tree: { level: 'Low' | 'Moderate' | 'High' | 'Very High'; value: number };
  grass: { level: 'Low' | 'Moderate' | 'High' | 'Very High'; value: number };
  weed: { level: 'Low' | 'Moderate' | 'High' | 'Very High'; value: number };
  dominantPollen: string;
  summary: string;
}

export interface TideData {
  time: string;
  type: 'High' | 'Low';
  height: string;
}

export interface MarineData {
  waterTemp: number;
  waveHeight: number; // meters
  wavePeriod: number; // seconds
  swellDirection: number; // degrees
  tides: TideData[];
  safetyFlag: 'green' | 'yellow' | 'red' | 'purple';
  safetyReason: string;
}

export interface WeatherAlert {
  sender_name: string;
  event: string;
  start: number;
  end: number;
  description: string;
  severity: 'Advisory' | 'Watch' | 'Warning';
}

export interface LocationData {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface FullWeatherData {
  location: LocationData;
  timezone: string;
  timezone_offset: number;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  alerts?: WeatherAlert[];
  airPollution: AirPollution;
  pollen: PollenBreakdown;
  marine: MarineData;
  isCached?: boolean;
  cachedAt?: number;
  source?: string;
}

export interface SavedDestination {
  id: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  temp?: number;
  condition?: string;
  icon?: string;
  alert?: string;
}

export interface ItineraryItem {
  id: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  notes: string;
}

export type AirPollutionData = AirPollution;
export type DailyForecastData = DailyForecast;
export type HourlyForecastData = HourlyForecast;
export type CurrentWeatherData = CurrentWeather;

export interface FestivalEvent {
  name: string;
  dates: string;
  regions: string[];
  description: string;
  weatherTip: string;
  bestTime: string;
  nameEn?: string;
  nameHi?: string;
  region?: string;
  weatherAdviceEn?: string;
  weatherAdviceHi?: string;
  iconType?: 'diwali' | 'durga' | 'ganesh' | 'kumbh' | 'chardham' | 'holi' | 'goa';
}

export interface CycloneData {
  name: string;
  basin: 'Bay of Bengal' | 'Arabian Sea';
  intensity: 'Deep Depression' | 'Cyclonic Storm' | 'Severe Cyclonic Storm' | 'Very Severe Cyclonic Storm' | 'Super Cyclone' | 'Normal Sea State';
  maxWindKmh: number;
  centralPressureHpa: number;
  affectedStates: string[];
  status: 'Active Advisory' | 'Watch' | 'Normal Monitoring';
  advisoryEn: string;
  advisoryHi: string;
  distanceKm: number;
}
