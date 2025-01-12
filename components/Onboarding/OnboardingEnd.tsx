import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";

const OnboardingEnd = () => {
  const router = useRouter();

  const handleSignUp = () => {
    router.push("/signup");
  };

  return (
    <View className="flex-1 px-5 justify-center items-center bg-amber-50 ">
      <Text className="text-4xl font-bold text-lime-900 text-center mb-5">
        Get Started with Sustainability today!
      </Text>
      <Pressable
        className="rounded-lg px-6 py-3 flex items-center justify-center active:opacity-50"
        style={{ backgroundColor: Colors.tintColor }}
        onPress={handleSignUp}
      >
        <Text className="text-white">Sign Up</Text>
      </Pressable>
    </View>
  );
};

export default OnboardingEnd;
