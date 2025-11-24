import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const CityHeader = () => {
  return (
    <View style={styles.header}>
        {/* City name will be taken from api in the future. */}
      <Text style={styles.headerText}>Calgary</Text> 
    </View>
  )
}

export default CityHeader

const styles = StyleSheet.create({
        header: {
        width: '100%',
        padding: 20,
        backgroundColor: '#007bff',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        position: 'absolute',
        top:63,
        zIndex: 1000,
        borderTopColor: 'white',
        borderTopWidth: 1
    },
        headerText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold'
    }
})