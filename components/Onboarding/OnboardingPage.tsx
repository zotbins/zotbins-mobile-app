import React from "react";
import { View, Text } from "react-native";
import NextButton from "@/components/Onboarding/NextButton";

interface OnboardingPageProps {
  Icon: React.FC<{ width: number; height: number }>;
  headerText: string;
  bodyText: string;
  onNext: () => void;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({
  Icon,
  headerText,
  bodyText,
  onNext,
}) => {
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        {/* Icon */}
        <Icon width={300} height={300} />

        {/* Header Text */}
        <View style={{ marginTop: 20, alignSelf: "flex-start" }}>
          <Text
            style={{
              fontSize: 36,
              fontWeight: "bold",
              color: "#00762B",
              textAlign: "left",
            }}
          >
            {headerText}
          </Text>
        </View>

        {/* Body Text */}
        <View style={{ marginTop: 10, alignSelf: "flex-start" }}>
          <Text
            style={{
              fontSize: 18,
              color: "#00762B",
              textAlign: "left",
              lineHeight: 24,
            }}
          >
            {bodyText}
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

export default OnboardingPage;