import DotIndicator from "@/components/Reusables/DotIndicator";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import OnboardingAbout from "../components/Onboarding/OnboardingAbout";
import OnboardingEnd from "../components/Onboarding/OnboardingEnd";
import OnboardingQuiz from "../components/Onboarding/OnboardingQuizFeature";
import OnboardingScanner from "../components/Onboarding/OnboardingScannerFeature";

export default function Onboarding() {
  const [currentOffset, setCurrentOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        disableIntervalMomentum={true}
        className="flex-1"
        onMomentumScrollEnd={(e) => {
          // uses the content offset value to update the dot indicator
          if (e.nativeEvent.contentOffset.x > currentOffset) {
            setCurrentPage((prevCurrentPage) => prevCurrentPage + 1);
          } else if (e.nativeEvent.contentOffset.x < currentOffset) {
            setCurrentPage((prevCurrentPage) => prevCurrentPage - 1);
          }
          setCurrentOffset(e.nativeEvent.contentOffset.x);
        }}
      >
        <View className="flex-1 w-screen">
          <OnboardingAbout />
        </View>
        <View className="flex-1 w-screen">
          <OnboardingQuiz />
        </View>
        <View className="flex-1 w-screen">
          <OnboardingScanner />
        </View>
        <View className="flex-1 w-screen">
          <OnboardingEnd />
        </View>
      </ScrollView>
      <DotIndicator currentPage={currentPage} />
    </>
  );
}
