import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import LocationListItem from '../components/LocationListItem';
import { useLocation } from '../context/LocationContext';
import { sampleCityAQIReadings } from '../data/sampleAQIData';
import { useOpenAQIDetails } from '../navigation/AQIDetailsNavigationContext';
import {
  AIR_QUALITY_LOAD_ERROR_MESSAGE,
  CITY_COORDINATES,
  CITY_STATIONS,
  fetchLiveAQIByStation,
  getCachedAQIByStation,
} from '../api/aqiService';
import type { AQIReading } from '../types/airQuality';

const searchableCities: AQIReading[] = Object.keys(CITY_COORDINATES).map((cityName) => {
  const sample = sampleCityAQIReadings.find((item) => item.locationName === cityName);
  return (
    sample ?? {
      id: cityName.toLowerCase(),
      locationName: cityName,
      aqiValue: 0,
      category: 'Good',
    }
  );
});

export default function CitySearchScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [liveReadings, setLiveReadings] = useState<Record<string, AQIReading>>({});
  const [loadingCityId, setLoadingCityId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { setCurrentAQI } = useLocation();
  const openAQIDetails = useOpenAQIDetails();

  const filteredCities = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return searchableCities;
    }

    return searchableCities.filter((city) =>
      city.locationName.toLowerCase().includes(normalizedSearch),
    );
  }, [searchTerm]);

  const fetchCityReading = async (city: AQIReading) => {
    const station = CITY_STATIONS[city.locationName];
    if (!station) {
      setErrorMessage(`No WAQI station is configured for ${city.locationName}.`);
      return;
    }

    setLoadingCityId(city.id);
    setErrorMessage(null);
    try {
      const liveReading = await fetchLiveAQIByStation(
        station.stationId,
        station.coordinates,
      );
      setLiveReadings((current) => ({ ...current, [city.id]: liveReading }));
      setCurrentAQI(liveReading);
      openAQIDetails({ ...liveReading, alreadyFetched: true });
    } catch (error: unknown) {
      console.error(`City AQI fetch failed for ${city.locationName}:`, error);
      const cachedReading = await getCachedAQIByStation(station.stationId);
      if (cachedReading) {
        setLiveReadings((current) => ({ ...current, [city.id]: cachedReading }));
        setCurrentAQI(cachedReading);
        setErrorMessage(null);
        openAQIDetails({ ...cachedReading, alreadyFetched: true });
      } else {
        setErrorMessage(AIR_QUALITY_LOAD_ERROR_MESSAGE);
        Alert.alert(`Unable to load ${city.locationName} AQI`, AIR_QUALITY_LOAD_ERROR_MESSAGE);
      }
    } finally {
      setLoadingCityId(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>City Search</Text>
        <Text style={styles.subtitle}>Search sample city AQI readings.</Text>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search city"
        placeholderTextColor="#8EA09D"
        value={searchTerm}
        onChangeText={(value) => {
          setSearchTerm(value);
          setErrorMessage(null);
        }}
        onSubmitEditing={() => {
          const firstMatch = filteredCities[0];
          if (firstMatch) void fetchCityReading(firstMatch);
        }}
        returnKeyType="search"
        autoCapitalize="words"
      />
      {loadingCityId ? <ActivityIndicator color="#267D70" style={styles.loading} /> : null}
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <FlatList
        data={filteredCities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const reading = liveReadings[item.id] ?? item;
          return (
            <LocationListItem
              name={reading.locationName}
              aqiValue={reading.aqiValue}
              category={reading.category}
              onPress={() => void fetchCityReading(item)}
            />
          );
        }}
        ListEmptyComponent={<Text style={styles.emptyText}>No cities found</Text>}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FBFA',
    paddingHorizontal: 24,
    paddingTop: 26,
  },
  header: {
    marginBottom: 18,
  },
  title: {
    color: '#12312D',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    color: '#5C706D',
    fontSize: 15,
    lineHeight: 22,
  },
  searchInput: {
    height: 54,
    backgroundColor: '#FFFFFF',
    borderColor: '#D7E3E0',
    borderRadius: 14,
    borderWidth: 1,
    color: '#12312D',
    fontSize: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyText: {
    color: '#667875',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 28,
    textAlign: 'center',
  },
  loading: {
    marginBottom: 10,
  },
  errorText: {
    color: '#C0392B',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
});
