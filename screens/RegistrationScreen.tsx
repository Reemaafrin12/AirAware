import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import CustomDropdownPicker from '../components/CustomDropdownPicker';
import CustomRadioButton from '../components/CustomRadioButton';
import type { RootStackParamList } from '../navigation/types';

type RegistrationScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  'RegistrationScreen'
>;

const cityOptions = [
  'Bengaluru',
  'Delhi',
  'Mumbai',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
] as const;

const genderOptions = ['Male', 'Female', 'Other'] as const;

export default function RegistrationScreen() {
  const navigation = useNavigation<RegistrationScreenNavigation>();

  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState<(typeof genderOptions)[number]>('Male');
  const [dob, setDob] = useState('');
  const [city, setCity] = useState<(typeof cityOptions)[number]>('Bengaluru');
  const [address, setAddress] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const clearError = (field: string) =>
    setErrors((current) => ({ ...current, [field]: undefined }));

  const handleRegister = () => {
    const nextErrors: Record<string, string | undefined> = {};
    if (!fullName.trim()) nextErrors.fullName = 'Full Name is required.';
    else if (!/^[A-Za-z]+(?:\s+[A-Za-z]+)*$/.test(fullName.trim())) {
      nextErrors.fullName = 'Use alphabetic characters and spaces only.';
    }
    if (!/^\d{10}$/.test(mobileNumber.trim())) {
      nextErrors.mobileNumber = 'Mobile Number must be exactly 10 digits.';
    }
    if (!email.trim()) nextErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (!password) nextErrors.password = 'Password is required.';
    else if (password.length < 8 || !/\d/.test(password)) {
      nextErrors.password = 'Use at least 8 characters including one number.';
    }
    if (!confirmPassword) nextErrors.confirmPassword = 'Please confirm your password.';
    else if (confirmPassword !== password) nextErrors.confirmPassword = 'Passwords must match.';
    if (!dob.trim()) nextErrors.dob = 'Date of Birth is required.';
    if (!city) nextErrors.city = 'City is required.';
    if (!address.trim()) nextErrors.address = 'Home Address is required.';
    if (!acceptedTerms) nextErrors.acceptedTerms = 'Accept the Terms & Conditions to continue.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const formData = {
      fullName,
      mobileNumber,
      email,
      password,
      confirmPassword,
      gender,
      dob,
      city,
      address,
      acceptedTerms,
    };
    console.log('Registration Submitted:', formData);

    Alert.alert(
      'Registration Successful',
      `Welcome to AirAware, ${fullName || 'User'}! Please log in to continue.`,
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('LoginScreen'),
        },
      ],
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to personalize your air quality alerts.</Text>

        <View style={styles.card}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={(value) => {
              setFullName(value);
              clearError('fullName');
            }}
            placeholder="e.g. Aarav Mehta"
            placeholderTextColor="#8EA09D"
          />
          {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}

          <Text style={styles.inputLabel}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            value={mobileNumber}
            onChangeText={(value) => {
              setMobileNumber(value);
              clearError('mobileNumber');
            }}
            placeholder="+91 98765 43210"
            placeholderTextColor="#8EA09D"
            keyboardType="phone-pad"
          />
          {errors.mobileNumber ? <Text style={styles.errorText}>{errors.mobileNumber}</Text> : null}

          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              clearError('email');
            }}
            placeholder="aarav@example.com"
            placeholderTextColor="#8EA09D"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              clearError('password');
            }}
            placeholder="Enter password"
            placeholderTextColor="#8EA09D"
            secureTextEntry
          />
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

          <Text style={styles.inputLabel}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={(value) => {
              setConfirmPassword(value);
              clearError('confirmPassword');
            }}
            placeholder="Confirm password"
            placeholderTextColor="#8EA09D"
            secureTextEntry
          />
          {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

          <CustomRadioButton
            label="Gender"
            options={genderOptions}
            selectedOption={gender}
            onSelect={(value) => {
              setGender(value);
              clearError('gender');
            }}
          />

          <Text style={styles.inputLabel}>Date of Birth</Text>
          <TextInput
            style={styles.input}
            value={dob}
            onChangeText={(value) => {
              setDob(value);
              clearError('dob');
            }}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#8EA09D"
          />
          {errors.dob ? <Text style={styles.errorText}>{errors.dob}</Text> : null}

          <CustomDropdownPicker
            label="Select City"
            options={cityOptions}
            selectedValue={city}
            onValueChange={(value) => {
              setCity(value);
              clearError('city');
            }}
          />
          {errors.city ? <Text style={styles.errorText}>{errors.city}</Text> : null}

          <Text style={styles.inputLabel}>Home Address</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={address}
            onChangeText={(value) => {
              setAddress(value);
              clearError('address');
            }}
            placeholder="Street name, landmark, area..."
            placeholderTextColor="#8EA09D"
            multiline
          />
          {errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}

          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchLabel}>Accept Terms & Conditions</Text>
              <Text style={styles.switchSublabel}>I agree to the privacy policy and terms.</Text>
            </View>
            <Switch
              value={acceptedTerms}
              onValueChange={(value) => {
                setAcceptedTerms(value);
                clearError('acceptedTerms');
              }}
              trackColor={{ false: '#D7E3E0', true: '#267D70' }}
              thumbColor="#FFFFFF"
            />
          </View>
          {errors.acceptedTerms ? <Text style={styles.errorText}>{errors.acceptedTerms}</Text> : null}

          <TouchableOpacity style={styles.submitButton} onPress={handleRegister}>
            <Text style={styles.submitButtonText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.loginLinkText}>Already have an account? Log In</Text>
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
  errorText: {
    color: '#C0392B',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: -8,
  },
  multilineInput: {
    minHeight: 76,
    textAlignVertical: 'top',
  },
  switchRow: {
    alignItems: 'center',
    backgroundColor: '#F8FBFA',
    borderColor: '#D7E3E0',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
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
  },
  switchSublabel: {
    color: '#667875',
    fontSize: 12,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: '#267D70',
    borderRadius: 16,
    justifyContent: 'center',
    paddingVertical: 15,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 14,
    paddingVertical: 8,
  },
  loginLinkText: {
    color: '#267D70',
    fontSize: 14,
    fontWeight: '800',
  },
});
