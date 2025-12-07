import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { HourlyForecast } from '@/types';

interface HourlyForecastListProps {
  hourlyData: HourlyForecast[];
  temperatureUnit: 'metric' | 'imperial';
  getWeatherIcon: (condition: string) => string;
}

export default function HourlyForecastList({ hourlyData, temperatureUnit, getWeatherIcon }: HourlyForecastListProps) {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={styles.hourlyContainer} 
      contentContainerStyle={styles.hourlyContent}
    >
      {hourlyData && hourlyData.length > 0 ? (
        hourlyData.map((hour, index) => (
          <View key={index} style={styles.hourlyItem}>
            <Text style={styles.hourlyTime}>{formatTime(hour.timestamp)}</Text>
            <Text style={styles.hourlyIcon}>{getWeatherIcon(hour.condition)}</Text>
            <Text style={styles.hourlyTemp}>
              {Math.round(hour.temp)}°{temperatureUnit === 'metric' ? 'C' : 'F'}
            </Text>
          </View>
        ))
      ) : (
        [1, 2, 3, 4, 5, 6].map((hour, index) => (
          <View key={index} style={styles.hourlyItem}>
            <Text style={styles.hourlyTime}>{hour} PM</Text>
            <Text style={styles.hourlyIcon}>☀️</Text>
            <Text style={styles.hourlyTemp}>20°C</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hourlyContainer: {
    width: '90%',
    maxWidth: 400,
    alignSelf: 'center',
    marginBottom: 30,
    flexGrow: 0,
  },
  hourlyContent: {
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  hourlyItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  hourlyTime: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  hourlyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  hourlyTemp: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
