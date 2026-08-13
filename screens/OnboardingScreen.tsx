import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const slides = [
  {
    title: 'Know your air',
    description: 'See the conditions around you at a glance.',
    image: require('../assets/images/icon.png'),
  },
  {
    title: 'Get personalized advisories',
    description: 'Simple guidance for your plans and health needs.',
    image: require('../assets/images/logo-glow.png'),
  },
  {
    title: 'Works offline',
    description: 'Keep recent air quality guidance available anywhere.',
    image: require('../assets/images/splash-icon.png'),
  },
];

type OnboardingScreenProps = {
  onDone: () => void;
};

export default function OnboardingScreen({ onDone }: OnboardingScreenProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const slide = slides[activeSlide];
  const isLastSlide = activeSlide === slides.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      onDone();
      return;
    }

    setActiveSlide(activeSlide + 1);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={onDone}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.imageFrame}>
          <Image style={styles.image} source={slide.image} />
        </View>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.description}>{slide.description}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((item, index) => (
            <View
              key={item.title}
              style={[styles.dot, index === activeSlide && styles.activeDot]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>{isLastSlide ? 'Start' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FBFA',
    paddingHorizontal: 28,
    paddingBottom: 40,
    paddingTop: 56,
  },
  skipButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  skipText: {
    color: '#267D70',
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageFrame: {
    width: 196,
    height: 196,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF7F4',
    borderRadius: 48,
    marginBottom: 44,
  },
  image: {
    width: 124,
    height: 124,
    resizeMode: 'contain',
  },
  title: {
    color: '#12312D',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 14,
    textAlign: 'center',
  },
  description: {
    color: '#5C706D',
    fontSize: 17,
    lineHeight: 25,
    maxWidth: 300,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    marginBottom: 28,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: '#C9D8D5',
    borderRadius: 4,
    marginHorizontal: 5,
  },
  activeDot: {
    width: 24,
    backgroundColor: '#267D70',
  },
  nextButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#267D70',
    borderRadius: 16,
    paddingVertical: 16,
  },
  nextText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
});
