import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const SpiritTrash = () => {
  return (
    <View>
        <Stack.Screen
            options={{
                headerShadowVisible: false,
                headerBackVisible: false,
                headerTransparent: true,
                headerTitle: "",
            }}
        />
      <Text>SpiritTrash</Text>
    </View>
  )
}

export default SpiritTrash
