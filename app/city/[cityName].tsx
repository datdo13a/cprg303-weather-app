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
import { LinearGradient } from "expo-linear-gradient";
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
      <LinearGradient
        colors={["#e0c3fc", "#8ec5fc"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.container}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.cityTempContainer}>
            <WeatherHeader
              cityName={currentWeather.city}
              date={new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "numeric",
                day: "numeric",
                year: "numeric",
              })}
            />

            <MainTemperature
              temperature={currentWeather.weather.temperature}
              condition={currentWeather.weather.condition}
              temperatureUnit={temperatureUnit}
            />
          </View>

          <HourlyForecastList
            hourlyData={hourlyForecast}
            temperatureUnit={temperatureUnit}
            getWeatherIcon={getWeatherIcon}
          />

          <WeeklyForecast forecast={forecast} getWeatherIcon={getWeatherIcon} />
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
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    marginVertical: 10,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  cityTempContainer: {
    alignItems: "center",
    width: "100%",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 8,
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
