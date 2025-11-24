import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

const Forecast = () => {
  return (
    <View style={styles.container}>
      <Text>Forecast</Text>
      {/* image retrieved from: https://github.com/mrdarrengriffin/google-weather-icons */}
      <Image source={{uri:"https://raw.githubusercontent.com/mrdarrengriffin/google-weather-icons/refs/heads/main/v2/drizzle.png"}} style={styles.forecastIcon}></Image>
    </View>
  )
}

export default Forecast

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#D9D9D9',
    },
    forecastIcon: {
        width: 50,
        height: 50,
        backgroundColor: '#2868B9',
        borderRadius: 50,
    }
})