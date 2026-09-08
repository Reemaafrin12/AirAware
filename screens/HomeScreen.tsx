import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useLocation } from '../context/LocationContext';
import { sampleHomeAQIReadings } from '../data/sampleAQIData';
import { useOpenAQIDetails } from '../navigation/AQIDetailsNavigationContext';
import type { AQIReading } from '../types/airQuality';
import {
  AIR_QUALITY_LOAD_ERROR_MESSAGE,
  CITY_STATIONS,
  fetchLiveAQIByStation,
  getCachedAQIByStation,
} from '../api/aqiService';
import { formatAQIUpdateStatus } from '../utils/aqiStatus';
import { useMinuteClock } from '../utils/useMinuteClock';

export default function HomeScreen() {
  const openAQIDetails = useOpenAQIDetails();
  const {
    currentAQI,
    favoriteLocations,
    hasSavedHomeLocation,
    isLocationHydrated,
    setCurrentAQI,
  } = useLocation();
  const [searchText, setSearchText] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<AQIReading | null>(null);
  const [currentAQIReading, setCurrentAQIReading] = useState<AQIReading>(currentAQI);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const now = useMinuteClock();
  const currentAQIRef = useRef(currentAQI);

  useEffect(() => {
    currentAQIRef.current = currentAQI;
  }, [currentAQI]);

  useEffect(() => {
    if (!isLocationHydrated) return;
    const initialReading = currentAQIRef.current;

    setSelectedLocation(initialReading);
    setCurrentAQIReading(initialReading);
    setCurrentAQI(initialReading);
    setToastMessage('Welcome back!');
    setIsLoading(true);
    const refreshTarget = initialReading.stationId
      ? {
          stationId: initialReading.stationId,
          coordinates: initialReading.coordinates ?? CITY_STATIONS.Bengaluru.coordinates,
        }
      : hasSavedHomeLocation
        ? null
        : CITY_STATIONS.Bengaluru;

    if (refreshTarget) {
      fetchLiveAQIByStation(
        refreshTarget.stationId,
        refreshTarget.coordinates,
      )
        .then((liveReading) => {
          setSelectedLocation(liveReading);
          setCurrentAQIReading(liveReading);
          setCurrentAQI(liveReading);
          setErrorMessage(null);
        })
        .catch((error: unknown) => {
          console.error('Home AQI initial load failed:', error);
          void getCachedAQIByStation(refreshTarget.stationId).then((cachedReading) => {
            if (!cachedReading) {
              setErrorMessage(AIR_QUALITY_LOAD_ERROR_MESSAGE);
              return;
            }
            setSelectedLocation(cachedReading);
            setCurrentAQIReading(cachedReading);
            setCurrentAQI(cachedReading);
            setErrorMessage(null);
          });
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }

    const timer = setTimeout(() => setToastMessage(null), 2400);

    return () => clearTimeout(timer);
  }, [hasSavedHomeLocation, isLocationHydrated, setCurrentAQI]);

  useEffect(() => {
    setSelectedLocation(currentAQI);
    setCurrentAQIReading(currentAQI);
  }, [currentAQI]);

  const filteredLocations = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    if (!normalizedSearch) {
      return sampleHomeAQIReadings;
    }

    return sampleHomeAQIReadings.filter((location) =>
      location.locationName.toLowerCase().includes(normalizedSearch),
    );
  }, [searchText]);

  const handleLocationSelect = async (location: AQIReading) => {
    setSelectedLocation(location);
    setCurrentAQIReading(location);
    setCurrentAQI(location);
    setIsLoading(true);
    try {
      const liveReading = await fetchLiveAQIByStation(
        CITY_STATIONS.Bengaluru.stationId,
        CITY_STATIONS.Bengaluru.coordinates,
      );
      setSelectedLocation(liveReading);
      setCurrentAQIReading(liveReading);
      setCurrentAQI(liveReading);
      setErrorMessage(null);
    } catch (error: unknown) {
      console.error('Home AQI location refresh failed:', error);
      const cachedReading = await getCachedAQIByStation(CITY_STATIONS.Bengaluru.stationId);
      if (cachedReading) {
        setSelectedLocation(cachedReading);
        setCurrentAQIReading(cachedReading);
        setCurrentAQI(cachedReading);
        setErrorMessage(null);
      } else {
        setErrorMessage(AIR_QUALITY_LOAD_ERROR_MESSAGE);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {toastMessage ? <Text style={styles.toast}>{toastMessage}</Text> : null}

        <Text style={styles.eyebrow}>AirAware</Text>
        <Text style={styles.title}>Home</Text>
        <Text style={styles.subtitle}>
          {selectedLocation?.locationName ?? 'Home'} is selected. You have{' '}
          {favoriteLocations.length} favorite locations.
        </Text>

        <TouchableOpacity
          activeOpacity={0.76}
          onPress={() => openAQIDetails(currentAQIReading)}
          style={styles.summaryCard}>
          <Text style={styles.cardLabel}>Current AQI</Text>
          <Text style={styles.aqiValue}>{currentAQIReading.aqiValue}</Text>
          {isLoading ? <ActivityIndicator color="#267D70" /> : null}
          <Text style={styles.cardStatus}>
            {currentAQIReading.category} air quality near{' '}
            {currentAQIReading.locationName}
          </Text>
          <Text style={styles.updatedText}>{formatAQIUpdateStatus(currentAQIReading, now)}</Text>
        </TouchableOpacity>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <TextInput
          style={styles.searchInput}
          placeholder="Search sample locations"
          placeholderTextColor="#8EA09D"
          value={searchText}
          onChangeText={setSearchText}
        />

        <View style={styles.locationList}>
          {filteredLocations.map((location) => {
            const isSelected = selectedLocation?.id === location.id;

            return (
              <TouchableOpacity
                key={location.id}
                activeOpacity={0.76}
                onPress={() => handleLocationSelect(location)}
                style={[styles.locationPill, isSelected && styles.selectedLocationPill]}>
                <Text
                  style={[
                    styles.locationPillText,
                    isSelected && styles.selectedLocationPillText,
                  ]}>
                  {location.locationName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FBFA',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 36,
    paddingHorizontal: 28,
    paddingTop: 36,
  },
  toast: {
    alignSelf: 'flex-start',
    backgroundColor: '#EAF7F4',
    borderColor: '#BCE9DD',
    borderRadius: 999,
    borderWidth: 1,
    color: '#267D70',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  eyebrow: {
    color: '#267D70',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  title: {
    color: '#12312D',
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    color: '#5C706D',
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 28,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D7E3E0',
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 22,
    paddingHorizontal: 22,
    paddingVertical: 24,
  },
  cardLabel: {
    color: '#667875',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  aqiValue: {
    color: '#12312D',
    fontSize: 54,
    fontWeight: '800',
    marginBottom: 6,
  },
  cardStatus: {
    color: '#267D70',
    fontSize: 16,
    fontWeight: '800',
  },
  updatedText: {
    color: '#667875',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 10,
  },
  errorText: {
    color: '#C0392B',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 16,
  },
  searchInput: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderColor: '#D7E3E0',
    borderRadius: 14,
    borderWidth: 1,
    color: '#12312D',
    fontSize: 16,
    marginBottom: 14,
    paddingHorizontal: 16,
  },
  locationList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  locationPill: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D7E3E0',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  selectedLocationPill: {
    backgroundColor: '#267D70',
    borderColor: '#267D70',
  },
  locationPillText: {
    color: '#5C706D',
    fontSize: 14,
    fontWeight: '800',
  },
  selectedLocationPillText: {
    color: '#FFFFFF',
  },
});
