import React from "react";
import { View, Pressable, StyleProp, ViewStyle } from "react-native";
import Svg, { Circle } from "react-native-svg";
import BackIcon from "@/assets/icons/BackIcon.svg";

interface NextButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  progress?: number;
}

const NextButton: React.FC<NextButtonProps> = ({ onPress, style, progress = 0 }) => {
  const iconSize = 61;
  const ringSize = iconSize;
  const strokeWidth = 3;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View
      style={[
        {
          width: ringSize,
          height: ringSize,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      {/* progress ring */}
      <Svg
        width={ringSize}
        height={ringSize}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <Circle
          stroke="#00B94A"
          fill="none"
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          originX={ringSize / 2}
          originY={ringSize / 2}
        />
      </Svg>

      <Pressable
        onPress={onPress}
        className="active:opacity-50"
        style={{
          width: iconSize,
          height: iconSize,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <BackIcon
          width="100%"
          height="100%"
          style={{
            transform: [{ scaleX: -1 }, { translateY: 4.5 }],
          }}
        />

      </Pressable>

    </View>
  );
};

export default NextButton;
