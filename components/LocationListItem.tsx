import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import type { AirQualityCategory } from '../types/airQuality';

export type { AirQualityCategory };

type LocationListItemProps = {
  name: string;
  aqiValue: number;
  category: AirQualityCategory;
  onPress?: () => void;
};

export default function LocationListItem({
  name,
  aqiValue,
  category,
  onPress,
}: LocationListItemProps) {
  return (
    <TouchableOpacity
      accessibilityRole={onPress ? 'button' : undefined}
      activeOpacity={0.76}
      disabled={!onPress}
      onPress={onPress}
      style={styles.card}>
      <View style={styles.copy}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.aqiLabel}>
          AQI <Text style={styles.aqiValue}>{aqiValue}</Text>
        </Text>
      </View>

      <View style={[styles.badge, badgeStyles[category]]}>
        <Text style={[styles.badgeText, badgeTextStyles[category]]}>{category}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 86,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#D7E3E0',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  copy: {
    flex: 1,
    paddingRight: 12,
  },
  name: {
    color: '#12312D',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 6,
  },
  aqiLabel: {
    color: '#667875',
    fontSize: 14,
    fontWeight: '600',
  },
  aqiValue: {
    color: '#12312D',
    fontSize: 20,
    fontWeight: '800',
  },
  badge: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    minWidth: 92,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '800',
  },
  goodBadge: {
    backgroundColor: '#DDF7E8',
    borderColor: '#9BE0B7',
  },
  goodBadgeText: {
    color: '#17663A',
  },
  moderateBadge: {
    backgroundColor: '#FFF0D4',
    borderColor: '#F6C06A',
  },
  moderateBadgeText: {
    color: '#925B00',
  },
  unhealthyBadge: {
    backgroundColor: '#FFE2DF',
    borderColor: '#F5A09A',
  },
  unhealthyBadgeText: {
    color: '#9F241F',
  },
});

const badgeStyles = {
  Good: styles.goodBadge,
  Moderate: styles.moderateBadge,
  Unhealthy: styles.unhealthyBadge,
};

const badgeTextStyles = {
  Good: styles.goodBadgeText,
  Moderate: styles.moderateBadgeText,
  Unhealthy: styles.unhealthyBadgeText,
};
