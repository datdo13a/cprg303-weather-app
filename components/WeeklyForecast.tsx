import { ForecastItem } from "@/types";
import { StyleSheet, Text, View } from "react-native";

interface WeeklyForecastProps {
  forecast: ForecastItem[];
  getWeatherIcon: (condition: string) => string;
}

export default function WeeklyForecast({
  forecast,
  getWeatherIcon,
}: WeeklyForecastProps) {
  const formatDay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  return (
    <View style={styles.weeklyContainer}>
      {forecast.slice(0, 7).map((item, index) => (
        <View key={index} style={styles.weeklyItem}>
          <View style={styles.weeklyLeft}>
            <Text style={styles.weeklyIcon}>
              {getWeatherIcon(item.condition)}
            </Text>
            <Text style={styles.weeklyDay}>{formatDay(item.date)}</Text>
          </View>
          <View style={styles.weeklyTempContainer}>
            <Text style={styles.weeklyTemp}>
              H: {Math.round(item.temp.max)}°
            </Text>
            <Text style={styles.weeklyTemp}>
              L: {Math.round(item.temp.min)}°
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  weeklyContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 16,
    width: "90%",
    maxWidth: 400,
    alignSelf: "center",
  },
  weeklyItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    gap: 25,
  },
  weeklyLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  weeklyIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  weeklyDay: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  weeklyTempContainer: {
    flexDirection: "row",
    gap: 12,
  },
  weeklyTemp: {
    color: "#fff",
    fontSize: 14,
    minWidth: 45,
    fontWeight: "bold",
  },
});
