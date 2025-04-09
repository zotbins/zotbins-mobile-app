import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, Stack } from "expo-router";
import Header from "@/components/Reusables/Header";
import { getFirestore, writeBatch, getDoc, getDocs, doc, collection, query, where, increment, updateDoc, serverTimestamp } from "@react-native-firebase/firestore";
import { getAuth } from "@react-native-firebase/auth";
import { updateAchievementProgress } from "@/functions/src/updateProgress";
import { LinearGradient } from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import ScanWidget from "@/components/Home/ScanWidget";
import DailyQuizWidget from "@/components/Home/DailyQuizWidget";

async function populateMissions(uid: string) {
  const db = getFirestore();
  const missionsRef = collection(db, "missions");
  const userMissionsRef = collection(db, "users", uid, "missions");
  const q = query(missionsRef, where('status', '==', true));
  const missionsSnapshot = await getDocs(q);

  const batch = writeBatch(db);
  const now = new Date();
  missionsSnapshot.forEach((document) => {
    const userMissionRef = doc(userMissionsRef, document.id);
    batch.set(userMissionRef, {
      ...document.data(),
      id: document.id,
      progress: 0,
      userStatus: false,
      assignedAt: now.getTime(),
    });
  });

  await batch.commit();
}

const Home = () => {
  const user = getAuth().currentUser;

  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [scans, setScans] = useState(3); // Assuming you want to set the initial scans to 5
  //checking streak within home in case we want a modal to pop up
  const updateLoginStreak = async (uid: any) => {
    if (!uid) return;

    const db = getFirestore();
    const userRef = doc(db, "users", uid);
    const userSnapshot = await getDoc(userRef);
    if (!userSnapshot.exists) return;
    const userData = userSnapshot.data();

    const dailyStreak = userData?.dailyStreak || 0;
    const lastLoginUpdate = userData?.lastLoginUpdate || Date.now();
    const xp = userData?.xp || 0;
    const level = userData?.level || 1;

    const now = new Date();
    const lastLoginUpdateDate = new Date(lastLoginUpdate);

    const timeDiff = now.getTime() - lastLoginUpdateDate.getTime();

    const hoursDiff = timeDiff / (1000 * 3600);

    const dailyScans = userData?.dailyScans || 0;
    setScans(3 - dailyScans);

    if (hoursDiff >= 24 && hoursDiff < 48) {
      // Update data including new missions
      await populateMissions(uid);
      const updatePayload: any = {
        dailyScans: 0,
        lastLoginUpdate: now.getTime(),
        xp: increment(5),
      };

      await updateDoc(userRef, updatePayload);
      setStreak(dailyStreak);

      console.log("increment streak");
    } else if (hoursDiff >= 48) {
      // adds new missions
      await populateMissions(uid);
      // reset dailystreak
      await updateDoc(userRef,{
        dailyStreak: 0,
        dailyScans: 0,
        lastLoginUpdate: now.getTime(),
        xp: increment(5)
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
      await updateDoc(userRef,{
        level: increment(1),
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
          headerShown: false,
        }}
       />

      <LinearGradient
        colors={["#F5FFF5", "#DBFFD8"]}
        style={{ flex: 1 }}
      >
        <SafeAreaView className="flex-1 px-7">
          <Header streak={streak} />
          <ScanWidget scans={scans} />
          <DailyQuizWidget />

            <Link href="/missions" asChild>
              <Pressable className="items-center justify-center py-6 px-8 rounded-md bg-tintColor mb-2 active:opacity-50">
                <Text className="text-white">Missions</Text>
              </Pressable>
            </Link>

        </SafeAreaView>
      </LinearGradient>
    </>
  );
};

export default Home;
