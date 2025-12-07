import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CityCardProps {
  cityName: string;
  country: string;
  temperature: number;
  condition: string;
  temperatureUnit: 'metric' | 'imperial';
  getWeatherIcon: (condition: string) => string;
  onPress: () => void;
  onSetHome: () => void;
  onDelete: () => void;
  isSelected?: boolean;
}

export default function CityCard({
  cityName,
  country,
  temperature,
  condition,
  temperatureUnit,
  getWeatherIcon,
  onPress,
  onSetHome,
  onDelete,
  isSelected = false,
}: CityCardProps) {
  return (
    <TouchableOpacity
      style={[styles.cityCard, isSelected && styles.selectedCityCard]}
      onPress={onPress}
    >
      <View style={styles.cityCardContent}>
        <View style={styles.cityLeft}>
          <Text style={styles.cityIcon}>{getWeatherIcon(condition)}</Text>
          <View>
            <Text style={styles.cityName}>{cityName}</Text>
            <Text style={styles.cityCondition}>{condition}</Text>
          </View>
        </View>
        <View style={styles.cityRight}>
          <Text style={styles.cityTemp}>
            {Math.round(temperature)}°{temperatureUnit === 'metric' ? 'C' : 'F'}
          </Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                onSetHome();
              }}
            >
              <Ionicons name="home" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Ionicons name="trash-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cityCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  selectedCityCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  cityCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cityIcon: {
    fontSize: 48,
  },
  cityName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
  },
  cityCondition: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
    marginTop: 4,
  },
  cityRight: {
    alignItems: 'flex-end',
    gap: 12,
  },
  cityTemp: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '300',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
});
