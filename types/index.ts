import { type ReactNode } from "react";

// Weather Data Types
export interface WeatherData {
  temperature: number;
  feelsLike: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  icon: string;
  sunrise: number;
  sunset: number;
}

export interface CurrentWeather {
  city: string;
  country: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  weather: WeatherData;
  timestamp: number;
}

export interface ForecastItem {
  date: string;
  timestamp: number;
  temp: {
    min: number;
    max: number;
    day: number;
    night: number;
  };
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  pop: number;
}

export interface HourlyForecast {
  timestamp: number;
  temp: number;
  condition: string;
  icon: string;
  pop: number;
}

// Location/City Types
export interface SavedLocation {
  id: string;
  city: string;
  country: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  isFavorite: boolean;
  addedAt: number;
}

// Context Types
export interface WeatherContextType {
  savedLocations: SavedLocation[];
  addLocation: (location: SavedLocation) => void;
  removeLocation: (locationId: string) => void;
  clearLocations: () => void;
  temperatureUnit: "metric" | "imperial";
  setTemperatureUnit: (unit: "metric" | "imperial") => void;
  recentSearches: string[];
  addRecentSearch: (city: string) => void;
  clearRecentSearches: () => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
}

export interface WeatherProviderProps {
  children: ReactNode;
}

// Component Props Types
export interface WeatherCardProps {
  weather: CurrentWeather;
  onPress?: () => void;
  style?: any;
}

export interface ForecastCardProps {
  forecast: ForecastItem;
  onPress?: () => void;
  temperatureUnit?: "metric" | "imperial";
}

export interface HourlyForecastCardProps {
  forecast: HourlyForecast;
  temperatureUnit?: "metric" | "imperial";
}

export interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  initialValue?: string;
}

export interface CityCardProps {
  location: SavedLocation;
  onPress?: () => void;
  onRemove?: () => void;
}

export interface UnitToggleProps {
  currentUnit: "metric" | "imperial";
  onToggle: (unit: "metric" | "imperial") => void;
}

export interface ForecastTabProps {
  activeTab: "current" | "hourly" | "daily";
  onTabChange: (tab: "current" | "hourly" | "daily") => void;
}
