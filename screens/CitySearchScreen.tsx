import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

import LocationListItem from '../components/LocationListItem';
import { useLocation } from '../context/LocationContext';
import { sampleCityAQIReadings } from '../data/sampleAQIData';
import { useOpenAQIDetails } from '../navigation/AQIDetailsNavigationContext';

export default function CitySearchScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const { setCurrentAQI } = useLocation();
  const openAQIDetails = useOpenAQIDetails();

  const filteredCities = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return sampleCityAQIReadings;
    }

    return sampleCityAQIReadings.filter((city) =>
      city.locationName.toLowerCase().includes(normalizedSearch),
    );
  }, [searchTerm]);

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
        onChangeText={setSearchTerm}
        autoCapitalize="words"
      />

      <FlatList
        data={filteredCities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LocationListItem
            name={item.locationName}
            aqiValue={item.aqiValue}
            category={item.category}
            onPress={() => {
              setCurrentAQI(item);
              openAQIDetails(item);
            }}
          />
        )}
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
});
