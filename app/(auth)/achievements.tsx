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
import LinearGradient from "react-native-linear-gradient";

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
    <View className="flex-1 px-4 w-full pb-24">
      {/* Achievements List */}
      {achievements.map((achievement) => {
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

export default Achievements;
