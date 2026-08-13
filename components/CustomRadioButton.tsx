import { Pressable, StyleSheet, Text, View } from 'react-native';

type CustomRadioButtonProps<T extends string> = {
  options: readonly T[] | T[];
  selectedOption: T;
  onSelect: (option: T) => void;
  label?: string;
};

export default function CustomRadioButton<T extends string>({
  options,
  selectedOption,
  onSelect,
  label,
}: CustomRadioButtonProps<T>) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.optionsRow}>
        {options.map((option) => {
          const isSelected = option === selectedOption;
          return (
            <Pressable
              key={option}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              onPress={() => onSelect(option)}
              style={[styles.radioItem, isSelected && styles.radioItemSelected]}>
              <View style={[styles.outerCircle, isSelected && styles.outerCircleSelected]}>
                {isSelected ? <View style={styles.innerDot} /> : null}
              </View>
              <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                {option}
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
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  radioItem: {
    alignItems: 'center',
    backgroundColor: '#F8FBFA',
    borderColor: '#D7E3E0',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  radioItemSelected: {
    backgroundColor: '#EAF7F4',
    borderColor: '#267D70',
  },
  outerCircle: {
    alignItems: 'center',
    borderColor: '#8EA09D',
    borderRadius: 999,
    borderWidth: 2,
    height: 20,
    justifyContent: 'center',
    marginRight: 8,
    width: 20,
  },
  outerCircleSelected: {
    borderColor: '#267D70',
  },
  innerDot: {
    backgroundColor: '#267D70',
    borderRadius: 999,
    height: 10,
    width: 10,
  },
  optionText: {
    color: '#5C706D',
    fontSize: 15,
    fontWeight: '700',
  },
  optionTextSelected: {
    color: '#12312D',
    fontWeight: '800',
  },
});
