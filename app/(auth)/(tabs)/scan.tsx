import { Stack, router } from "expo-router";
import React, { useState } from "react";
import { Pressable, SafeAreaView, Text } from "react-native";
import ScanResults from "@/components/Scan/ScanResults";
import TestImage from "@/assets/images/test-image"
import ScanLimitModal from "@/components/Scan/ScanLimitModal";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

const Scan = () => {
  const [image, setImage] = useState<string | null>(TestImage);

  const [showScanResults, setShowScanResults] = useState<boolean>(false);
  const [showScanLimitModal, setShowScanLimitModal] = useState<boolean>(false);
  const user = auth().currentUser;
  
  const getDailyScanCount = async (user) => {
    try {
      const userDoc = await firestore().collection("users").doc(user.uid).get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        return userData?.dailyScans || 0;
      } else {
        return 0;
      }
    } catch (error) {
      console.error("Error getting daily scans:", error);
      return 0;
    }
  };

  // handles the scan button press
  const handleScan = async () => {

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
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
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
        {showScanResults && (
        <ScanResults
          image={image}
          imageDimensions={[250, 250]}
          setImage={setImage}
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
