import BackButton from "@/components/Reusables/BackButton";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, SafeAreaView } from "react-native";

import firestore, { doc, FieldValue } from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

interface Mission{
    id?:string;
    description: string;
    reward: string;
    status: boolean;
    title: string;
    type: string;
}

const Missions = () => {
    const [activeTab, setActiveTab] = useState<"Dailies" | "Weeklies">("Dailies");
    
    const [missions, setMissions] = useState<Mission[]>([]);
    const getMissions = async () => {
        try{
            const querySnapshot = await firestore().collection('missions').get();
            const allMissions : Mission[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                allMissions.push({
                    id: doc.id,
                    description: data.description,
                    reward: data.reward,
                    status: data.status,
                    title: data.title,
                    type: data.type,
                });
            });

            setMissions(allMissions);

        } catch (error) {
            console.error('Error fetching missions: ', error);
        }
    };

    useEffect(()=>{
        getMissions();
    }, []);

    // Mock Data
    const dailyMissions = [
        { id: 1, title: "Recycle a water bottle", completed: true },
        { id: 2, title: "Pick up 3 pieces of litter", completed: false },
        { id: 3, title: "Use a reusable cup for coffee", completed: false },
    ];

    const weeklyMissions = [
        { id: 4, title: "Attend a community cleanup event", completed: false },
        { id: 5, title: "Use public transport or carpool at least once", completed: false },
        { id: 6, title: "Educate a friend about sustainable practices", completed: false },
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
                {/* Tab Navigation */}
                <View className="flex-row mb-5">
                    <Pressable
                        className={`flex-1 p-3 items-center border-b-2 ${activeTab === "Dailies" ? "border-blue-500" : "border-gray-300"
                            }`}
                        onPress={() => setActiveTab("Dailies")}
                    >
                        <Text className="text-lg font-bold text-gray-700">Dailies</Text>
                    </Pressable>

                    <Pressable
                        className={`flex-1 p-3 items-center border-b-2 ${activeTab === "Weeklies" ? "border-blue-500" : "border-gray-300"
                            }`}
                        onPress={() => setActiveTab("Weeklies")}
                    >
                        <Text className="text-lg font-bold text-gray-700">Weeklies</Text>
                    </Pressable>
                </View>

                {/* Missions List */}
                <View className='flex-1'>
                    {missions.filter(mission => activeTab === "Dailies" 
                        ? mission.type === "daily" : mission.type === "weekly").map((mission) => (
                            <View key={mission.id}
                                className="bg-gray-100 p-4 rounded-lg mb-3 border border-gray-300">
                            <Text className="text-gray-700 text-lg">{mission.title}</Text>
                            <Text 
                                className={`text-sm font-semibold mt-1 ${mission.status ? "text-green-600" : "text-red-600"}`}>
                                {mission.status ? "Completed" : "Not Completed"}
                            </Text>
                            <Text>{mission.description}</Text>
                            <Text>Reward: {mission.reward}</Text>
                        </View>
                        ))
                    }

                </View>
            </View>
        </SafeAreaView>
    );
};

export default Missions;
