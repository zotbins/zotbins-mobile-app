import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, Stack } from "expo-router";
import Header from "@/components/Reusables/Header";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

const Home = () => {
  const user = auth().currentUser;

  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  //checking streak within home in case we want a modal to pop up
  const updateStreak = async (uid: any) => {
    if (!uid) return;

    const userDoc = firestore().collection("users").doc(uid);
    const userData = (await userDoc.get()).data();
    if (!userData) return;

    const { dailyStreak, lastStreakUpdate, xp, level } = userData;

    const now = new Date();
    const lastStreakUpdateDate = new Date(lastStreakUpdate);

    const timeDiff = now.getTime() - lastStreakUpdateDate.getTime();

    const hoursDiff = timeDiff / (1000 * 3600);

    if (hoursDiff >= 24 && hoursDiff < 48) {
      // increment dailystreak
      await userDoc.update({
        dailyStreak: dailyStreak + 1,
        lastStreakUpdate: now.getTime(),
        xp: firestore.FieldValue.increment(5)
      });
      setStreak(dailyStreak + 1);
      console.log("increment streak");
    } else if (hoursDiff >= 48) {
      // reset dailystreak
      await userDoc.update({
        dailyStreak: 0,
        lastStreakUpdate: now.getTime(),
        xp: firestore.FieldValue.increment(5)
      });
      setStreak(0);
      console.log("reset streak");
    } else {
      setStreak(dailyStreak);
      console.log("no streak update");
    }

    const requiredXPforNextLevel = 50 * (level + 1);
    if (xp >= requiredXPforNextLevel) {
      const newLevel = level + 1;
      await userDoc.update({
        level: newLevel
      });
      setLevel(newLevel);
    }
  };

  useEffect(() => {
    if (user) {
      updateStreak(user.uid);
    }
  }, [user]);

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <Header streak={streak} />,
        }}
      />

      <View className="flex-1 bg-white px-5 py-12">
        <Link href="/quiz" asChild>
          <Pressable className="items-center justify-center py-6 px-8 rounded-md bg-tintColor mb-2 active:opacity-50">
            <Text className="text-white">Daily Quiz</Text>
          </Pressable>
        </Link>
        <Link href="/leaderboard" asChild>
          <Pressable className="items-center justify-center py-6 px-8 rounded-md bg-tintColor mb-2 active:opacity-50">
            <Text className="text-white">Leaderboard</Text>
          </Pressable>
        </Link>
        <Link href="/map" asChild>
          <Pressable className="items-center justify-center py-6 px-8 rounded-md bg-tintColor mb-2 active:opacity-50">
            <Text className="text-white">Map</Text>
          </Pressable>
        </Link>
        <Link href="/missions" asChild>
          <Pressable className="items-center justify-center py-6 px-8 rounded-md bg-tintColor mb-2 active:opacity-50">
            <Text className="text-white">Missions</Text>
          </Pressable>
        </Link>
      </View>
    </>
  );
};

export default Home;
