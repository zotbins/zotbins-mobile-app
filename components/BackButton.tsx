import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

const BackButton = () => {
  return (
    <Pressable
      className="bg-white rounded-full p-2 active:opacity-50"
      onPress={() => router.back()}
    >
      <Ionicons name="chevron-back" size={24} color={Colors.black} />
    </Pressable>
  );
};

export default BackButton;
