import { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';

import LocationListItem from '../components/LocationListItem';
import { useLocation } from '../context/LocationContext';
import { sampleCityAQIReadings, sampleHomeAQIReadings } from '../data/sampleAQIData';
import { useOpenAQIDetails } from '../navigation/AQIDetailsNavigationContext';
import type { RootStackParamList } from '../navigation/types';
import {
  addFavoriteLocation,
  removeFavoriteLocation,
  type AppDispatch,
} from '../store/store';
import type { FavoriteLocation } from '../types/airQuality';

export default function LocationsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const openAQIDetails = useOpenAQIDetails();
  const {
    addFavorite,
    favoriteLocations,
    removeFavorite,
    setCurrentAQI,
  } = useLocation();
  const [screenFavorites, setScreenFavorites] =
    useState<FavoriteLocation[]>(favoriteLocations);
  const [previousFavorites, setPreviousFavorites] =
    useState<FavoriteLocation[]>(favoriteLocations);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setScreenFavorites(favoriteLocations);

    const addedLocation = favoriteLocations.find(
      (location) =>
        !previousFavorites.some(
          (previousLocation) => previousLocation.id === location.id,
        ),
    );
    const removedLocation = previousFavorites.find(
      (previousLocation) =>
        !favoriteLocations.some((location) => location.id === previousLocation.id),
    );

    setPreviousFavorites(favoriteLocations);

    if (!addedLocation && !removedLocation) {
      return;
    }

    const message = addedLocation
      ? `${addedLocation.locationName} added to favorites.`
      : `${removedLocation?.locationName} removed from favorites.`;

    console.log(message);
    setToastMessage(message);

    const timer = setTimeout(() => setToastMessage(null), 2200);

    return () => clearTimeout(timer);
  }, [favoriteLocations, previousFavorites]);

  const suggestedLocations = useMemo(() => {
    const allLocations = [...sampleHomeAQIReadings, ...sampleCityAQIReadings];

    return allLocations.filter(
      (location, index, locations) =>
        locations.findIndex((item) => item.id === location.id) === index &&
        !screenFavorites.some((favorite) => favorite.id === location.id),
    );
  }, [screenFavorites]);

  const handleOpenLocation = (location: FavoriteLocation) => {
    setCurrentAQI(location);
    openAQIDetails(location);
  };

  const handleAddFavorite = (location: FavoriteLocation) => {
    addFavorite(location);
    dispatch(addFavoriteLocation(location));
  };

  const handleRemoveFavorite = (location: FavoriteLocation) => {
    removeFavorite(location.id);
    dispatch(removeFavoriteLocation(location.id));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={screenFavorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.locationBlock}>
            <LocationListItem
              name={item.locationName}
              aqiValue={item.aqiValue}
              category={item.category}
              onPress={() => handleOpenLocation(item)}
            />
            <TouchableOpacity
              activeOpacity={0.78}
              onPress={() => handleRemoveFavorite(item)}
              style={styles.removeButton}>
              <Text style={styles.removeButtonText}>Remove Favorite</Text>
            </TouchableOpacity>
          </View>
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            {toastMessage ? <Text style={styles.toast}>{toastMessage}</Text> : null}
            <View style={styles.titleRow}>
              <Text style={styles.title}>Saved Locations</Text>
              <TouchableOpacity
                style={styles.addCustomButton}
                onPress={() => navigation.navigate('AddFavoriteLocationScreen')}>
                <Text style={styles.addCustomButtonText}>+ Add Location</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.subtitle}>
              Context favorites are mirrored into Redux when you add or remove.
            </Text>
          </View>
        }
        ListEmptyComponent={<Text style={styles.emptyText}>No saved locations yet</Text>}
        ListFooterComponent={
          <View style={styles.suggestedSection}>
            <Text style={styles.sectionTitle}>Add another location</Text>
            {suggestedLocations.map((location) => (
              <TouchableOpacity
                key={location.id}
                activeOpacity={0.78}
                onPress={() => handleAddFavorite(location)}
                style={styles.addRow}>
                <View>
                  <Text style={styles.addRowTitle}>{location.locationName}</Text>
                  <Text style={styles.addRowMeta}>
                    AQI {location.aqiValue} · {location.category}
                  </Text>
                </View>
                <Text style={styles.addRowAction}>Add</Text>
              </TouchableOpacity>
            ))}
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FBFA',
  },
  listContent: {
    paddingBottom: 28,
    paddingHorizontal: 24,
    paddingTop: 26,
  },
  header: {
    marginBottom: 20,
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
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  title: {
    color: '#12312D',
    fontSize: 26,
    fontWeight: '800',
  },
  addCustomButton: {
    backgroundColor: '#267D70',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addCustomButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  subtitle: {
    color: '#5C706D',
    fontSize: 15,
    lineHeight: 22,
  },
  locationBlock: {
    marginBottom: 12,
  },
  removeButton: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    borderColor: '#D9473F',
    borderRadius: 999,
    borderWidth: 1,
    marginTop: -4,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  removeButtonText: {
    color: '#D9473F',
    fontSize: 13,
    fontWeight: '800',
  },
  suggestedSection: {
    marginTop: 18,
  },
  sectionTitle: {
    color: '#12312D',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  addRow: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#D7E3E0',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  addRowTitle: {
    color: '#12312D',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  addRowMeta: {
    color: '#667875',
    fontSize: 13,
    fontWeight: '700',
  },
  addRowAction: {
    color: '#267D70',
    fontSize: 14,
    fontWeight: '800',
  },
  emptyText: {
    color: '#667875',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 28,
    textAlign: 'center',
  },
});
