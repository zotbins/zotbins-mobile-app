import { Stack, router } from "expo-router";
import React, { useState } from "react";
import { Pressable, SafeAreaView, Text } from "react-native";
import ScanResults from "@/components/Scan/ScanResults";
import TestImage from "@/assets/images/test-image";
import ScanLimitModal from "@/components/Scan/ScanLimitModal";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  increment,
} from "@react-native-firebase/firestore";
import { getAuth, FirebaseAuthTypes } from "@react-native-firebase/auth";
import StreakPopup from "@/components/Home/StreakPopup";
import { useUserContext } from "@/context/UserProvider";

const Scan = () => {
  const [image, setImage] = useState<string | null>(TestImage);

  const [showScanResults, setShowScanResults] = useState<boolean>(false);
  const [showScanLimitModal, setShowScanLimitModal] = useState<boolean>(false);
  const user = getAuth().currentUser;
  const [showStreakPopup, setShowStreakPopup] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const { userDoc } = useUserContext();
  const [showRestorePopup, setShowRestorePopup] = useState(false);

  const getDailyScanCount = async (user: FirebaseAuthTypes.User) => {
    try {
      const db = getFirestore();
      const userRef = doc(db, "users", user.uid);
      const docSnapshot = await getDoc(userRef);

      if (docSnapshot.exists) {
        const userData = docSnapshot.data();
        return userData?.dailyScans || 0;
      } else {
        return 0;
      }
    } catch (error) {
      console.error("Error getting daily scans:", error);
      return 0;
    }
  };

  const handleSuccessfulScan = async () => {
    if (!user) return;

    try {
      const db = getFirestore();
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists) return;

      const userData = userDoc.data();
      const lastUpdate = userData?.lastStreakUpdate ?? Date.now();
      const now = Date.now();
      const hoursSinceLastUpdate = (now - lastUpdate) / (1000 * 60 * 60);

      // Check if this is the first scan of a new day
      const isNewDay = hoursSinceLastUpdate > 24;
      const updatedStreak = isNewDay
        ? (userData?.dailyStreak ?? 0) + 1
        : userData?.dailyStreak ?? 0;

      // Update user document
      await updateDoc(userRef, {
        dailyScans: increment(1),
        totalScans: increment(1),
        lastStreakUpdate: now,
        dailyStreak: updatedStreak,
        ...(isNewDay && { xp: increment(10) }), // Award XP for maintaining streak
      });

      // Show streak popup if this is the first scan of the day
      if (isNewDay) {
        setCurrentStreak(updatedStreak);
        setShowStreakPopup(true);
      }
    } catch (error) {
      console.error("Error updating scan data:", error);
    }
  };

  // handles the scan button press
  const handleScan = async () => {
    if (!user) return;
    // Get the daily scan count
    const dailyScanCount = await getDailyScanCount(user);

    // Check if the user has reached the scan limit
    if (dailyScanCount >= 3) {
      setShowScanLimitModal(true); // Show modal if the limit is reached
    } else {
      router.push("/(auth)/camera"); // Navigate to the camera screen
    }
  };
  const closeScanLimitModal = () => {
    setShowScanLimitModal(false);
  };

  const handleTestScan = async () => {
    if (!user) return;

    try {
      const db = getFirestore();
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists) return;

      // Simulate a new day scan for testing
      const updatedStreak = (userDoc.data()?.dailyStreak ?? 0) + 1;

      // Update user document
      await updateDoc(userRef, {
        dailyScans: increment(1),
        totalScans: increment(1),
        lastStreakUpdate: Date.now(),
        dailyStreak: updatedStreak,
        xp: increment(10),
      });

      // Show streak popup
      setCurrentStreak(updatedStreak);
      setShowStreakPopup(true);
    } catch (error) {
      console.error("Error in test scan:", error);
    }
  };

  const handleTestRestore = async () => {
    if (!user) return;

    try {
      const db = getFirestore();
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      const currentStreak = userDoc.data()?.dailyStreak || 0;
      const now = Date.now(); // Get current timestamp
      const yesterday = now - 30 * 60 * 60 * 1000; // 25 hours ago

      console.log("Current time:", new Date(now).toLocaleString());
      console.log(
        "Setting lastUpdate to:",
        new Date(yesterday).toLocaleString()
      );

      // Update the document
      await updateDoc(userRef, {
        lastStreakUpdate: yesterday,
        restoresLeft: 1,
      });

      setShowRestorePopup(true);
    } catch (error) {
      console.error("Error testing restore:", error);
    }
    // if (!user) return;

    // try {
    //   const db = getFirestore();
    //   const userRef = doc(db, "users", user.uid);
    //   // Set last update to 25 hours ago
    //   await updateDoc(userRef, {
    //     lastStreakUpdate: Date.now() - 25 * 60 * 60 * 1000,
    //     restoresLeft: 1,
    //   });

    //   // Check for restore conditions
    //   const userDoc = await getDoc(userRef);
    //   if (userDoc.exists) {
    //     const data = userDoc.data() as {
    //       lastStreakUpdate: number;
    //       restoresLeft: number;
    //     };
    //     const lastUpdate = data.lastStreakUpdate;
    //     const now = Date.now();
    //     const hoursSinceLastUpdate = (now - lastUpdate) / (1000 * 60 * 60);

    //     if (hoursSinceLastUpdate > 24 && data.restoresLeft > 0) {
    //       setShowRestorePopup(true);
    //     }
    //   }
    // } catch (error) {
    //   console.error("Error testing restore:", error);
    // }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <StreakPopup
          visible={showStreakPopup}
          onClose={() => setShowStreakPopup(false)}
          streakCount={currentStreak}
          type="streak"
        />
        <StreakPopup
          visible={showRestorePopup}
          onClose={() => setShowRestorePopup(false)}
          streakCount={userDoc?.dailyStreak || 0}
          type="restore"
          onRestore={() => {
            // Handle restore logic
            if (userDoc) {
              const userRef = doc(getFirestore(), "users", userDoc.uid);
              updateDoc(userRef, {
                lastStreakUpdate: Date.now(),
                restoresLeft: (userDoc.restoresLeft || 1) - 1,
              });
              setShowRestorePopup(false);
            }
          }}
          restoresLeft={userDoc?.restoresLeft || 0}
        />
        <Pressable
          className="bg-blue px-5 py-4 rounded-lg active:opacity-50"
          onPress={handleScan}
        >
          <Text className="text-white">Scan Food Waste</Text>
        </Pressable>
        <Pressable
          className="bg-blue px-5 py-4 rounded-lg active:opacity-50"
          onPress={() => {
            setShowScanResults(!showScanResults);
          }}
        >
          <Text className="text-white">Test Scan Result</Text>
        </Pressable>
        <Pressable
          className="bg-blue px-5 py-4 rounded-lg active:opacity-50"
          onPress={handleTestScan}
        >
          <Text className="text-white">Test Streak</Text>
        </Pressable>
        <Pressable
          className="bg-blue px-5 py-4 rounded-lg active:opacity-50"
          onPress={handleTestRestore}
        >
          <Text className="text-white">Test Restore</Text>
        </Pressable>
        {showScanResults && (
          <ScanResults
            image={image}
            imageDimensions={[250, 250]}
            setImage={setImage}
            onSuccessfulScan={handleSuccessfulScan}
          />
        )}

        {showScanLimitModal && (
          <ScanLimitModal
            onClose={closeScanLimitModal}
            isVisible={showScanLimitModal}
          />
        )}
      </SafeAreaView>
    </>
  );
};

export default Scan;
