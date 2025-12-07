import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RecentSearchListProps {
  searches: string[];
  onSelectSearch: (search: string) => void;
  onClear: () => void;
}

export default function RecentSearchList({ searches, onSelectSearch, onClear }: RecentSearchListProps) {
  if (searches.length === 0) return null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Searches</Text>
        <TouchableOpacity onPress={onClear}>
          <Text style={styles.clearButton}>Clear</Text>
        </TouchableOpacity>
      </View>
      {searches.map((search, index) => (
        <TouchableOpacity
          key={index}
          style={styles.item}
          onPress={() => onSelectSearch(search)}
        >
          <Ionicons name="time-outline" size={20} color="#fff" />
          <Text style={styles.text}>{search}</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    width: '90%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  clearButton: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  text: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
});
