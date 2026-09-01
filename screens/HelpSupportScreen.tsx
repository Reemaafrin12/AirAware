import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const faqs = [
  {
    question: 'How are AQI readings calculated?',
    answer: 'AirAware displays the current AQI reported by its monitoring-station data provider. Lower values generally indicate cleaner air.',
  },
  {
    question: 'How do favourite areas work?',
    answer: 'Add a location from its detail screen or the Locations tab. It will then appear here and in Saved Locations.',
  },
  {
    question: 'What happens when I am offline?',
    answer: 'Previously displayed readings remain visible, but new live readings require an internet connection.',
  },
  {
    question: 'Why can two nearby places have different AQI?',
    answer: 'Readings come from individual monitoring stations, and pollution can vary across neighbourhoods.',
  },
];

export default function HelpSupportScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Help & Support</Text>
      <Text style={styles.subtitle}>Quick answers about using AirAware.</Text>

      {faqs.map((faq) => (
        <View key={faq.question} style={styles.faqCard}>
          <Text style={styles.question}>{faq.question}</Text>
          <Text style={styles.answer}>{faq.answer}</Text>
        </View>
      ))}

      <TouchableOpacity
        activeOpacity={0.78}
        onPress={() =>
          Alert.alert('Contact Support', 'Mock support contact: support@airaware.example')
        }
        style={styles.contactButton}>
        <Text style={styles.contactButtonText}>Contact Support</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FBFA' },
  content: { padding: 24, paddingBottom: 36 },
  title: { color: '#12312D', fontSize: 28, fontWeight: '800', marginBottom: 6 },
  subtitle: { color: '#5C706D', fontSize: 15, lineHeight: 22, marginBottom: 22 },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D7E3E0',
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    padding: 17,
  },
  question: { color: '#12312D', fontSize: 16, fontWeight: '800', marginBottom: 8 },
  answer: { color: '#5C706D', fontSize: 14, lineHeight: 21 },
  contactButton: { alignItems: 'center', backgroundColor: '#267D70', borderRadius: 16, marginTop: 10, paddingVertical: 15 },
  contactButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});
