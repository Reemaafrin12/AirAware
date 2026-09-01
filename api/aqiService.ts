// Axios is intentionally installed by the developer with `npx expo install axios`.
// @ts-ignore Keep this module type-checkable until that user-managed install is complete.
import axios from 'axios';

declare const process: {
  env: Record<string, string | undefined>;
};

import type {
  AQICoordinates,
  AQIPollutants,
  AQIReading,
  AirQualityCategory,
} from '../types/airQuality';

const WAQI_BASE_URL = 'https://api.waqi.info/feed';
const WAQI_TOKEN = process.env.EXPO_PUBLIC_WAQI_TOKEN;

export const DEFAULT_AQI_COORDINATES: AQICoordinates = {
  lat: 12.9716,
  lng: 77.5946,
};

/** Coordinates used until a geocoding service is added in a later experiment. */
export const CITY_COORDINATES: Record<string, AQICoordinates> = {
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Delhi: { lat: 28.6139, lng: 77.209 },
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Ahmedabad: { lat: 23.0225, lng: 72.5714 },
};

/**
 * WAQI's city-centre `/geo:` lookups are unreliable for several of these
 * locations. Use a verified, named station feed for city search instead.
 */
export const CITY_STATIONS: Record<
  string,
  { stationId: number; coordinates: AQICoordinates }
> = {
  Bengaluru: { stationId: 11270, coordinates: { lat: 12.938539, lng: 77.5901 } },
  Chennai: { stationId: 13737, coordinates: { lat: 13.1036, lng: 80.2909 } },
  Delhi: { stationId: 10110, coordinates: { lat: 28.499727, lng: 77.267095 } },
  Hyderabad: { stationId: 14125, coordinates: { lat: 17.417094, lng: 78.457437 } },
  Kolkata: { stationId: 12746, coordinates: { lat: 22.5367507, lng: 88.3638022 } },
  Mumbai: { stationId: 12454, coordinates: { lat: 19.0863, lng: 72.8888 } },
  Pune: { stationId: 3760, coordinates: { lat: 18.529603, lng: 73.849586 } },
  Ahmedabad: { stationId: 8192, coordinates: { lat: 23.002657, lng: 72.591912 } },
};

type WaqiMetric = { v?: number | string };
type WaqiData = {
  aqi?: number | string;
  city?: { name?: string; geo?: [number, number] };
  iaqi?: {
    pm25?: WaqiMetric;
    pm10?: WaqiMetric;
    o3?: WaqiMetric;
    no2?: WaqiMetric;
  };
};

type WaqiResponse = {
  status: string;
  data?: WaqiData | string;
};

export type UserProfileData = {
  id: string;
  name: string;
  email: string;
  preferences: { notifications: boolean };
};

/** Fetches a verified WAQI station feed, avoiding unreliable city-centre geo lookups. */
export async function fetchLiveAQIByStation(
  stationId: number,
  fallbackCoordinates: AQICoordinates,
): Promise<AQIReading> {
  return fetchWaqiFeed(`@${stationId}`, fallbackCoordinates, stationId);
}

async function fetchWaqiFeed(
  feedPath: string,
  fallbackCoordinates: AQICoordinates,
  stationId: number,
): Promise<AQIReading> {
  if (!WAQI_TOKEN) {
    throw new Error(
      'WAQI token is missing. Add EXPO_PUBLIC_WAQI_TOKEN to your .env.local file.',
    );
  }

  const response = await fetch(
    `${WAQI_BASE_URL}/${feedPath}/?token=${encodeURIComponent(WAQI_TOKEN)}`,
  );

  if (!response.ok) {
    throw new Error(`WAQI request failed (${response.status}).`);
  }

  const payload = (await response.json()) as WaqiResponse;
  if (payload.status !== 'ok' || !payload.data || typeof payload.data === 'string') {
    throw new Error(
      typeof payload.data === 'string' ? payload.data : 'WAQI returned no AQI data.',
    );
  }

  const aqiValue = Number(payload.data.aqi);
  if (!Number.isFinite(aqiValue)) throw new Error('WAQI returned an invalid AQI value.');

  const cityCoordinates = payload.data.city?.geo;
  const coordinates = cityCoordinates
    ? { lat: Number(cityCoordinates[0]), lng: Number(cityCoordinates[1]) }
    : fallbackCoordinates;

  return {
    id: `waqi-${feedPath}`,
    locationName:
      payload.data.city?.name ||
      `Location (${fallbackCoordinates.lat.toFixed(3)}, ${fallbackCoordinates.lng.toFixed(3)})`,
    aqiValue: Math.round(aqiValue),
    category: categoryForAQI(aqiValue),
    coordinates,
    stationId,
    pollutants: normalizePollutants(payload.data.iaqi),
  };
}

/**
 * Temporary mock until Experiment 10's backend exists.
 * The Axios adapter keeps the request/response path real without making a network call.
 */
export async function fetchUserProfileData(userId: string): Promise<UserProfileData> {
  const mockAxios = axios.create({
    adapter: async (config: any) => ({
      data: {
        id: userId,
        name: 'Aarav Mehta',
        email: 'aarav.mehta@example.com',
        preferences: { notifications: true },
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    }),
  });

  const response = await mockAxios.get(`/mock/user-profile/${encodeURIComponent(userId)}`);
  return response.data;
}

function normalizePollutants(iaqi?: WaqiData['iaqi']): AQIPollutants {
  return {
    pm25: metricValue(iaqi?.pm25),
    pm10: metricValue(iaqi?.pm10),
    o3: metricValue(iaqi?.o3),
    no2: metricValue(iaqi?.no2),
  };
}

function metricValue(metric?: WaqiMetric): number | undefined {
  if (metric?.v === undefined) return undefined;
  const value = Number(metric.v);
  return Number.isFinite(value) ? value : undefined;
}

function categoryForAQI(aqi: number): AirQualityCategory {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  return 'Unhealthy';
}
