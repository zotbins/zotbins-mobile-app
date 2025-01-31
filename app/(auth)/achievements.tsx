import BackButton from "@/components/Reusables/BackButton";
import { Stack } from "expo-router";
import React from "react";
import { View, Text, SafeAreaView } from "react-native";

const Achievements = () => {
    const achievements = [
        { id: 1, title: "Eco Warrior", description: "Completed 10 daily missions" },
        { id: 2, title: "Sustainability Champion", description: "Recycled 50 items" },
        { id: 3, title: "Community Helper", description: "Participated in a cleanup event" },
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
                {achievements.map((achievement) => (
                    <View
                        key={achievement.id}
                        className="bg-gray-100 p-4 rounded-lg mb-3 border border-gray-300"
                    >
                        <Text className="text-lg font-bold text-gray-700">{achievement.title}</Text>
                        <Text className="text-gray-600">{achievement.description}</Text>
                    </View>
                ))}
            </View>
        </SafeAreaView>
    );
};

export default Achievements;
