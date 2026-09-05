import { LocationData } from '../types';
import { POPULAR_LOCATIONS } from '../services/weatherService';

export interface MapCityData extends LocationData {
  x: number;
  y: number;
  baseTemp: number;
  aqi: number;
  rain: number;
  offsetX?: number;
  offsetY?: number;
}

// Geographic bounding box for India
export const INDIA_GEO_BOUNDS = {
  minLat: 6.8,
  maxLat: 37.2,
  minLon: 68.1,
  maxLon: 97.4,
};

/**
 * Projects real latitude & longitude into precise SVG percentage coordinates (0 to 100)
 */
export function projectLatLonToSvg(lat: number, lon: number): { x: number; y: number } {
  const { minLat, maxLat, minLon, maxLon } = INDIA_GEO_BOUNDS;
  
  // X: longitude from west (68.1) to east (97.4) mapped to 12% to 88%
  const x = ((lon - minLon) / (maxLon - minLon)) * 76 + 12;
  
  // Y: latitude from south (6.8) to north (37.2) mapped to 88% down to 12% (SVG y is inverted)
  const y = 90 - ((lat - minLat) / (maxLat - minLat)) * 78;

  return { x, y };
}

// Map cities with real lat/lon and manual offset adjustments for dense clusters (e.g. Mumbai & Pune)
export const MAP_CITIES: MapCityData[] = POPULAR_LOCATIONS.map((loc) => {
  const proj = projectLatLonToSvg(loc.lat, loc.lon);
  
  // Assign realistic sample weather metrics based on region
  let baseTemp = 30;
  let aqi = 85;
  let rain = 30;
  let offsetX = 0;
  let offsetY = 0;

  switch (loc.name) {
    case 'Mumbai':
      baseTemp = 29; aqi = 112; rain = 45; offsetX = -18; offsetY = 4;
      break;
    case 'Pune':
      baseTemp = 28; aqi = 74; rain = 40; offsetX = 18; offsetY = 14;
      break;
    case 'Delhi':
      baseTemp = 33; aqi = 245; rain = 20; offsetY = -10;
      break;
    case 'Bengaluru':
      baseTemp = 26; aqi = 48; rain = 30; offsetY = 10;
      break;
    case 'Chennai':
      baseTemp = 32; aqi = 62; rain = 15; offsetX = 14;
      break;
    case 'Kolkata':
      baseTemp = 31; aqi = 158; rain = 60; offsetX = 14;
      break;
    case 'Hyderabad':
      baseTemp = 30; aqi = 82; rain = 25;
      break;
    case 'Jaipur':
      baseTemp = 36; aqi = 130; rain = 10;
      break;
    case 'Kochi':
      baseTemp = 28; aqi = 35; rain = 80; offsetX = -12; offsetY = 12;
      break;
    case 'Goa (Panaji)':
      baseTemp = 29; aqi = 28; rain = 70; offsetX = -16;
      break;
    case 'Ahmedabad':
      baseTemp = 35; aqi = 142; rain = 15; offsetX = -14;
      break;
    case 'Chandigarh':
      baseTemp = 30; aqi = 120; rain = 25; offsetX = 12; offsetY = -10;
      break;
    case 'Shillong':
      baseTemp = 21; aqi = 22; rain = 90; offsetX = 16;
      break;
    case 'Srinagar':
      baseTemp = 22; aqi = 40; rain = 15; offsetY = -10;
      break;
    case 'Visakhapatnam':
      baseTemp = 31; aqi = 65; rain = 35; offsetX = 14;
      break;
  }

  return {
    ...loc,
    x: proj.x,
    y: proj.y,
    baseTemp,
    aqi,
    rain,
    offsetX,
    offsetY,
  };
});
