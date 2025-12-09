import { fetchWeatherByCity } from "@/api/weather-service";
import CityCard from "@/components/CityCard";
import EmptyState from "@/components/EmptyState";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import { useWeather } from "@/context/weather-context";
import { SHADOW_NONE } from "@/utils/colors";
import { getWeatherIcon } from "@/utils/weatherUtils";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CityWeather {
  id: string;
  name: string;
  country: string;
  temperature: number;
  condition: string;
}

export default function Cities() {
  const router = useRouter();
  const {
    savedLocations,
    removeLocation,
    temperatureUnit,
    setSelectedCity,
    clearLocations,
  } = useWeather();
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
          const weather = await fetchWeatherByCity(
            location.city,
            temperatureUnit
          );
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
      <LinearGradient
        colors={["#3D4E81", "#5753C9", "#6E7FF3"]}
        locations={[0, 0.48, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
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
            onPress={() => router.push("/search")}
          >
            <Ionicons name="search" size={20} color="#fff" />
            <Text style={styles.searchBarText}>Search for city...</Text>
          </TouchableOpacity>
          {savedLocations.length > 0 && (
            <TouchableOpacity
              onPress={clearLocations}
              style={[
                styles.clearButtonContainer,
                savedLocations.length === 0 && styles.clearButtonDisabled,
              ]}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <LoadingScreen />
          ) : savedLocations.length === 0 ? (
            <EmptyState
              icon="location-outline"
              message="No saved cities yet. Search for a city to add it to your list."
              actionLabel="Add City"
              onAction={() => router.push("/search")}
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
                  router.push("/");
                }}
                onDelete={() => removeLocation(cityWeather.id)}
                isSelected={selectedCity === cityWeather.id}
              />
            ))
          )}
        </ScrollView>
        <Footer />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 20,
    gap: 12,
  },
  backButton: {
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
  },
  searchBarText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
  },
  clearButtonContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 8,
  },
  clearButtonDisabled: {
    backgroundColor: "rgba(128, 128, 128, 0.3)",
    ...SHADOW_NONE,
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
});
