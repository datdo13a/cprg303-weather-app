import { View, Text, StyleSheet } from 'react-native';

interface MainTemperatureProps {
  temperature: number;
  condition: string;
  temperatureUnit: 'metric' | 'imperial';
}

export default function MainTemperature({ temperature, condition, temperatureUnit }: MainTemperatureProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.temp}>
        {Math.round(temperature)}°{temperatureUnit === 'metric' ? 'C' : 'F'}
      </Text>
      <Text style={styles.condition}>{condition}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 40,
  },
  temp: {
    color: '#fff',
    fontSize: 72,
    fontWeight: '300',
  },
  condition: {
    color: '#fff',
    fontSize: 20,
    marginTop: 8,
  },
});
