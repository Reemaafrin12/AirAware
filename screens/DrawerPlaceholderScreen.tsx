import { StyleSheet, Text, View } from 'react-native';
import type { RouteProp } from '@react-navigation/native';

import type { DrawerPlaceholderRoute, MainDrawerParamList } from '../navigation/types';
import FavouriteAreasScreen from './FavouriteAreasScreen';
import HealthProfileScreen from './HealthProfileScreen';
import HelpSupportScreen from './HelpSupportScreen';

type DrawerPlaceholderScreenProps = {
  route: RouteProp<MainDrawerParamList, DrawerPlaceholderRoute>;
};

const placeholderCopy: Record<
  DrawerPlaceholderRoute,
  {
    icon: string;
    title: string;
    message: string;
  }
> = {
  MyLocations: {
    icon: '📍',
    title: 'My Locations',
    message: 'Saved air quality places will appear here.',
  },
  FavouriteAreas: {
    icon: '⭐',
    title: 'Favourite Areas',
    message: 'Favourite neighborhoods and routes will appear here.',
  },
  HealthProfile: {
    icon: '👤',
    title: 'Health Profile',
    message: 'Personal health preferences and sensitivities will appear here.',
  },
  HelpSupport: {
    icon: '❓',
    title: 'Help & Support',
    message: 'Support articles and contact options will appear here.',
  },
};

export default function DrawerPlaceholderScreen({ route }: DrawerPlaceholderScreenProps) {
  if (route.name === 'FavouriteAreas') return <FavouriteAreasScreen />;
  if (route.name === 'HealthProfile') return <HealthProfileScreen />;
  if (route.name === 'HelpSupport') return <HelpSupportScreen />;

  const copy = placeholderCopy[route.name];

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{copy.icon}</Text>
      <Text style={styles.title}>{copy.title}</Text>
      <Text style={styles.message}>{copy.message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FBFA',
    paddingHorizontal: 28,
  },
  icon: {
    fontSize: 40,
    marginBottom: 18,
  },
  title: {
    color: '#12312D',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    color: '#5C706D',
    fontSize: 16,
    lineHeight: 23,
    maxWidth: 310,
    textAlign: 'center',
  },
});
