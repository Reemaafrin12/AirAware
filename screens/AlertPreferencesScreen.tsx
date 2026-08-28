import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import CustomDropdownPicker from '../components/CustomDropdownPicker';

const thresholdOptions = [
  'Good (0-50)',
  'Moderate (51-100)',
  'Unhealthy (101-150)',
  'Very Unhealthy (151-200)',
  'Severe (201+)',
] as const;

const scaleOptions = [
  'US AQI (0-500)',
  'Indian NAQI',
  'CAQI (European Standard)',
  'Raw Concentrations (µg/m³)',
] as const;

export default function AlertPreferencesScreen() {
  const [threshold, setThreshold] =
    useState<(typeof thresholdOptions)[number] | undefined>(undefined);
  const [dailyAdvisory, setDailyAdvisory] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [preferredScale, setPreferredScale] =
    useState<(typeof scaleOptions)[number]>('US AQI (0-500)');
  const [thresholdError, setThresholdError] = useState<string | undefined>();

  const handleSavePreferences = () => {
    if (!threshold) {
      setThresholdError('Select an AQI Alert Threshold before saving.');
      return;
    }
    setThresholdError(undefined);
    const preferences = {
      threshold,
      dailyAdvisory,
      pushNotifications,
      preferredScale,
    };
    console.log('Alert Preferences Saved:', preferences);

    Alert.alert(
      'Preferences Saved',
      `Alert threshold set to ${threshold}. Push notifications: ${pushNotifications ? 'Enabled' : 'Disabled'}.`,
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Alert Settings</Text>
        <Text style={styles.subtitle}>Customize when and how AirAware notifies you.</Text>

        <View style={styles.card}>
          <CustomDropdownPicker
            label="AQI Alert Threshold"
            options={thresholdOptions}
            selectedValue={threshold}
            onValueChange={(value) => {
              setThreshold(value);
              setThresholdError(undefined);
            }}
          />
          {thresholdError ? <Text style={styles.errorText}>{thresholdError}</Text> : null}

          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchLabel}>Enable Daily Advisory</Text>
              <Text style={styles.switchSublabel}>
                Receive a daily morning summary of air quality conditions.
              </Text>
            </View>
            <Switch
              value={dailyAdvisory}
              onValueChange={setDailyAdvisory}
              trackColor={{ false: '#D7E3E0', true: '#267D70' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchLabel}>Enable Push Notifications</Text>
              <Text style={styles.switchSublabel}>
                Instant notifications when AQI exceeds your threshold.
              </Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: '#D7E3E0', true: '#267D70' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <CustomDropdownPicker
            label="Preferred AQI Scale / Units"
            options={scaleOptions}
            selectedValue={preferredScale}
            onValueChange={setPreferredScale}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSavePreferences}>
            <Text style={styles.saveButtonText}>Save Preferences</Text>
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
  switchRow: {
    alignItems: 'center',
    backgroundColor: '#F8FBFA',
    borderColor: '#D7E3E0',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  switchTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  switchLabel: {
    color: '#12312D',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  switchSublabel: {
    color: '#667875',
    fontSize: 12,
    lineHeight: 16,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: '#267D70',
    borderRadius: 16,
    justifyContent: 'center',
    marginTop: 8,
    paddingVertical: 15,
  },
  errorText: {
    color: '#C0392B',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: -8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
