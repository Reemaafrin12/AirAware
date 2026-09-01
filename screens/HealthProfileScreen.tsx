import { useNavigation } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useUser } from '../context/UserContext';
import type { MainDrawerParamList } from '../navigation/types';

export default function HealthProfileScreen() {
  const navigation = useNavigation<DrawerNavigationProp<MainDrawerParamList>>();
  const { sensitivityCategory } = useUser();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Health Profile</Text>
      <Text style={styles.subtitle}>
        Tailor air-quality guidance to your respiratory sensitivity.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Sensitivity category</Text>
        <Text style={styles.category}>{sensitivityCategory}</Text>
        <Text style={styles.description}>
          This setting helps AirAware present relevant outdoor activity guidance.
        </Text>
        <TouchableOpacity
          activeOpacity={0.78}
          onPress={() => navigation.navigate('MainTabs', { screen: 'Profile' })}
          style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit sensitivity</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FBFA', padding: 24 },
  title: { color: '#12312D', fontSize: 28, fontWeight: '800', marginBottom: 6 },
  subtitle: { color: '#5C706D', fontSize: 15, lineHeight: 22, marginBottom: 24 },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D7E3E0',
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
  },
  label: { color: '#667875', fontSize: 13, fontWeight: '800', textTransform: 'uppercase' },
  category: { color: '#267D70', fontSize: 32, fontWeight: '800', marginTop: 8 },
  description: { color: '#5C706D', fontSize: 15, lineHeight: 22, marginTop: 12 },
  editButton: {
    alignItems: 'center',
    backgroundColor: '#267D70',
    borderRadius: 14,
    marginTop: 22,
    paddingVertical: 14,
  },
  editButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});
