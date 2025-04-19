import React from "react";
import { View, Animated, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface ScanIndicatorProps {
  scanPosition: Animated.Value;
  screenHeight: number;
}

const ScanIndicator: React.FC<ScanIndicatorProps> = ({ scanPosition, screenHeight }) => (
  <View style={styles.overlay}>
    <Animated.View
      style={{
        transform: [
          {
            translateY: scanPosition.interpolate({
              inputRange: [0, 1],
              outputRange: [0, screenHeight - 4],
            }),
          },
        ],
      }}
    >
      <AnimatedLinearGradient
        colors={["rgba(255,255,255,0.8)", "transparent"]}
        style={[
          styles.gradient,
          {
            transform: [
              {
                scaleY: scanPosition.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, -1],
                }),
              },
            ],
          },
        ]}
      />

    </Animated.View>
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    overflow: "hidden",
  },
  gradient: {
    width: "100%",
    height: 60,
  },
});

export default ScanIndicator;
