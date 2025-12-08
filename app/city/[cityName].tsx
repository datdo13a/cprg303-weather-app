import {
  fetchDailyForecast,
  fetchHourlyForecast,
  fetchWeatherByCity,
} from "@/api/weather-service";
import Footer from "@/components/Footer";
import HourlyForecastList from "@/components/HourlyForecastList";
import LoadingScreen from "@/components/LoadingScreen";
import MainTemperature from "@/components/MainTemperature";
import WeatherHeader from "@/components/WeatherHeader";
import WeeklyForecast from "@/components/WeeklyForecast";
import { useWeather } from "@/context/weather-context";
import { CurrentWeather, ForecastItem, HourlyForecast } from "@/types";
import { getWeatherIcon } from "@/utils/weatherUtils";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function CityDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const cityName = params.cityName as string;

  const [loading, setLoading] = useState(false);
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(
    null
  );
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const { temperatureUnit } = useWeather();

  useEffect(() => {
    if (cityName) {
      loadWeatherData(cityName);
    }
  }, [cityName]);

  const loadWeatherData = async (city: string) => {
    try {
      setLoading(true);
      const weather = await fetchWeatherByCity(city, temperatureUnit);
      const forecastData = await fetchDailyForecast(city, temperatureUnit);
      const hourlyData = await fetchHourlyForecast(city, temperatureUnit, 6);

      if (weather) setCurrentWeather(weather);
      if (forecastData) setForecast(forecastData);
      if (hourlyData && hourlyData.length > 0) {
        setHourlyForecast(hourlyData);
      }
    } catch (error) {
      console.error("Error loading weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!currentWeather) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        {/* <Text style={styles.errorText}>No weather data available</Text>
        <Text style={styles.date}>Check your API key or try again later</Text> */}
      </View>
    );
  }

  const handleSearchPress = () => {
    router.push("/search");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
            <WeatherHeader
              cityName={currentWeather.city}
              date={new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "numeric",
                day: "numeric",
                year: "numeric",
              })}
            />
          </View>
        </View>

        <MainTemperature
          temperature={currentWeather.weather.temperature}
          condition={currentWeather.weather.condition}
          temperatureUnit={temperatureUnit}
        />

        <HourlyForecastList
          hourlyData={hourlyForecast}
          temperatureUnit={temperatureUnit}
          getWeatherIcon={getWeatherIcon}
        />

        <WeeklyForecast forecast={forecast} getWeatherIcon={getWeatherIcon} />
      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2E5F7C",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 24,
    marginBottom: 20,
    alignItems: "center",
    width: "100%",
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  backButton: {
    padding: 0,
  },
  errorText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  date: {
    color: "#fff",
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
  },
});
