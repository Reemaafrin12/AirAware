import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';

import { initialCurrentAQI, initialFavoriteLocations } from '../data/sampleAQIData';
import { setFavoriteLocations as setReduxFavoriteLocations, type AppDispatch } from '../store/store';
import type { AQIReading, FavoriteLocation } from '../types/airQuality';

type LocationContextValue = {
  favoriteLocations: FavoriteLocation[];
  currentAQI: AQIReading;
  addFavorite: (location: FavoriteLocation) => void;
  removeFavorite: (locationId: string) => void;
  setCurrentAQI: (reading: AQIReading) => void;
  isLocationHydrated: boolean;
  hasSavedHomeLocation: boolean;
};

const FAVORITE_LOCATIONS_STORAGE_KEY = 'airaware:favoriteLocations';
const HOME_LOCATION_STORAGE_KEY = 'airaware:homeLocation';
const LocationContext = createContext<LocationContextValue | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const [favoriteLocations, setFavoriteLocations] = useState<FavoriteLocation[]>(initialFavoriteLocations);
  const [currentAQI, setCurrentAQI] = useState<AQIReading>(initialCurrentAQI);
  const [isLocationHydrated, setIsLocationHydrated] = useState(false);
  const [hasSavedHomeLocation, setHasSavedHomeLocation] = useState(false);

  useEffect(() => {
    let active = true;
    const hydrateLocationState = async () => {
      try {
        const [[, favoritesValue], [, homeValue]] = await AsyncStorage.multiGet([
          FAVORITE_LOCATIONS_STORAGE_KEY,
          HOME_LOCATION_STORAGE_KEY,
        ]);
        const cachedFavorites = favoritesValue ? (JSON.parse(favoritesValue) as FavoriteLocation[]) : null;
        const cachedHome = homeValue ? (JSON.parse(homeValue) as AQIReading) : null;

        if (!active) return;
        if (Array.isArray(cachedFavorites)) {
          setFavoriteLocations(cachedFavorites);
          dispatch(setReduxFavoriteLocations(cachedFavorites));
        }
        if (cachedHome) {
          setHasSavedHomeLocation(true);
          setCurrentAQI({
            ...cachedHome,
            dataSource: cachedHome.fetchedAt ? 'cache' : cachedHome.dataSource,
          });
        }
      } catch (error) {
        console.error('Unable to restore saved location data:', error);
      } finally {
        if (active) setIsLocationHydrated(true);
      }
    };

    void hydrateLocationState();
    return () => {
      active = false;
    };
  }, [dispatch]);

  const addFavorite = useCallback((location: FavoriteLocation) => {
    setFavoriteLocations((locations) => {
      if (locations.some((item) => item.id === location.id)) return locations;
      const nextLocations = [...locations, location];
      void AsyncStorage.setItem(FAVORITE_LOCATIONS_STORAGE_KEY, JSON.stringify(nextLocations));
      return nextLocations;
    });
  }, []);

  const removeFavorite = useCallback((locationId: string) => {
    setFavoriteLocations((locations) => {
      const nextLocations = locations.filter((location) => location.id !== locationId);
      void AsyncStorage.setItem(FAVORITE_LOCATIONS_STORAGE_KEY, JSON.stringify(nextLocations));
      return nextLocations;
    });
  }, []);

  const updateCurrentAQI = useCallback((reading: AQIReading) => {
    setCurrentAQI(reading);
    void AsyncStorage.setItem(HOME_LOCATION_STORAGE_KEY, JSON.stringify(reading));
  }, []);

  const value = useMemo(
    () => ({
      favoriteLocations,
      currentAQI,
      addFavorite,
      removeFavorite,
      setCurrentAQI: updateCurrentAQI,
      isLocationHydrated,
      hasSavedHomeLocation,
    }),
    [
      addFavorite,
      currentAQI,
      favoriteLocations,
      hasSavedHomeLocation,
      isLocationHydrated,
      removeFavorite,
      updateCurrentAQI,
    ],
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used inside LocationProvider.');
  return context;
}
