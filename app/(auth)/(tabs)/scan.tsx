import { Stack, router } from "expo-router";
import React, { useState } from "react";
import { Pressable, SafeAreaView, Text } from "react-native";
import ScanResults from "@/components/Scan/ScanResults";
import TestImage from "@/assets/images/test-image"

const Scan = () => {
  const [image, setImage] = useState<string | null>(TestImage);

  const [showScanResults, setShowScanResults] = useState<boolean>(false);
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Pressable
          className="bg-blue px-5 py-4 rounded-lg active:opacity-50"
          onPress={() => {
            router.push("/(auth)/camera");
          }}
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
      </SafeAreaView>
    </>
  );
};

export default Scan;
