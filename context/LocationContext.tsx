import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { initialCurrentAQI, initialFavoriteLocations } from '../data/sampleAQIData';
import type { AQIReading, FavoriteLocation } from '../types/airQuality';

type LocationContextValue = {
  favoriteLocations: FavoriteLocation[];
  currentAQI: AQIReading;
  addFavorite: (location: FavoriteLocation) => void;
  removeFavorite: (locationId: string) => void;
  setCurrentAQI: (reading: AQIReading) => void;
};

const LocationContext = createContext<LocationContextValue | undefined>(undefined);

type LocationProviderProps = {
  children: ReactNode;
};

export function LocationProvider({ children }: LocationProviderProps) {
  const [favoriteLocations, setFavoriteLocations] = useState<FavoriteLocation[]>(
    initialFavoriteLocations,
  );
  const [currentAQI, setCurrentAQI] = useState<AQIReading>(initialCurrentAQI);

  const addFavorite = useCallback((location: FavoriteLocation) => {
    setFavoriteLocations((locations) => {
      if (locations.some((item) => item.id === location.id)) {
        return locations;
      }

      return [...locations, location];
    });
  }, []);

  const removeFavorite = useCallback((locationId: string) => {
    setFavoriteLocations((locations) =>
      locations.filter((location) => location.id !== locationId),
    );
  }, []);

  const value = useMemo(
    () => ({
      favoriteLocations,
      currentAQI,
      addFavorite,
      removeFavorite,
      setCurrentAQI,
    }),
    [addFavorite, currentAQI, favoriteLocations, removeFavorite],
  );

  return (
    <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);

  if (!context) {
    throw new Error('useLocation must be used inside LocationProvider.');
  }

  return context;
}
