import React from "react";
import { View } from "react-native";
import XPBarEdge from "@/components/Profile/xpBarEdge.svg";

const XPBar = ({ xp, requiredXP }: { xp: number; requiredXP: number }) => {
  const progress = Math.min(xp / requiredXP, 1) * 100;

  return (
    <View className="w-[60%] h-[8px] bg-white border-[0.8px] border-mediumGreen rounded-full overflow-hidden">
      {/* main green filling part */}
      <View
        style={{ width: `${progress}%` }}
        className="h-full bg-primaryGreen"
      />

      {/* fizzy edge part */}
      {progress < 100 && (
        <View
          style={{
            position: "absolute",
            left: `${progress}%`,
            top: 0,
            transform: [{scaleY: 1.5}, { translateX: -1.5 }],
            zIndex: 10,
            height: 12,
            width: 6,
          }}
        >
          <XPBarEdge height="100%" width="100%" />
        </View>
      )}
    </View>
  );
};

export default XPBar;
