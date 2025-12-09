import { StyleSheet, Text, View } from "react-native";

interface WeatherHeaderProps {
  cityName: string;
  date?: string;
}

export default function WeatherHeader({ cityName, date }: WeatherHeaderProps) {
  const displayDate =
    date ||
    new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });

  return (
    <View style={styles.header}>
      <Text style={styles.cityName}>{cityName}</Text>
      <Text style={styles.date}>{displayDate}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 100,
    paddingHorizontal: 24,

    alignItems: "center",
  },
  cityName: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "400",
    textAlign: "center",
  },
  date: {
    color: "#fff",
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
  },
});
