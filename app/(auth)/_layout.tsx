import React from "react";
import { Stack } from "expo-router";
import {MapboxProvider } from "../../context/MapboxProvider"
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function Layout() {
  return (
    <MapboxProvider>
      <GestureHandlerRootView>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </GestureHandlerRootView>
    </MapboxProvider>
  );
}
