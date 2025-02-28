import BackButton from "@/components/Reusables/BackButton";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, SafeAreaView } from "react-native";

import firestore, { doc, FieldValue } from "@react-native-firebase/firestore";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

interface Mission{
    id?:string;
    description: string;
    reward: string;
    status: boolean;
    progress: number;
    title: string;
    type: string;
    userStatus: boolean;
}

const Missions = () => {
    const [activeTab, setActiveTab] = useState<"Dailies" | "Weeklies">("Dailies");

    // const [missions, setMissions] = useState<Mission[]>([]);
    const [dailyMissions, setDailyMissions] = useState<Mission[]>([]);
    const [weeklyMissions, setWeeklyMissions] = useState<Mission[]>([]);
    const user = auth().currentUser;
    const getMissions = async (user: FirebaseAuthTypes.User) => {
        try{
            const querySnapshot = await firestore().collection("users").doc(user.uid).collection('missions').get();
            const allMissions : Mission[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                allMissions.push({
                    id: doc.id,
                    description: data.description,
                    reward: data.reward,
                    status: data.status,
                    progress: data.progress,
                    title: data.title,
                    type: data.type,
                    userStatus: data.userStatus,
                });
            });

            const allDailyMissions = allMissions.filter(mission => mission.type === "daily");
            const allWeeklyMissions = allMissions.filter(mission => mission.type === "weekly");

            // random shuffle and select 3 random dailies and weeklies
            const randomDailyMissions = allDailyMissions.sort(() => Math.random() - 0.5).slice(0, 3);
            const randomWeeklyMissions = allWeeklyMissions.sort(() => Math.random() - 0.5).slice(0, 3); 

            setDailyMissions(randomDailyMissions);
            setWeeklyMissions(randomWeeklyMissions);

        } catch (error) {
            console.error('Error fetching missions: ', error);
        }
    };

    useEffect(()=>{
        if (user) getMissions(user);
        else console.error("User is not logged in");
    }, []);

    // Mock Data
    // const dailyMissions = [
    //     { id: 1, title: "Recycle a water bottle", userStatus: true },
    //     { id: 2, title: "Pick up 3 pieces of litter", userStatus: false },
    //     { id: 3, title: "Use a reusable cup for coffee", userStatus: false },
    // ];

    // const weeklyMissions = [
    //     { id: 4, title: "Attend a community cleanup event", userStatus: false },
    //     { id: 5, title: "Use public transport or carpool at least once", userStatus: false },
    //     { id: 6, title: "Educate a friend about sustainable practices", userStatus: false },
    // ];

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
                    {(activeTab === "Dailies" 
                        ? dailyMissions : weeklyMissions).map((mission) => (
                            <View key={mission.id}
                                className="bg-gray-100 p-4 rounded-lg mb-3 border border-gray-300">
                            <Text className="text-gray-700 text-lg">{mission.title}</Text>
                            <Text 
                                className={`text-sm font-semibold mt-1 ${mission.userStatus ? "text-green-600" : "text-red-600"}`}>
                                {mission.userStatus ? "Completed" : "Not Completed"}
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
