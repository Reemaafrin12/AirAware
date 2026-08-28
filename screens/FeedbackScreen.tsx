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

import StarRatingSelector from '../components/StarRatingSelector';
import { useUser } from '../context/UserContext';

export default function FeedbackScreen() {
  const navigation = useNavigation();
  const { profile } = useUser();

  const [name, setName] = useState(profile.name || '');
  const [rating, setRating] = useState(0);
  const [suggestions, setSuggestions] = useState('');
  const [recommend, setRecommend] = useState(true);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const handleSubmitFeedback = () => {
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = 'Name is required.';
    if (rating < 1) nextErrors.rating = 'Select a star rating before submitting.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const feedback = {
      name,
      rating,
      suggestions,
      recommend,
    };
    console.log('App Feedback Submitted:', feedback);

    Alert.alert(
      'Thank You for Your Feedback!',
      `Rating: ${rating}/5 stars. We appreciate your input!`,
      [
        {
          text: 'OK',
          onPress: () => {
            setSuggestions('');
            navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>App Feedback</Text>
        <Text style={styles.subtitle}>Help us improve AirAware for everyone.</Text>

        <View style={styles.card}>
          <Text style={styles.inputLabel}>Your Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={(value) => {
              setName(value);
              setErrors((current) => ({ ...current, name: undefined }));
            }}
            placeholder="Enter your name"
            placeholderTextColor="#8EA09D"
          />
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

          <StarRatingSelector
            label="Rate Your Experience (1–5 Stars)"
            rating={rating}
            onRatingChange={(value) => {
              setRating(value);
              setErrors((current) => ({ ...current, rating: undefined }));
            }}
          />
          {errors.rating ? <Text style={styles.errorText}>{errors.rating}</Text> : null}

          <Text style={styles.inputLabel}>Suggestions & Ideas</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={suggestions}
            onChangeText={setSuggestions}
            placeholder="What features or improvements would you like to see?"
            placeholderTextColor="#8EA09D"
            multiline
          />

          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchLabel}>Would you recommend AirAware?</Text>
              <Text style={styles.switchSublabel}>
                Let us know if you would suggest AirAware to friends or family.
              </Text>
            </View>
            <Switch
              value={recommend}
              onValueChange={setRecommend}
              trackColor={{ false: '#D7E3E0', true: '#267D70' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmitFeedback}>
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
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
    minHeight: 90,
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
    marginBottom: 2,
  },
  switchSublabel: {
    color: '#667875',
    fontSize: 12,
    lineHeight: 16,
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
});
