import CityHeader from "@/components/CityHeader";
import { StyleSheet, View } from "react-native";
import Header from "../components/Header";

export default function Index() {
  return (
    <View
      style={styles.container}
    >
      <Header title="Weather App"/>
      <CityHeader />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center", 
    backgroundColor: "#007bff",
  }
});
