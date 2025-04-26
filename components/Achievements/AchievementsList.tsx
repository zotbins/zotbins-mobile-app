import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useAchievements } from "@/context/AchievementsContext";
import Achievement from "./AchievementWidget";

interface AchievementsListProps {
  limit?: number;
  containerStyle?: string;
}

const AchievementsList = ({ 
  limit, 
  containerStyle = "flex-1 pb-24" 
}: AchievementsListProps) => {
  const { achievements, loading, error } = useAchievements();

  if (loading) {
    return (
      <View className="items-center justify-center py-8">
        <ActivityIndicator color="#018029" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="items-center justify-center py-8">
        <Text className="text-darkGreen">{error}</Text>
      </View>
    );
  }

  // Use limit if provided
  const displayAchievements = limit ? achievements.slice(0, limit) : achievements;

  return (
    <View className={containerStyle}>
      {/* Achievements List */}
      {displayAchievements.map((achievement) => (
        <Achievement 
          key={achievement.id} 
          achievement={achievement} 
        />
      ))}
    </View>
  );
};

export default AchievementsList;