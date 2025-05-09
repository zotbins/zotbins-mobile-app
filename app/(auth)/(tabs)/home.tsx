import { View, Text, Pressable, Button, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { Link, Stack } from "expo-router";
import Header from "@/components/Reusables/Header";
import { getAuth } from "@react-native-firebase/auth";
import { useUserContext } from "@/context/UserProvider";
import { LinearGradient } from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import ScanWidget from "@/components/Home/ScanWidget";
import DailyQuizWidget from "@/components/Home/DailyQuizWidget";
import MissionsWidget from "@/components/Home/MissionsWidget";
import QuizData from "@/data/QuizData";
import EnvImpactPreview from "@/components/Reusables/EnvImpactPreview";
import StreakPopup from "@/components/Home/StreakPopup";
import { doc, getFirestore, updateDoc } from "@react-native-firebase/firestore";

const Home = () => {
  const { userDoc } = useUserContext();
  const [showStreakPopup, setShowStreakPopup] = useState(false);
  const [showRestorePopup, setShowRestorePopup] = useState(false);

  useEffect(() => {
    checkStreakStatus();
  }, [userDoc]);

  const checkStreakStatus = () => {
    if (!userDoc) return;

    const lastUpdate = userDoc.lastStreakUpdate;
    const now = Date.now();
    const hoursSinceLastUpdate = (now - lastUpdate) / (1000 * 60 * 60);

    if (hoursSinceLastUpdate > 24) {
      // Show restore popup if user has restores available
      if (userDoc.restoresLeft > 0) {
        setShowRestorePopup(true);
      } else {
        // Reset streak if no restores available
        resetStreak();
      }
    }
  };

  const handleRestore = async () => {
    if (!userDoc) return;
    // Update user doc with restored streak and decrease restores
    try {
      const userRef = doc(getFirestore(), "users", userDoc.uid);
      await updateDoc(userRef, {
        lastStreakUpdate: Date.now(),
        restoresLeft: userDoc.restoresLeft - 1,
      });
      setShowRestorePopup(false);
    } catch (error) {
      console.error("Error restoring streak:", error);
    }
  };

  const resetStreak = async () => {
    if (!userDoc) return;
    try {
      const userRef = doc(getFirestore(), "users", userDoc.uid);
      await updateDoc(userRef, {
        dailyStreak: 0,
        lastStreakUpdate: Date.now(),
      });
    } catch (error) {
      console.error("Error resetting streak:", error);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <StreakPopup
        visible={showStreakPopup}
        onClose={() => setShowStreakPopup(false)}
        streakCount={userDoc?.dailyStreak || 0}
        type="streak"
      />

      <StreakPopup
        visible={showRestorePopup}
        onClose={() => {
          setShowRestorePopup(false);
          resetStreak();
        }}
        streakCount={userDoc?.dailyStreak || 0}
        type="restore"
        onRestore={handleRestore}
        restoresLeft={userDoc?.restoresLeft || 0}
      />

      <LinearGradient colors={["#F5FFF5", "#DBFFD8"]} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 45 }}
          showsVerticalScrollIndicator={false}
        >
          <SafeAreaView className="flex-1 px-5 gap-2 pb-24">
            <Header username={userDoc?.username || "User"} />

            <EnvImpactPreview />
            <ScanWidget scans={3 - userDoc?.dailyScans || 0} />
            <DailyQuizWidget />

            <MissionsWidget />
          </SafeAreaView>
        </ScrollView>
      </LinearGradient>
    </>
  );
};

export default Home;
