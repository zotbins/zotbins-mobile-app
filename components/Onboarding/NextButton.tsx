import React from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BackIcon from "@/assets/icons/BackIcon.svg";

interface NextButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

const NextButton: React.FC<NextButtonProps> = ({ onPress, style }) => {
  return (
    <Pressable
      onPress={onPress}
    >
      <BackIcon width={48} height={48} style = {{transform: [{scaleX: -1}]}}/>
    </Pressable>

  );
};

export default NextButton;