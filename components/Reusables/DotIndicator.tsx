import React from "react";
import { View, Text } from "react-native";
import Colors from "@/constants/Colors";

interface DotIndicatorProps {
  currentPage: number;
}

const DotIndicator: React.FC<DotIndicatorProps> = ({ currentPage }) => {
  const totalPages = 4;
  const dots = [];

  for (let i = 1; i <= totalPages; i++) {
    const isActive = i === currentPage;
    dots.push(
      <Text
        key={i}
        className="text-lg mx-2 pb-8 pt-2"
        style={{ color: isActive ? Colors.tintColor : "gray" }}
      >
        ●
      </Text>
    );
  }

  return <View className="flex-row items-center justify-center">{dots}</View>;
};

export default DotIndicator;
