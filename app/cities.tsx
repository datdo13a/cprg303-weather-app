import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useWeather } from "@/context/weather-context";
import { useState, useEffect } from "react";
import { fetchWeatherByCity } from "@/api/weather-service";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import EmptyState from "@/components/EmptyState";
import CityCard from "@/components/CityCard";
import { getWeatherIcon } from "@/utils/weatherUtils";

interface CityWeather {
  id: string;
  name: string;
  country: string;
  temperature: number;
  condition: string;
}

export default function Cities() {
  const router = useRouter();
  const { savedLocations, removeLocation, temperatureUnit, setSelectedCity, clearLocations } = useWeather();
  const [selectedCity, setLocalSelectedCity] = useState<string | null>(null);
  const [citiesWeather, setCitiesWeather] = useState<CityWeather[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch weather data for all saved cities
  useEffect(() => {
    const fetchAllWeather = async () => {
      if (savedLocations.length === 0) return;
      
      setLoading(true);
      const weatherData: CityWeather[] = [];
      
      for (const location of savedLocations) {
        try {
          const weather = await fetchWeatherByCity(location.city, temperatureUnit);
          if (weather) {
            weatherData.push({
              id: location.id,
              name: location.city,
              country: location.country,
              temperature: weather.weather.temperature,
              condition: weather.weather.condition,
            });
          }
        } catch (error) {
          console.error(`Error fetching weather for ${location.city}:`, error);
        }
      }
      
      setCitiesWeather(weatherData);
      setLoading(false);
    };

    fetchAllWeather();
  }, [savedLocations, temperatureUnit]);

  const handleCityCardPress = (cityName: string) => {
    setSelectedCity(cityName);
    router.push(`/city/${cityName}`);
  };

  return (
    <View style={styles.container}>
      {/* Header with Search Bar */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
          <TouchableOpacity 
            style={styles.searchBar}
            onPress={() => router.push('/search')}
          >
            <Ionicons name="search" size={20} color="#fff" />
            <Text style={styles.searchBarText}>Search for city...</Text>
          </TouchableOpacity>
          {savedLocations.length > 0 && (
            <TouchableOpacity 
              onPress={clearLocations} 
              style={[
                styles.clearButtonContainer,
                savedLocations.length === 0 && styles.clearButtonDisabled
              ]}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          )}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {loading ? (
          <LoadingScreen />
        ) : savedLocations.length === 0 ? (
          <EmptyState
            icon="location-outline"
            message="No saved cities yet. Search for a city to add it to your list."
            actionLabel="Add City"
            onAction={() => router.push('/search')}
          />
        ) : (
          citiesWeather.map((cityWeather) => (
            <CityCard
              key={cityWeather.id}
              cityName={cityWeather.name}
              country={cityWeather.country}
              temperature={cityWeather.temperature}
              condition={cityWeather.condition}
              temperatureUnit={temperatureUnit}
              getWeatherIcon={getWeatherIcon}
              onPress={() => router.push(`/city/${cityWeather.name}`)}
              onSetHome={() => {
                setSelectedCity(cityWeather.name);
                router.push('/');
              }}
              onDelete={() => removeLocation(cityWeather.id)}
              isSelected={selectedCity === cityWeather.id}
            />
          ))
        )}
      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E5F7C',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 20,
    gap: 12,
  },
  backButton: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
  },
  searchBarText: {
    color: '#fff',
    marginLeft: 8,
  },
  clearButtonContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  clearButtonDisabled: {
    backgroundColor: 'rgba(128, 128, 128, 0.3)',
    shadowOpacity: 0,
    elevation: 0,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
});
