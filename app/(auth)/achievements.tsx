import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import BackButton from "@/components/Reusables/BackButton";
import AchievementsList from "@/components/Achievements/AchievementsList";

const AchievementsScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-lightBackground">
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerBackVisible: false,
          headerTransparent: true,
          headerTitle: "",
          headerLeft: () => <BackButton />,
        }}
      />

      <View className="flex-1 px-8">
        <View className="mt-24 mb-8">
          <Text className="text-5xl font-bold text-darkGreen">Achievements</Text>
        </View>
        
        <AchievementsList 
          containerStyle="pb-24" 
        />
      </View>
    </SafeAreaView>
  );
};

export default AchievementsScreen;