import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import CustomRadioButton from '../components/CustomRadioButton';
import { useLocation } from '../context/LocationContext';
import { useUser, type HealthSensitivity } from '../context/UserContext';
import {
  updateBasicUserInfo,
  type AppDispatch,
  type RootState,
} from '../store/store';

const healthSensitivityOptions: readonly HealthSensitivity[] = ['Low', 'Medium', 'High'];

export default function ProfileScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const reduxUserName = useSelector((state: RootState) => state.user.name);
  const { currentAQI, favoriteLocations } = useLocation();
  const { profile, updateProfile } = useUser();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [address, setAddress] = useState(profile.address);
  const [healthSensitivity, setHealthSensitivity] = useState<HealthSensitivity>(
    profile.healthSensitivity,
  );
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    setName(profile.name);
    setEmail(profile.email);
    setPhone(profile.phone);
    setAddress(profile.address);
    setHealthSensitivity(profile.healthSensitivity);
  }, [
    profile.address,
    profile.email,
    profile.healthSensitivity,
    profile.name,
    profile.phone,
  ]);

  useEffect(() => {
    if (!saveMessage) {
      return;
    }

    const timer = setTimeout(() => setSaveMessage(null), 2500);

    return () => clearTimeout(timer);
  }, [saveMessage]);

  const avatarInitials = useMemo(
    () =>
      name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'AA',
    [name],
  );

  const handleSaveChanges = () => {
    updateProfile({
      name,
      email,
      phone,
      address,
      healthSensitivity,
    });
    dispatch(updateBasicUserInfo({ name, email }));

    const message = 'Saved profile updates to Context and Redux!';
    setSaveMessage(message);
    console.log('Profile Saved:', { name, email, phone, address, healthSensitivity });

    Alert.alert('Profile Saved', 'Your user profile details have been successfully updated.');
  };

  const handleChangePhoto = () => {
    Alert.alert('Change Profile Picture', 'Photo upload feature will be available in future updates.');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>User Profile</Text>

        <View style={styles.card}>
          {saveMessage ? <Text style={styles.toast}>{saveMessage}</Text> : null}

          {/* Profile Picture Placeholder */}
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{avatarInitials}</Text>
            </View>
            <Pressable style={styles.changePhotoBadge} onPress={handleChangePhoto}>
              <Text style={styles.changePhotoText}>📷 Change Photo</Text>
            </Pressable>
          </View>

          <Text style={styles.username}>{profile.name}</Text>
          <Text style={styles.email}>{profile.email}</Text>
          <Text style={styles.reduxName}>Redux store name: {reduxUserName}</Text>

          <View style={styles.details}>
            <Text style={styles.detailLabel}>Edit Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Name"
              placeholderTextColor="#8EA09D"
            />

            <Text style={styles.detailLabel}>Edit Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#8EA09D"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.detailLabel}>Edit Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone"
              placeholderTextColor="#8EA09D"
              keyboardType="phone-pad"
            />

            <Text style={styles.detailLabel}>Edit Home Address</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={address}
              onChangeText={setAddress}
              placeholder="Home address"
              placeholderTextColor="#8EA09D"
              multiline
            />

            <CustomRadioButton
              label="Health Sensitivity Level"
              options={healthSensitivityOptions}
              selectedOption={healthSensitivity}
              onSelect={setHealthSensitivity}
            />
          </View>

          <View style={styles.contextSummary}>
            <Text style={styles.summaryText}>
              Favorites in Context: {favoriteLocations.length}
            </Text>
            <Text style={styles.summaryText}>
              Current AQI: {currentAQI.locationName} · {currentAQI.aqiValue}
            </Text>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
            <Text style={styles.saveText}>Save Changes</Text>
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
    paddingBottom: 34,
    paddingHorizontal: 24,
    paddingTop: 34,
  },
  title: {
    color: '#12312D',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 20,
  },
  card: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    elevation: 4,
    paddingHorizontal: 22,
    paddingVertical: 28,
    shadowColor: '#12312D',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  toast: {
    alignSelf: 'stretch',
    backgroundColor: '#EAF7F4',
    borderColor: '#BCE9DD',
    borderRadius: 14,
    borderWidth: 1,
    color: '#267D70',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    textAlign: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 18,
  },
  avatar: {
    alignItems: 'center',
    aspectRatio: 1,
    backgroundColor: '#EAF7F4',
    borderColor: '#BCE9DD',
    borderRadius: 999,
    borderWidth: 2,
    height: 90,
    justifyContent: 'center',
    width: 90,
  },
  avatarText: {
    color: '#267D70',
    fontSize: 30,
    fontWeight: '800',
  },
  changePhotoBadge: {
    backgroundColor: '#F8FBFA',
    borderColor: '#D7E3E0',
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  changePhotoText: {
    color: '#267D70',
    fontSize: 12,
    fontWeight: '700',
  },
  username: {
    color: '#12312D',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
    textAlign: 'center',
  },
  email: {
    color: '#5C706D',
    fontSize: 15,
    marginBottom: 4,
    textAlign: 'center',
  },
  reduxName: {
    color: '#267D70',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 20,
    textAlign: 'center',
  },
  details: {
    alignSelf: 'stretch',
    marginBottom: 18,
  },
  detailLabel: {
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
  contextSummary: {
    alignSelf: 'stretch',
    backgroundColor: '#F8FBFA',
    borderColor: '#D7E3E0',
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 18,
    padding: 14,
  },
  summaryText: {
    color: '#5C706D',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  saveButton: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#267D70',
    borderRadius: 16,
    justifyContent: 'center',
    paddingVertical: 15,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
