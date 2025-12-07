import { StyleSheet, View, Text, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { fetchWeatherByCity, fetchDailyForecast, fetchHourlyForecast } from "@/api/weather-service";
import { CurrentWeather, ForecastItem, HourlyForecast } from "@/types";
import { useWeather } from "@/context/weather-context";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import WeatherHeader from "@/components/WeatherHeader";
import HourlyForecastList from "@/components/HourlyForecastList";
import WeeklyForecast from "@/components/WeeklyForecast";
import MainTemperature from "@/components/MainTemperature";
import { getWeatherIcon } from "@/utils/weatherUtils";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const { temperatureUnit, selectedCity } = useWeather();

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

  useEffect(() => {
    if (selectedCity) {
      loadWeatherData(selectedCity);
    }
  }, [selectedCity, temperatureUnit]);

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
    router.push('/search');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <WeatherHeader
          cityName={currentWeather.city}
          date={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'numeric', day: 'numeric', year: 'numeric' })}
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

        <WeeklyForecast
          forecast={forecast}
          getWeatherIcon={getWeatherIcon}
        />
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
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
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
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
});
