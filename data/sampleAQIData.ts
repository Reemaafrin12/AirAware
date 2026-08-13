import type { AQIReading, FavoriteLocation } from '../types/airQuality';

export const sampleCityAQIReadings: AQIReading[] = [
  {
    id: 'bengaluru',
    locationName: 'Bengaluru',
    aqiValue: 72,
    category: 'Moderate',
  },
  {
    id: 'chennai',
    locationName: 'Chennai',
    aqiValue: 48,
    category: 'Good',
  },
  {
    id: 'delhi',
    locationName: 'Delhi',
    aqiValue: 178,
    category: 'Unhealthy',
  },
  {
    id: 'hyderabad',
    locationName: 'Hyderabad',
    aqiValue: 84,
    category: 'Moderate',
  },
  {
    id: 'mumbai',
    locationName: 'Mumbai',
    aqiValue: 58,
    category: 'Moderate',
  },
  {
    id: 'pune',
    locationName: 'Pune',
    aqiValue: 43,
    category: 'Good',
  },
];

export const sampleHomeAQIReadings: AQIReading[] = [
  {
    id: 'home',
    locationName: 'Home',
    aqiValue: 42,
    category: 'Good',
  },
  {
    id: 'office',
    locationName: 'Office',
    aqiValue: 96,
    category: 'Moderate',
  },
  {
    id: 'school',
    locationName: 'School',
    aqiValue: 164,
    category: 'Unhealthy',
  },
];

export const initialFavoriteLocations: FavoriteLocation[] = [
  sampleHomeAQIReadings[0],
  sampleHomeAQIReadings[1],
];

export const initialCurrentAQI: AQIReading = sampleHomeAQIReadings[0];
