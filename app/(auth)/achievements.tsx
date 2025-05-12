import React from "react";
import { View, Text, ScrollView } from "react-native";
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
      <ScrollView showsVerticalScrollIndicator={false}>
      <View className="px-8">
        <View className="mt-20 mb-8">
          <Text className="text-4xl font-bold text-darkGreen">Achievements</Text>
        </View>
        
        <AchievementsList 
          containerStyle="pb-24" 
        />
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AchievementsScreen;