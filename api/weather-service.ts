import { CurrentWeather, ForecastItem, HourlyForecast } from "@/types";

const BASE_URL =
  process.env.EXPO_PUBLIC_WEATHER_API_URL || "https://api.openweathermap.org/data/2.5";
const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY || "";

// Fetch current weather by city name
export const fetchWeatherByCity = async (
  city: string,
  units: "metric" | "imperial" = "metric"
): Promise<CurrentWeather | null> => {
  try {

    const url = `${BASE_URL}/weather?q=${city}&units=${units}&appid=${API_KEY}`;
    console.log("Making API request to:", url.replace(API_KEY, 'API_KEY_HIDDEN'));
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to fetch weather:", response.status, errorText);
      return null;
    }
    
    const data = await response.json();
    console.log("Fetched weather for city:", city, data);
    
    return {
      city: data.name,
      country: data.sys.country,
      coordinates: {
        lat: data.coord.lat,
        lon: data.coord.lon,
      },
      weather: {
        temperature: data.main.temp,
        feelsLike: data.main.feels_like,
        condition: data.weather[0].main,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        pressure: data.main.pressure,
        visibility: data.visibility,
        icon: data.weather[0].icon,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
      },
      timestamp: data.dt,
    };
  } catch (error) {
    console.error("Error fetching weather by city:", error);
    return null;
  }
};


export const fetchDailyForecast = async (
  city: string,
  units: "metric" | "imperial" = "metric"
): Promise<ForecastItem[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${city}&units=${units}&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      console.error("Failed to fetch forecast:", response.status);
      return [];
    }
    
    const data = await response.json();
    console.log("Fetched forecast for city:", city);
    
    // Group by day and get one forecast per day (at noon)
    const dailyForecasts: { [key: string]: any } = {};
    
    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      const hour = new Date(item.dt * 1000).getHours();
      
      // Take the forecast closest to noon
      if (!dailyForecasts[date] || Math.abs(hour - 12) < Math.abs(new Date(dailyForecasts[date].dt * 1000).getHours() - 12)) {
        dailyForecasts[date] = item;
      }
    });
    
    return Object.values(dailyForecasts).map((item: any) => ({
      date: new Date(item.dt * 1000).toLocaleDateString(),
      timestamp: item.dt,
      temp: {
        min: item.main.temp_min,
        max: item.main.temp_max,
        day: item.main.temp,
        night: item.main.temp,
      },
      condition: item.weather[0].main,
      description: item.weather[0].description,
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
      icon: item.weather[0].icon,
      pop: item.pop || 0,
    }));
  } catch (error) {
    console.error("Error fetching daily forecast:", error);
    return [];
  }
};

// Fetch hourly forecast (next 24-40 hours from 5-day/3-hour forecast)
export const fetchHourlyForecast = async (
  city: string,
  units: "metric" | "imperial" = "metric",
  limit: number = 8
): Promise<HourlyForecast[]> => {
  try {

    const response = await fetch(
      `${BASE_URL}/forecast?q=${city}&units=${units}&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      console.error("Failed to fetch hourly forecast:", response.status);
      return [];
    }
    
    const data = await response.json();
    console.log("Fetched hourly forecast for city:", city);
    
    // Take the first 'limit' items (3-hour intervals)
    return data.list.slice(0, limit).map((item: any) => ({
      timestamp: item.dt,
      temp: item.main.temp,
      condition: item.weather[0].main,
      icon: item.weather[0].icon,
      pop: item.pop || 0,
    }));
  } catch (error) {
    console.error("Error fetching hourly forecast:", error);
    return [];
  }
};

// Search cities (simplified - uses geocoding API)
export const searchCities = async (query: string): Promise<any[]> => {
  try {
    if (!query.trim()) {
      return [];
    }
    
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
    );

    
    if (!response.ok) {
      console.error("Failed to search cities:", response.status);
      return [];
    }
    
    const data = await response.json();
    console.log("Search results for:", query, data);
    
    return data.map((item: any) => ({
      name: item.name,
      country: item.country,
      state: item.state,
      lat: item.lat,
      lon: item.lon,
    }));
  } catch (error) {
    console.error("Error searching cities:", error);
    return [];
  }
};

// Get weather icon URL
export const getWeatherIconUrl = (icon: string): string => {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
};
