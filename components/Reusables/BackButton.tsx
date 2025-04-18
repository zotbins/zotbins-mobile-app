import React from "react";
import { Pressable } from "react-native";
import { router } from "expo-router"; 
import BackIcon from "@/assets/icons/BackIcon.svg";

const BackButton = () => (
  <Pressable
    onPress={() => router.back()}
    className="active:opacity-50 shadow-md"
    style={{ width: 48, height: 48 }}
  >
    <BackIcon width={48} height={48} />
  </Pressable>
);

export default BackButton;
