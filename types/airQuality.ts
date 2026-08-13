export type AirQualityCategory = 'Good' | 'Moderate' | 'Unhealthy';

export type AQIReading = {
  id: string;
  locationName: string;
  aqiValue: number;
  category: AirQualityCategory;
};

export type FavoriteLocation = AQIReading;
