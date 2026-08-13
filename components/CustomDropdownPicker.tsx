import { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type CustomDropdownPickerProps<T extends string> = {
  label?: string;
  placeholder?: string;
  options: readonly T[] | T[];
  selectedValue: T;
  onValueChange: (value: T) => void;
};

export default function CustomDropdownPicker<T extends string>({
  label,
  placeholder = 'Select an option',
  options,
  selectedValue,
  onValueChange,
}: CustomDropdownPickerProps<T>) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (item: T) => {
    onValueChange(item);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TouchableOpacity
        activeOpacity={0.8}
        accessibilityRole="combobox"
        onPress={() => setModalVisible(true)}
        style={styles.pickerButton}>
        <Text style={[styles.pickerValue, !selectedValue && styles.pickerPlaceholder]}>
          {selectedValue || placeholder}
        </Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || 'Select Option'}</Text>
              <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const isSelected = item === selectedValue;
                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleSelect(item)}
                    style={[styles.optionRow, isSelected && styles.optionRowSelected]}>
                    <Text
                      style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                      {item}
                    </Text>
                    {isSelected ? <Text style={styles.checkMark}>✓</Text> : null}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </Pressable>
      </Modal>
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
  pickerButton: {
    alignItems: 'center',
    backgroundColor: '#F8FBFA',
    borderColor: '#D7E3E0',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 50,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  pickerValue: {
    color: '#12312D',
    fontSize: 16,
    fontWeight: '700',
  },
  pickerPlaceholder: {
    color: '#8EA09D',
    fontWeight: '400',
  },
  dropdownArrow: {
    color: '#267D70',
    fontSize: 12,
    fontWeight: '800',
  },
  modalOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(18, 49, 45, 0.45)',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    maxHeight: '65%',
    elevation: 8,
    padding: 20,
    shadowColor: '#12312D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    width: '100%',
  },
  modalHeader: {
    alignItems: 'center',
    borderBottomColor: '#D7E3E0',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
  },
  modalTitle: {
    color: '#12312D',
    fontSize: 18,
    fontWeight: '800',
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    color: '#5C706D',
    fontSize: 18,
    fontWeight: '800',
  },
  optionRow: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  optionRowSelected: {
    backgroundColor: '#EAF7F4',
  },
  optionLabel: {
    color: '#5C706D',
    fontSize: 16,
    fontWeight: '600',
  },
  optionLabelSelected: {
    color: '#267D70',
    fontWeight: '800',
  },
  checkMark: {
    color: '#267D70',
    fontSize: 16,
    fontWeight: '800',
  },
});
