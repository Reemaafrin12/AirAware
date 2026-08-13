import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';

import type { RootStackParamList } from '../navigation/types';
import { setLoggedIn, type AppDispatch } from '../store/store';

type LoginScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  'LoginScreen'
>;

export default function LoginScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<LoginScreenNavigation>();

  const handleLogin = () => {
    dispatch(setLoggedIn(true));
    navigation.replace('MainApp');
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
          placeholder="Email"
          placeholderTextColor="#8EA09D"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#8EA09D"
          secureTextEntry
        />

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
