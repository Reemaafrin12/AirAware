import { Pressable, StyleSheet, Text, View } from 'react-native';

type StarRatingSelectorProps = {
  rating: number;
  onRatingChange: (rating: number) => void;
  label?: string;
  maxStars?: number;
};

export default function StarRatingSelector({
  rating,
  onRatingChange,
  label = 'Rate the App (1–5)',
  maxStars = 5,
}: StarRatingSelectorProps) {
  const stars = Array.from({ length: maxStars }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.starsRow}>
        {stars.map((star) => {
          const isActive = star <= rating;
          return (
            <Pressable
              key={star}
              accessibilityRole="button"
              accessibilityLabel={`Rate ${star} out of ${maxStars}`}
              onPress={() => onRatingChange(star)}
              style={[styles.starButton, isActive && styles.starButtonActive]}>
              <Text style={[styles.starIcon, isActive && styles.starIconActive]}>★</Text>
              <Text style={[styles.starNumber, isActive && styles.starNumberActive]}>
                {star}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  label: {
    color: '#667875',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 7,
    textTransform: 'uppercase',
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  starButton: {
    alignItems: 'center',
    backgroundColor: '#F8FBFA',
    borderColor: '#D7E3E0',
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  starButtonActive: {
    backgroundColor: '#FFF8E7',
    borderColor: '#F5A623',
  },
  starIcon: {
    color: '#8EA09D',
    fontSize: 22,
    marginBottom: 2,
  },
  starIconActive: {
    color: '#F5A623',
  },
  starNumber: {
    color: '#5C706D',
    fontSize: 12,
    fontWeight: '700',
  },
  starNumberActive: {
    color: '#B37200',
    fontWeight: '800',
  },
});
