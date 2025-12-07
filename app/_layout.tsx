import { Stack } from "expo-router";
import { WeatherProvider } from "@/context/weather-context";

export default function RootLayout() {
  return (
    <WeatherProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </WeatherProvider>
  );
}
