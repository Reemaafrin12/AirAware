import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useLocation } from '../context/LocationContext';
import { sampleHomeAQIReadings } from '../data/sampleAQIData';
import { useOpenAQIDetails } from '../navigation/AQIDetailsNavigationContext';
import type { AQIReading } from '../types/airQuality';

export default function HomeScreen() {
  const openAQIDetails = useOpenAQIDetails();
  const { currentAQI, favoriteLocations, setCurrentAQI } = useLocation();
  const [searchText, setSearchText] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<AQIReading | null>(null);
  const [currentAQIReading, setCurrentAQIReading] = useState<AQIReading>(currentAQI);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const initialReading = sampleHomeAQIReadings[0];

    setSelectedLocation(initialReading);
    setCurrentAQIReading(initialReading);
    setCurrentAQI(initialReading);
    setToastMessage('Welcome back!');

    const timer = setTimeout(() => setToastMessage(null), 2400);

    return () => clearTimeout(timer);
  }, [setCurrentAQI]);

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

  const handleLocationSelect = (location: AQIReading) => {
    setSelectedLocation(location);
    setCurrentAQIReading(location);
    setCurrentAQI(location);
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
          <Text style={styles.cardStatus}>
            {currentAQIReading.category} air quality near{' '}
            {currentAQIReading.locationName}
          </Text>
        </TouchableOpacity>

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
