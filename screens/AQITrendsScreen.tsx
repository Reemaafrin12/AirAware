import { FlatList, StyleSheet, Text, View } from 'react-native';

import LocationListItem, { type AirQualityCategory } from '../components/LocationListItem';

type DailyAQI = {
  id: string;
  date: string;
  aqiValue: number;
  category: AirQualityCategory;
};

const dailyReadings: DailyAQI[] = [
  {
    id: 'aug-04',
    date: 'Aug 4',
    aqiValue: 52,
    category: 'Moderate',
  },
  {
    id: 'aug-05',
    date: 'Aug 5',
    aqiValue: 47,
    category: 'Good',
  },
  {
    id: 'aug-06',
    date: 'Aug 6',
    aqiValue: 66,
    category: 'Moderate',
  },
  {
    id: 'aug-07',
    date: 'Aug 7',
    aqiValue: 81,
    category: 'Moderate',
  },
  {
    id: 'aug-08',
    date: 'Aug 8',
    aqiValue: 109,
    category: 'Moderate',
  },
  {
    id: 'aug-09',
    date: 'Aug 9',
    aqiValue: 154,
    category: 'Unhealthy',
  },
  {
    id: 'aug-10',
    date: 'Aug 10',
    aqiValue: 92,
    category: 'Moderate',
  },
];

export default function AQITrendsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AQI Trends</Text>
        <Text style={styles.subtitle}>Bengaluru readings from the last 7 days.</Text>
      </View>

      <FlatList
        data={dailyReadings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LocationListItem
            name={item.date}
            aqiValue={item.aqiValue}
            category={item.category}
          />
        )}
        contentContainerStyle={styles.listContent}
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
    marginBottom: 20,
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
  listContent: {
    paddingBottom: 24,
  },
});
