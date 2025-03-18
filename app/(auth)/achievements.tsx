import BackButton from "@/components/Reusables/BackButton";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView } from "react-native";
import firestore, { doc, FieldValue } from "@react-native-firebase/firestore";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

interface Achievement {
    id: number;
    name: string;
    description: string;
    reward: string;
    actionAmount: number;
    progress: number;
}


const Achievements = () => {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const user = auth().currentUser;
    useEffect(() => {
        if (user) {
            const fetchAchievements = async (user: FirebaseAuthTypes.User) => {
                try {
                    const querySnapshot = await firestore().collection("users").doc(user.uid).collection("achievements").get();
                    const achievementsData: Achievement[] = querySnapshot.docs.map((doc) => {
                        const data = doc.data();
                        return {
                            id: data.id,
                            name: data.name,
                            description: data.description,
                            reward: data.reward,
                            actionAmount: data.actionAmount,
                            progress: data.progress,
                        };
                    });

                    setAchievements(achievementsData);

                } catch (error) {
                    console.error("Error fetching achievements:", error);
                }
            }
            fetchAchievements(user);
        } else {
            console.error("User is not logged in");
        }
    }, []);

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
                    const fraction = `${achievement.progress}/${achievement.actionAmount}`;
                    const progressPercent = (achievement.progress / achievement.actionAmount) * 100;

                    return (
                        <View
                            key={achievement.id}
                            className="bg-gray-100 p-4 rounded-lg mb-3 border border-gray-300"
                        >
                            <Text className="text-lg font-bold text-gray-700">{achievement.name}</Text>
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