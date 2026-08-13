import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';

import CustomDropdownPicker from '../components/CustomDropdownPicker';
import { useLocation } from '../context/LocationContext';
import type { RootStackParamList } from '../navigation/types';
import { addFavoriteLocation, type AppDispatch } from '../store/store';
import type { FavoriteLocation } from '../types/airQuality';

type AddFavoriteLocationNavigation = NativeStackNavigationProp<
  RootStackParamList,
  'AddFavoriteLocationScreen'
>;

const sampleCities = [
  'Bengaluru',
  'Delhi',
  'Mumbai',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
] as const;

export default function AddFavoriteLocationScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<AddFavoriteLocationNavigation>();
  const { addFavorite } = useLocation();

  const [locationName, setLocationName] = useState('');
  const [city, setCity] = useState<(typeof sampleCities)[number]>('Bengaluru');
  const [stateName, setStateName] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [landmark, setLandmark] = useState('');
  const [notes, setNotes] = useState('');

  const handleSaveLocation = () => {
    const newLocation: FavoriteLocation = {
      id: `loc-custom-${Date.now()}`,
      locationName: locationName.trim() || `${city} Central`,
      aqiValue: Math.floor(Math.random() * 80) + 40, // Simulated AQI sample
      category: 'Moderate',
    };

    // Save to Context & Redux
    addFavorite(newLocation);
    dispatch(addFavoriteLocation(newLocation));

    console.log('New Location Added:', {
      newLocation,
      stateName,
      pinCode,
      landmark,
      notes,
    });

    Alert.alert(
      'Location Added',
      `"${newLocation.locationName}" has been added to your favorite locations!`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ],
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Add Favorite Location</Text>
        <Text style={styles.subtitle}>Save a new place to track its air quality level.</Text>

        <View style={styles.card}>
          <Text style={styles.inputLabel}>Location / Neighborhood Name</Text>
          <TextInput
            style={styles.input}
            value={locationName}
            onChangeText={setLocationName}
            placeholder="e.g. Koramangala 5th Block"
            placeholderTextColor="#8EA09D"
          />

          <CustomDropdownPicker
            label="City"
            options={sampleCities}
            selectedValue={city}
            onValueChange={setCity}
          />

          <Text style={styles.inputLabel}>State</Text>
          <TextInput
            style={styles.input}
            value={stateName}
            onChangeText={setStateName}
            placeholder="e.g. Karnataka"
            placeholderTextColor="#8EA09D"
          />

          <Text style={styles.inputLabel}>Area / PIN Code</Text>
          <TextInput
            style={styles.input}
            value={pinCode}
            onChangeText={setPinCode}
            placeholder="e.g. 560095"
            placeholderTextColor="#8EA09D"
            keyboardType="number-pad"
          />

          <Text style={styles.inputLabel}>Landmark (Optional)</Text>
          <TextInput
            style={styles.input}
            value={landmark}
            onChangeText={setLandmark}
            placeholder="e.g. Near Central Park"
            placeholderTextColor="#8EA09D"
          />

          <Text style={styles.inputLabel}>Notes</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add personal notes e.g. Work office area"
            placeholderTextColor="#8EA09D"
            multiline
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveLocation}>
            <Text style={styles.saveButtonText}>Save Location</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FBFA',
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 28,
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
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    elevation: 4,
    paddingHorizontal: 20,
    paddingVertical: 24,
    shadowColor: '#12312D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  inputLabel: {
    color: '#667875',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 7,
    textTransform: 'uppercase',
  },
  input: {
    minHeight: 50,
    backgroundColor: '#F8FBFA',
    borderColor: '#D7E3E0',
    borderRadius: 14,
    borderWidth: 1,
    color: '#12312D',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  multilineInput: {
    minHeight: 76,
    textAlignVertical: 'top',
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: '#267D70',
    borderRadius: 16,
    justifyContent: 'center',
    marginTop: 8,
    paddingVertical: 15,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
