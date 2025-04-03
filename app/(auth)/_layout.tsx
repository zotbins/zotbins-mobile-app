import React from "react";
import { Stack } from "expo-router";
import {MapboxProvider } from "../../context/MapboxProvider"
export default function Layout() {
  return (
    <MapboxProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </MapboxProvider>
  );
}
