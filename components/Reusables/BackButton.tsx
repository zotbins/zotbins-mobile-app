import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

const BackButton = () => {
  return (
    <Pressable
      className="bg-brightGreen rounded-full p-2 active:opacity-50 border border-brightGreen3 shadow-md"
      onPress={() => router.back()}
    >
      <Ionicons name="arrow-back-outline" size={24} color={"#00762B"} />
    </Pressable>
  );
};
export default BackButton;