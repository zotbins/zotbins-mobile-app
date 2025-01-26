import BackButton from "@/components/Reusables/BackButton";
import ZotBinsMap from "@/components/Map/ZotBinsMap";
import { Stack } from "expo-router";
import React from "react";
import { View } from "react-native";

const Map = () => {
  return (
    <View>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerBackVisible: false,
          headerTransparent: true,
          headerLeft: () => <BackButton />,
          headerTitle: "",
        }}
      />
      <ZotBinsMap />
    </View>
  );
};

export default Map;
