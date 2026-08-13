import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

type SplashScreenProps = {
  onFinish: () => void;
};

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <View style={styles.logoWrap}>
        <Image style={styles.logo} source={require('../assets/images/icon.png')} />
      </View>
      <Text style={styles.appName}>AirAware</Text>
      <Text style={styles.tagline}>Know your air</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF7F4',
    paddingHorizontal: 32,
  },
  logoWrap: {
    width: 118,
    height: 118,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    marginBottom: 28,
  },
  logo: {
    width: 78,
    height: 78,
  },
  appName: {
    color: '#12312D',
    fontSize: 40,
    fontWeight: '800',
    marginBottom: 8,
  },
  tagline: {
    color: '#4E6864',
    fontSize: 18,
    fontWeight: '500',
  },
});
