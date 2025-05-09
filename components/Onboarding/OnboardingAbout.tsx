import React from "react";
import { View, Text } from "react-native";
import NextButton from "@/components/Onboarding/NextButton";
import RecycleIcon from "@/assets/images/onboarding/recycle_icon.svg";

const OnboardingAbout = ({ onNext }: { onNext: () => void }) => {
  return (
    <View style={{ flex: 1 }}>
      {/* Centered Content */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        {/* Recycle Icon */}
        <RecycleIcon width={200} height={200} />

        {/* Header Text */}
        <View style={{ marginTop: 20, alignSelf: "flex-start" }}>
          <Text
            style={{
              fontSize: 36,
              fontWeight: "bold",
              color: "#00762B", // Dark green color
              textAlign: "left",
            }}
          >
            Welcome to ZotBins!
          </Text>
        </View>

        {/* Description Text */}
        <View style={{ marginTop: 10, alignSelf: "flex-start" }}>
          <Text
            style={{
              fontSize: 18,
              color: "#00762B",
              textAlign: "left",
              lineHeight: 24,
            }}
          >
            An innovative smart waste bin system designed to optimize waste
            management efficiency.
          </Text>
        </View>
      </View>

      {/* Bottom-right Next Button */}
      <View
        style={{
          position: "absolute",
          bottom: 40,
          right: 20,
        }}
      >
        <NextButton onPress={onNext} />
      </View>
    </View>
  );
};

export default OnboardingAbout;