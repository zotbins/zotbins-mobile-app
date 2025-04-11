import BackButton from "@/components/Reusables/BackButton";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getFirestore,
  doc,
  FieldValue,
  collection,
  getDocs,
} from "@react-native-firebase/firestore";
import { getAuth, FirebaseAuthTypes } from "@react-native-firebase/auth";
import AchievementIcon from "@/components/Profile/achievementImagePlaceholder.png";

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
  const user = getAuth().currentUser;
  useEffect(() => {
    if (user) {
      const fetchAchievements = async (user: FirebaseAuthTypes.User) => {
        try {
          const db = getFirestore();
          const userRef = doc(db, "users", user.uid);
          const achievementsRef = collection(userRef, "achievements");
          const querySnapshot = await getDocs(achievementsRef);
          const achievementsData: Achievement[] = querySnapshot.docs.map(
            (document) => {
              const data = document.data();
              return {
                id: data.id,
                name: data.name,
                description: data.description,
                reward: data.reward,
                actionAmount: data.actionAmount,
                progress: data.progress,
              };
            }
          );

          setAchievements(achievementsData);
        } catch (error) {
          console.error("Error fetching achievements:", error);
        }
      };
      fetchAchievements(user);
    } else {
      console.error("User is not logged in");
    }
  }, []);

  return (
    <View className="flex-1 justify-center items-center">
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerBackVisible: false,
          headerTransparent: true,
          headerLeft: () => <BackButton />,
          headerTitle: "",
        }}
      />

      <View className="flex-1 px-4 w-full">
        {/* Achievements List */}
        {achievements.map((achievement) => {
          const fraction = `${achievement.progress}/${achievement.actionAmount}`;
          const progressPercent =
            (achievement.progress / achievement.actionAmount) * 100;

          return (
            <View
              key={achievement.id}
              className="bg-lightBackground p-4 rounded-[35] mb-3 border border-gray-300 flex flex-row"
            >
              <View>
                <Image source={AchievementIcon} alt="" />
              </View>
              <View>
                <Text className="text-lg font-bold text-gray-700">
                  {achievement.name}
                </Text>
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
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default Achievements;
