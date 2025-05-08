import React from "react";
import { Stack } from "expo-router";
import {MapboxProvider } from "../../context/MapboxProvider"
import { UserProvider } from "../../context/UserProvider";
import { AchievementsProvider } from "../../context/AchievementsContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  return (
    <UserProvider>
      <MapboxProvider>
        <AchievementsProvider>
          <GestureHandlerRootView>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </GestureHandlerRootView>
        </AchievementsProvider>
      </MapboxProvider>
    </UserProvider>
  );
}