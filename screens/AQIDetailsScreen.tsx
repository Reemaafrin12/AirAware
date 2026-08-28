import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';

import { useLocation } from '../context/LocationContext';
import type { RootStackParamList } from '../navigation/types';
import {
  addFavoriteLocation,
  removeFavoriteLocation,
  type AppDispatch,
} from '../store/store';
import type { AirQualityCategory } from '../types/airQuality';
import {
  CITY_COORDINATES,
  DEFAULT_AQI_COORDINATES,
  fetchLiveAQI,
} from '../api/aqiService';

type AQIDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AQIDetailsScreen'
>;

const categoryStyles: Record<
  AirQualityCategory,
  {
    backgroundColor: string;
    borderColor: string;
    textColor: string;
  }
> = {
  Good: {
    backgroundColor: '#DDF7E8',
    borderColor: '#9BE0B7',
    textColor: '#17663A',
  },
  Moderate: {
    backgroundColor: '#FFF0D4',
    borderColor: '#F6C06A',
    textColor: '#925B00',
  },
  Unhealthy: {
    backgroundColor: '#FFE2DF',
    borderColor: '#F5A09A',
    textColor: '#9F241F',
  },
};

const advisoryByCategory: Record<AirQualityCategory, string> = {
  Good: 'Outdoor plans look comfortable for most people.',
  Moderate: 'Sensitive groups may prefer shorter outdoor exposure.',
  Unhealthy: 'Limit outdoor activity and keep windows closed when possible.',
};

export default function AQIDetailsScreen({ route }: AQIDetailsScreenProps) {
  const dispatch = useDispatch<AppDispatch>();
  const {
    addFavorite,
    currentAQI,
    favoriteLocations,
    removeFavorite,
    setCurrentAQI,
  } = useLocation();
  const [reading, setReading] = useState(() =>
    currentAQI.id === route.params.id ? currentAQI : route.params,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { aqiValue, category, locationName } = reading;
  const categoryStyle = categoryStyles[category];
  const isFavorite = favoriteLocations.some((location) => location.id === reading.id);

  useEffect(() => {
    let active = true;
    const baseReading = route.params;
    const coordinates =
      baseReading.coordinates ?? CITY_COORDINATES[baseReading.locationName] ?? DEFAULT_AQI_COORDINATES;
    setReading(baseReading);
    setCurrentAQI(baseReading);
    setIsLoading(true);
    setErrorMessage(null);

    fetchLiveAQI(coordinates.lat, coordinates.lng)
      .then((liveReading) => {
        if (!active) return;
        setReading(liveReading);
        setCurrentAQI(liveReading);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setErrorMessage(error instanceof Error ? error.message : 'Unable to load live AQI.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [route.params, setCurrentAQI]);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFavorite(reading.id);
      dispatch(removeFavoriteLocation(reading.id));
      return;
    }

    addFavorite(reading);
    dispatch(addFavoriteLocation(reading));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Air quality</Text>
        <Text style={styles.title}>{locationName}</Text>
        <Text style={styles.subtitle}>{advisoryByCategory[category]}</Text>
      </View>

      <View style={styles.aqiPanel}>
        <Text style={styles.panelLabel}>Current AQI</Text>
        <Text style={styles.aqiValue}>{aqiValue}</Text>
        {isLoading ? <ActivityIndicator color="#267D70" /> : null}
        <View
          style={[
            styles.categoryBadge,
            {
              backgroundColor: categoryStyle.backgroundColor,
              borderColor: categoryStyle.borderColor,
            },
          ]}>
          <Text style={[styles.categoryText, { color: categoryStyle.textColor }]}>
            {category}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.78}
        onPress={handleFavoriteToggle}
        style={[styles.favoriteButton, isFavorite && styles.removeFavoriteButton]}>
        <Text
          style={[
            styles.favoriteButtonText,
            isFavorite && styles.removeFavoriteButtonText,
          ]}>
          {isFavorite ? 'Remove Favorite' : 'Add Favorite'}
        </Text>
      </TouchableOpacity>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <View style={styles.metricGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>PM2.5</Text>
          <Text style={styles.metricValue}>
            {reading.pollutants?.pm25 ?? Math.max(8, Math.round(aqiValue / 3))}
          </Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>PM10</Text>
          <Text style={styles.metricValue}>
            {reading.pollutants?.pm10 ?? Math.max(18, Math.round(aqiValue / 2))}
          </Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Ozone</Text>
          <Text style={styles.metricValue}>
            {reading.pollutants?.o3 ?? Math.max(11, Math.round(aqiValue / 4))}
          </Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>NO2</Text>
          <Text style={styles.metricValue}>
            {reading.pollutants?.no2 ?? Math.max(7, Math.round(aqiValue / 5))}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FBFA',
  },
  content: {
    padding: 24,
    paddingBottom: 36,
  },
  header: {
    marginBottom: 22,
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
    fontSize: 34,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    color: '#5C706D',
    fontSize: 16,
    lineHeight: 23,
  },
  errorText: {
    color: '#C0392B',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 18,
  },
  aqiPanel: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#D7E3E0',
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 18,
    paddingHorizontal: 24,
    paddingVertical: 30,
  },
  favoriteButton: {
    alignItems: 'center',
    backgroundColor: '#267D70',
    borderRadius: 16,
    justifyContent: 'center',
    marginBottom: 18,
    paddingVertical: 15,
  },
  favoriteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  removeFavoriteButton: {
    backgroundColor: '#FFE2DF',
    borderColor: '#F5A09A',
    borderWidth: 1,
  },
  removeFavoriteButtonText: {
    color: '#9F241F',
  },
  panelLabel: {
    color: '#667875',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  aqiValue: {
    color: '#12312D',
    fontSize: 68,
    fontWeight: '800',
    marginBottom: 12,
  },
  categoryBadge: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    minWidth: 118,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '800',
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D7E3E0',
    borderRadius: 16,
    borderWidth: 1,
    flexBasis: '47%',
    flexGrow: 1,
    padding: 18,
  },
  metricLabel: {
    color: '#667875',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  metricValue: {
    color: '#12312D',
    fontSize: 26,
    fontWeight: '800',
  },
});
