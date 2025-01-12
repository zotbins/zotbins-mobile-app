import {
  View,
  Text,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import DotIndicator from "../DotIndicator";

const OnboardingScannerFeature = () => {
  const router = useRouter();
  const totalPages = 4; // Update this to match the actual number of slides

  return (
    <View className="flex-1 px-5 py-12 justify-center items-center bg-amber-50">
      <Text className="text-4xl font-bold text-lime-900 mx-10">
        Scanner Feature
      </Text>

      <Image
        source={require("../../assets/images/scanner_icon.png")}
        className="w-64 h-64 my-10"
      />
      <Text className="text-2xl text-center text-lime-900 w-10/12 mx-8 leading-10">
        Our app contains a scanner for easy waste detection! Click on the
        scanner icon to scan your trash.
      </Text>
    </View>
  );
};

export default OnboardingScannerFeature;
