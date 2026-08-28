import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';

import type { RootStackParamList } from '../navigation/types';
import { setLoggedIn, type AppDispatch } from '../store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_TOKEN_KEY, createSimulatedJwt } from '../auth';

type LoginScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  'LoginScreen'
>;

export default function LoginScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<LoginScreenNavigation>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; auth?: string }>({});

  const handleLogin = async () => {
    const nextErrors: typeof errors = {};
    if (!email.trim()) nextErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (!password) nextErrors.password = 'Password is required.';
    else if (password.length < 8 || !/\d/.test(password)) {
      nextErrors.password = 'Password must be at least 8 characters and include a number.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      const token = createSimulatedJwt(email.trim());
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      dispatch(setLoggedIn(true));
      Alert.alert('Login Successful', 'You are now signed in to AirAware.');
      navigation.replace('MainApp');
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'object' && error !== null && 'message' in error
            ? String(error.message)
            : String(error);
      // Temporary diagnostics: keep the original exception visible while this simulation is debugged.
      console.error('[Login] Simulated authentication failed:', error);
      setErrors({ auth: `Authentication failed: ${message}` });
      Alert.alert('Login Error', `Unable to complete simulated authentication: ${message}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.logo} source={require('../assets/images/icon.png')} />
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Log in to keep tracking your air.</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            setErrors((current) => ({ ...current, email: undefined, auth: undefined }));
          }}
          placeholder="Email"
          placeholderTextColor="#8EA09D"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            setErrors((current) => ({ ...current, password: undefined, auth: undefined }));
          }}
          placeholder="Password"
          placeholderTextColor="#8EA09D"
          secureTextEntry
        />
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
        {errors.auth ? <Text style={styles.errorText}>{errors.auth}</Text> : null}

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.links}>
        <TouchableOpacity>
          <Text style={styles.linkText}>Forgot Password</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('RegistrationScreen')}>
          <Text style={styles.linkText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F8FBFA',
    paddingHorizontal: 28,
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logo: {
    width: 72,
    height: 72,
    marginBottom: 24,
  },
  title: {
    color: '#12312D',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#5C706D',
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
  },
  input: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderColor: '#D7E3E0',
    borderRadius: 14,
    borderWidth: 1,
    color: '#12312D',
    fontSize: 16,
    marginBottom: 14,
    paddingHorizontal: 16,
  },
  errorText: {
    color: '#C0392B',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: -8,
  },
  loginButton: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#267D70',
    borderRadius: 16,
    marginTop: 6,
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  links: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  linkText: {
    color: '#267D70',
    fontSize: 16,
    fontWeight: '700',
  },
});
