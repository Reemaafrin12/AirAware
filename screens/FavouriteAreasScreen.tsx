import { FlatList, StyleSheet, Text, View } from 'react-native';

import LocationListItem from '../components/LocationListItem';
import { useLocation } from '../context/LocationContext';
import { useOpenAQIDetails } from '../navigation/AQIDetailsNavigationContext';

export default function FavouriteAreasScreen() {
  const { favoriteLocations } = useLocation();
  const openAQIDetails = useOpenAQIDetails();

  return (
    <View style={styles.container}>
      <FlatList
        data={favoriteLocations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LocationListItem
            name={item.locationName}
            aqiValue={item.aqiValue}
            category={item.category}
            onPress={() => openAQIDetails(item)}
          />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Favourite Areas</Text>
            <Text style={styles.subtitle}>
              Your saved locations stay in sync with the Locations tab.
            </Text>
          </View>
        }
        ListEmptyComponent={<Text style={styles.emptyText}>No favourite areas yet.</Text>}
        contentContainerStyle={styles.content}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FBFA' },
  content: { paddingHorizontal: 24, paddingTop: 26, paddingBottom: 28 },
  header: { marginBottom: 20 },
  title: { color: '#12312D', fontSize: 28, fontWeight: '800', marginBottom: 6 },
  subtitle: { color: '#5C706D', fontSize: 15, lineHeight: 22 },
  emptyText: { color: '#667875', fontSize: 16, fontWeight: '600', paddingTop: 22, textAlign: 'center' },
});
