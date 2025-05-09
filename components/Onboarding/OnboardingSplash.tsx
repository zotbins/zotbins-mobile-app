import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import LogoAnimation from "@/components/Onboarding/LogoAnimation";
import NextButton from "@/components/Onboarding/NextButton";

const OnboardingSplash = ({ onNext }: { onNext: () => void }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, 3500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* Centered Logo + Text Group */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ alignItems: "center" }}>
          <LogoAnimation />
          <Animated.View style={{ opacity: fadeAnim, marginTop: 20 }}>
            <Text
              style={{
                fontSize: 36,
                fontWeight: "bold",
                color: "#00762B",
                textAlign: "center",
              }}
            >
              ZotBins
            </Text>
          </Animated.View>
        </View>
      </View>

      {/* Bottom-right Button */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          position: "absolute",
          bottom: 40,
          right: 20,
        }}
      >
        <NextButton onPress={onNext} />
      </Animated.View>
    </View>
  );
};

export default OnboardingSplash;
