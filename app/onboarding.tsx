import React, { useState } from "react";
import { View, ImageBackground } from "react-native";
import OnboardingSplash from "@/components/Onboarding/OnboardingSplash";
import OnboardingAbout from "@/components/Onboarding/OnboardingAbout";
import OnboardingQuiz from "@/components/Onboarding/OnboardingQuizFeature";
import OnboardingScanner from "@/components/Onboarding/OnboardingScannerFeature";
import OnboardingAchievements from "@/components/Onboarding/OnboardingAchievements";
import OnboardingEnd from "@/components/Onboarding/OnboardingEnd";

const onboardingPages = [
  OnboardingSplash,
  OnboardingAbout,
  OnboardingScanner,
  OnboardingQuiz,
  OnboardingAchievements,
  OnboardingEnd,
];

export default function Onboarding() {
  const [currentPage, setCurrentPage] = useState(0);

  const CurrentPageComponent = onboardingPages[currentPage];

  const handleNext = () => {
    if (currentPage < onboardingPages.length - 1) {
      setCurrentPage((prev) => prev + 1);
    } else {
      console.log("Onboarding complete. Navigate to signup.");
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/onboarding/background.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={{ flex: 1 }}>
        <CurrentPageComponent onNext={handleNext} />
      </View>
    </ImageBackground>
  );
}