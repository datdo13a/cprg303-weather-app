import { fetchWeatherByCity, searchCities } from "@/api/weather-service";
import EmptyState from "@/components/EmptyState";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import RecentSearchList from "@/components/RecentSearchList";
import SearchBar from "@/components/SearchBar";
import { useWeather } from "@/context/weather-context";
import { SHADOW_NONE, SHADOW_STYLE } from "@/utils/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface SearchResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export default function Search() {
  const router = useRouter();
  const {
    addRecentSearch,
    recentSearches,
    addLocation,
    temperatureUnit,
    clearRecentSearches,
  } = useWeather();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setHasSearched(true);
      const results = await searchCities(searchQuery);
      setSearchResults(results || []);
    } catch (error) {
      console.error("Error searching cities:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCity = async (city: SearchResult) => {
    try {
      addRecentSearch(city.name);

      // Fetch weather data for the selected city
      const weather = await fetchWeatherByCity(city.name, temperatureUnit);

      if (weather) {
        // Save to saved locations
        addLocation({
          id: `${city.lat}-${city.lon}`,
          city: city.name,
          country: city.country,
          coordinates: {
            lat: city.lat,
            lon: city.lon,
          },
          isFavorite: false,
          addedAt: Date.now(),
        });

        // Navigate to cities page to show the added city
        router.push("/cities");
      }
    } catch (error) {
      console.error("Error selecting city:", error);
    }
  };

  return (
    <LinearGradient
      colors={["#3D4E81", "#5753C9", "#6E7FF3"]}
      locations={[0, 0.48, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search City</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmit={handleSearch}
          onClear={() => setSearchQuery("")}
        />
        <TouchableOpacity
          style={[
            styles.searchButton,
            !searchQuery.trim() && styles.searchButtonDisabled,
          ]}
          onPress={handleSearch}
          disabled={!searchQuery.trim()}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Searches */}
      {!hasSearched && (
        <RecentSearchList
          searches={recentSearches}
          onSelectSearch={(search) => {
            setSearchQuery(search);
            handleSearch();
          }}
          onClear={clearRecentSearches}
        />
      )}
      {!hasSearched && recentSearches.length === 0 && (
        <EmptyState
          icon="search-outline"
          message="Search for a city to get started."
        />
      )}

      {/* Search Results */}
      {loading ? (
        <LoadingScreen />
      ) : hasSearched ? (
        <ScrollView style={styles.resultsContainer}>
          {searchResults.length === 0 ? (
            <EmptyState
              icon="search-outline"
              message="No cities found. Try searching with a different name."
            />
          ) : (
            <>
              {searchResults.map((result, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.resultItem}
                  onPress={() => handleSelectCity(result)}
                >
                  <View style={styles.resultLeft}>
                    <Ionicons name="location" size={24} color="#fff" />
                    <View>
                      <Text style={styles.resultName}>{result.name}</Text>
                      <Text style={styles.resultLocation}>
                        {result.state ? `${result.state}, ` : ""}
                        {result.country}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="add-circle-outline" size={24} color="#fff" />
                </TouchableOpacity>
              ))}
            </>
          )}
        </ScrollView>
      ) : null}

      <Footer />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 20,
    width: "90%",
    maxWidth: 400,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
    width: "90%",
    maxWidth: 400,
  },
  searchButton: {
    backgroundColor: "rgba(255, 255, 255, 0.35)",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    ...SHADOW_STYLE,
  },
  searchButtonDisabled: {
    backgroundColor: "rgba(128, 128, 128, 0.3)",
    ...SHADOW_NONE,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 24,
    alignSelf: "center",
    width: "90%",
    maxWidth: 400,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...SHADOW_STYLE,
  },
  resultLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  resultName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  resultLocation: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.8,
    marginTop: 2,
  },
});
