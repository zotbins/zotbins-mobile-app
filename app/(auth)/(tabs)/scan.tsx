import { Stack, router } from "expo-router";
import React, { useState } from "react";
import { Pressable, SafeAreaView, Text } from "react-native";
import ScanResults from "@/components/Scan/ScanResults";
import TestImage from "@/assets/images/test-image"
import ScanLimitModal from "@/components/Scan/ScanLimitModal";

const Scan = () => {
  const [image, setImage] = useState<string | null>(TestImage);

  const [showScanResults, setShowScanResults] = useState<boolean>(false);
  const [showScanLimitModal, setShowScanLimitModal] = useState<boolean>(false);

  const [dailyScans, setDailyScans] = useState<number>(0);

  // handles the scan button press
  const handleScan = () => {
    // check if the user has reached the daily scan limit
    if (dailyScans >= 3) {
      setShowScanLimitModal(true);
    }
    // if the user has not reached the daily scan limit, navigate to the camera screen
    else {
      router.push("/(auth)/camera");
    }
  }

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
