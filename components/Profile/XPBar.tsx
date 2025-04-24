import React from "react";
import { View } from "react-native";

const XPBar = ({ xp, requiredXP }: { xp: number; requiredXP: number }) => {
    const progress = Math.min(xp / requiredXP, 1) * 100;
  
    return (
      <View className="w-[90%] h-3 bg-white border border-mediumGreen rounded-full overflow-hidden shadow-sm">
        <View
          style={{ width: `${progress}%` }}
          className="h-full bg-primaryGreen rounded-full"
        />
      </View>
    );
  };

export default XPBar;
  