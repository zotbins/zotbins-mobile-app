import React from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";
import AchievementIcon from "@/components/Profile/achievementImagePlaceholder.png";
import LinearGradient from "react-native-linear-gradient";
import { useAchievements } from "@/context/AchievementsContext";

interface AchievementsListProps {
    limit?: number;
    containerStyle?: string;
}

const AchievementsList = ({ limit, containerStyle = "flex-1 px-4 w-full pb-24" }: AchievementsListProps) => {
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
            {displayAchievements.map((achievement) => {
                const fraction = `${achievement.progress}/${achievement.actionAmount}`;
                const progressPercent =
                    (achievement.progress / achievement.actionAmount) * 100;

                return (
                    <View key={achievement.id} className="mb-3 shadow-sm">
                        {/* Gradient Border Container */}
                        <LinearGradient
                            colors={["#018029", "#DFFFE3", "#b4fabd", "#004c18"]}
                            style={{
                                padding: 1.3,
                                borderRadius: 35,
                            }}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="mb-4 shadow-lg"
                            locations={[0.1, 0.5, 0.8, 1]}
                        >
                            {/* Achievement Content */}
                            <View className="bg-lightBackground p-4 rounded-[33] flex flex-row items-center">
                                <View>
                                    <Image source={AchievementIcon} alt="" />
                                </View>
                                <View className="ml-4 flex-1">
                                    <Text className="text-xl font-semibold text-darkestGreen">
                                        {achievement.name}
                                    </Text>
                                    <Text className="text-darkGreen">{achievement.reward}</Text>
                                    <View className="mt-3">
                                        <View className="relative w-full h-5 bg-darkGreen rounded-full">
                                            {/* Use inline style only for the dynamic width */}
                                            <View
                                                className="absolute left-0 top-0 h-5 bg-green-500 rounded-full"
                                                style={{ width: `${progressPercent}%` }}
                                            />
                                            <Text className="absolute w-full text-center text-white font-bold">
                                                {fraction}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>
                );
            })}
        </View>
    );
};

export default AchievementsList;