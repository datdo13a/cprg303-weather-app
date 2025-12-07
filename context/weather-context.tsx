import {
  WeatherContextType,
  WeatherProviderProps,
  SavedLocation,
} from "@/types";
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create the Weather Context
const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEYS = {
  SAVED_LOCATIONS: "weather_saved_locations",
  TEMPERATURE_UNIT: "weather_temperature_unit",
  RECENT_SEARCHES: "weather_recent_searches",
  SELECTED_CITY: "weather_selected_city",
};

// Create the Provider component
export const WeatherProvider = ({ children }: WeatherProviderProps) => {
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [temperatureUnit, setTemperatureUnitState] = useState<"metric" | "imperial">("metric");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedCity, setSelectedCityState] = useState<string>("Calgary");
  const [isLoading, setIsLoading] = useState(true);

  // Load saved data from AsyncStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load saved locations
        const locationsData = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_LOCATIONS);
        if (locationsData) {
          setSavedLocations(JSON.parse(locationsData));
        }

        // Load temperature unit preference
        const unitData = await AsyncStorage.getItem(STORAGE_KEYS.TEMPERATURE_UNIT);
        if (unitData) {
          setTemperatureUnitState(unitData as "metric" | "imperial");
        }

        // Load recent searches
        const searchesData = await AsyncStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
        if (searchesData) {
          setRecentSearches(JSON.parse(searchesData));
        }

        // Load selected city - this should be loaded last to ensure it overrides the default
        const selectedCityData = await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_CITY);
        if (selectedCityData) {
          setSelectedCityState(selectedCityData);
        }
      } catch (error) {
        console.error("Error loading weather data from storage:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Save saved locations to AsyncStorage whenever they change
  useEffect(() => {
    const saveLocations = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEYS.SAVED_LOCATIONS,
          JSON.stringify(savedLocations)
        );
      } catch (error) {
        console.error("Error saving locations to storage:", error);
      }
    };
    if (savedLocations.length > 0) {
      saveLocations();
    }
  }, [savedLocations]);

  // Save temperature unit to AsyncStorage whenever it changes
  useEffect(() => {
    const saveUnit = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.TEMPERATURE_UNIT, temperatureUnit);
      } catch (error) {
        console.error("Error saving temperature unit to storage:", error);
      }
    };
    saveUnit();
  }, [temperatureUnit]);

  // Save recent searches to AsyncStorage whenever they change
  useEffect(() => {
    const saveSearches = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEYS.RECENT_SEARCHES,
          JSON.stringify(recentSearches)
        );
      } catch (error) {
        console.error("Error saving recent searches to storage:", error);
      }
    };
    if (recentSearches.length > 0) {
      saveSearches();
    }
  }, [recentSearches]);

  // Save selected city to AsyncStorage whenever it changes
  useEffect(() => {
    const saveSelectedCity = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_CITY, selectedCity);
      } catch (error) {
        console.error("Error saving selected city to storage:", error);
      }
    };
    saveSelectedCity();
  }, [selectedCity]);

  // Add a new location
  const addLocation = (location: SavedLocation) => {
    setSavedLocations((prevLocations) => {
      const existingLocation = prevLocations.find(
        (loc) => loc.id === location.id
      );

      if (existingLocation) {
        // Update existing location
        return prevLocations.map((loc) =>
          loc.id === location.id ? location : loc
        );
      } else {
        // Add new location
        return [...prevLocations, location];
      }
    });
  };

  // Remove a location
  const removeLocation = (locationId: string) => {
    setSavedLocations((prevLocations) =>
      prevLocations.filter((loc) => loc.id !== locationId)
    );
  };

  // Clear all locations
  const clearLocations = () => {
    setSavedLocations([]);
  };

  // Set temperature unit
  const setTemperatureUnit = (unit: "metric" | "imperial") => {
    setTemperatureUnitState(unit);
  };

  // Add to recent searches (max 10)
  const addRecentSearch = (city: string) => {
    setRecentSearches((prevSearches) => {
      const filtered = prevSearches.filter((search) => search !== city);
      const updated = [city, ...filtered].slice(0, 10);
      return updated;
    });
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  // Set selected city
  const setSelectedCity = (city: string) => {
    setSelectedCityState(city);
  };

  const value: WeatherContextType = {
    savedLocations,
    addLocation,
    removeLocation,
    clearLocations,
    temperatureUnit,
    setTemperatureUnit,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    selectedCity,
    setSelectedCity,
  };

  return (
    <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
  );
};

// Custom hook to use the Weather Context
export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return context;
};
