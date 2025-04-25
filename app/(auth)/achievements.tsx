import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import BackButton from "@/components/Reusables/BackButton";
import AchievementsList from "@/components/Achievements/AchievementsList";

const AchievementsScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-lightBackground">
      <Stack.Screen
        options={{
          headerShown: true,
          headerLeft: () => <BackButton />,
          headerTitle: "Achievements",
        }}
      />
      <AchievementsList />
    </SafeAreaView>
  );
};

export default AchievementsScreen;