import React from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface NextButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

const NextButton: React.FC<NextButtonProps> = ({ onPress, style }) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: "#48BB78",
          borderRadius: 50,
          padding: 12,
          elevation: 5,
        },
        style,
      ]}
    >
      <Ionicons name="arrow-forward" size={24} color="white" />
    </Pressable>
  );
};

export default NextButton;