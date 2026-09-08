export type AirQualityCategory = 'Good' | 'Moderate' | 'Unhealthy';

export type AQIPollutants = {
  pm25?: number;
  pm10?: number;
  o3?: number;
  no2?: number;
};

export type AQICoordinates = {
  lat: number;
  lng: number;
};

export type AQIReading = {
  id: string;
  locationName: string;
  aqiValue: number;
  category: AirQualityCategory;
  coordinates?: AQICoordinates;
  /** WAQI station used to obtain this reading, when one is known. */
  stationId?: number;
  pollutants?: AQIPollutants;
  /** Time the live reading was fetched, used for offline freshness messaging. */
  fetchedAt?: number;
  /** Whether the reading came from a live request or the local offline cache. */
  dataSource?: 'live' | 'cache';
};

export type FavoriteLocation = AQIReading;
