import { Stack, router } from "expo-router";
import React from "react";
import { Pressable, SafeAreaView, Text } from "react-native";

const Scan = () => {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Pressable
          className="bg-blue px-5 py-4 rounded-lg active:opacity-50"
          onPress={() => {
            router.push("/(auth)/camera");
          }}
        >
          <Text className="text-white">Scan Food Waste</Text>
        </Pressable>
      </SafeAreaView>
    </>
  );
};

export default Scan;
