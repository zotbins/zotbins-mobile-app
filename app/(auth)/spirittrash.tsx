import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { router, Stack } from 'expo-router'

const SpiritTrash = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
        <Stack.Screen
            options={{
                headerShadowVisible: false,
                headerBackVisible: false,
                headerTransparent: true,
                headerTitle: "",
            }}
        />
        <View className="flex-1 items-center justify-center">
            <Text>SpiritTrash</Text>
            <Pressable
                className="items-center justify-center py-6 px-8 rounded-md bg-tintColor mb-2 active:opacity-50"
                onPress={() => router.replace("/(auth)/(tabs)/home")}
            >
                <Text className="text-white">Home</Text>
            </Pressable>
        </View>

    </SafeAreaView>
  )
}

export default SpiritTrash
