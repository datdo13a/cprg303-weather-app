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
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(
    null
  );
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const { temperatureUnit, selectedCity } = useWeather();

  const loadWeatherData = async (city: string) => {
    try {
      setLoading(true);
      const weather = await fetchWeatherByCity(city, temperatureUnit);
      const forecastData = await fetchDailyForecast(city, temperatureUnit);
      const hourlyData = await fetchHourlyForecast(city, temperatureUnit, 6);

      console.log("Weather data:", weather);
      console.log("Hourly forecast data:", hourlyData);

      if (weather) setCurrentWeather(weather);
      if (forecastData) setForecast(forecastData);
      if (hourlyData && hourlyData.length > 0) {
        setHourlyForecast(hourlyData);
        console.log("Hourly forecast set:", hourlyData);
      }
    } catch (error) {
      console.error("Error loading weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherData(selectedCity);
  }, [selectedCity]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!currentWeather) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>No weather data available</Text>
        <Text style={styles.date}>Check your API key or try again later</Text>
      </View>
    );
  }

  const handleSearchPress = () => {
    router.push("/search");
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#a1c4fd", "#c2e9fb"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
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
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
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
