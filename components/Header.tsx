import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const Header = ({title}: {title: string}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
    header: {
        width: '100%',
        padding: 20,
        backgroundColor: '#007bff',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        zIndex: 1000
    },
    headerText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold'
    }
})