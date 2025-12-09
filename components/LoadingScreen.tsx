import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message }: LoadingScreenProps) {
  return (
    <LinearGradient
      colors={["#3D4E81", "#5753C9", "#6E7FF3"]}
      locations={[0, 0.48, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ActivityIndicator size="large" color="#fff" />
      {message && <Text style={styles.message}>{message}</Text>}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
  },
});
