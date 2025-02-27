import BackButton from "@/components/Reusables/BackButton";
import { Stack } from "expo-router";
import React from "react";
import { View, Text, SafeAreaView } from "react-native";

interface Achievement {
  id: number;
  info: string;
  reward: string;
  numRequired: number;
}

const Achievements = () => {
  const achievements: Achievement[] = [
    { id: 1, info: "Complete your first daily mission", reward: "5 points", numRequired: 1 },
    { id: 2, info: "Recycle 10 items", reward: "10 points", numRequired: 10 },
    { id: 3, info: "Recycle 20 items", reward: "20 points", numRequired: 20 },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerBackVisible: false,
          headerTransparent: true,
          headerLeft: () => <BackButton />,
          headerTitle: "",
        }}
      />

      <View className="flex-1 px-4">
        <Text className="text-2xl font-bold text-gray-800 mb-4">Achievements</Text>

        {/* Achievements List */}
        {achievements.map((achievement) => {
          let currentCount = 0;
          if (achievement.id === 1) currentCount = 1;
          if (achievement.id === 2) currentCount = 7;
          if (achievement.id === 3) currentCount = 2;
          const fraction = `${currentCount}/${achievement.numRequired}`;
          const progressPercent = (currentCount / achievement.numRequired) * 100;
          
          return (
            <View
              key={achievement.id}
              className="bg-gray-100 p-4 rounded-lg mb-3 border border-gray-300"
            >
              <Text className="text-lg font-bold text-gray-700">{achievement.info}</Text>
              <Text className="text-gray-600">{achievement.reward}</Text>
              <View className="mt-3">
                <View className="relative w-full h-5 bg-gray-700 rounded">
                  {/* Use inline style only for the dynamic width */}
                  <View
                    className="absolute left-0 top-0 h-5 bg-green-500 rounded"
                    style={{ width: `${progressPercent}%` }}
                  />
                  <Text className="absolute w-full text-center text-white font-bold">
                    {fraction}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default Achievements;