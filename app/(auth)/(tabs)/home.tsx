import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, Stack } from "expo-router";
import Header from "@/components/Reusables/Header";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { updateAchievementProgress } from "@/functions/src/updateProgress";

async function populateMissions(uid: string) {
  const missionsRef = firestore().collection("missions");
  const userMissionsRef = firestore().collection("users").doc(uid).collection("missions");

  const missionsSnapshot = await missionsRef.where("status", "==", true).get();

  const batch = firestore().batch();
  missionsSnapshot.forEach((doc) => {
    const userMissionRef = userMissionsRef.doc(doc.id);
    batch.set(userMissionRef, {
      ...doc.data(),
      id: doc.id,
      progress: 0,
      userStatus: false,
      assignedAt: firestore.FieldValue.serverTimestamp(),
    });
  });

  await batch.commit();
}

const Home = () => {
  const user = auth().currentUser;

  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  //checking streak within home in case we want a modal to pop up
  const updateLoginStreak = async (uid: any) => {
    if (!uid) return;

    const userDoc = firestore().collection("users").doc(uid);
    const userData = (await userDoc.get()).data();
    if (!userData) return;

    const { dailyStreak, lastLoginUpdate, xp, level } = userData;

    const now = new Date();
    const lastLoginUpdateDate = new Date(lastLoginUpdate);

    const timeDiff = now.getTime() - lastLoginUpdateDate.getTime();

    const hoursDiff = timeDiff / (1000 * 3600);

    if (hoursDiff >= 24 && hoursDiff < 48) {
      // Update data including new missions
      await populateMissions(uid);
      const updatePayload: any = {
        dailyScans: 0,
        lastLoginUpdate: now.getTime(),
        xp: firestore.FieldValue.increment(5),
      };

      await userDoc.update(updatePayload);
      setStreak(dailyStreak);

      console.log("increment streak");
    } else if (hoursDiff >= 48) {
      // adds new missions
      await populateMissions(uid);
      // reset dailystreak
      await userDoc.update({
        dailyStreak: 0,
        dailyScans: 0,
        lastLoginUpdate: now.getTime(),
        xp: firestore.FieldValue.increment(5)
      });
      setStreak(0);
      console.log("reset streak");
    } else {
      setStreak(dailyStreak);
      console.log("no streak update");
    }

    const requiredXPforNextLevel = 50 * (level);
    if (xp >= requiredXPforNextLevel) {
      const newXP = xp - requiredXPforNextLevel;
      const newLevel = level + 1;
      await userDoc.update({
        level: firestore.FieldValue.increment(1),
        xp: newXP,
      });
      setLevel(newLevel);
      updateAchievementProgress("level", 1);
    }
  };

  useEffect(() => {
    if (user) {
      updateLoginStreak(user.uid);
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
