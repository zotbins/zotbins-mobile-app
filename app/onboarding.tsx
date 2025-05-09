import React, { useState, useEffect, useRef } from "react";
import { View, ImageBackground, Animated } from "react-native";
import OnboardingSplash from "@/components/Onboarding/OnboardingSplash";
import OnboardingQuiz from "@/components/Onboarding/OnboardingQuizFeature";
import OnboardingScanner from "@/components/Onboarding/OnboardingScannerFeature";
import OnboardingEnd from "@/components/Onboarding/OnboardingEnd";
import NextButton from "@/components/Onboarding/NextButton";

const onboardingPages = [
  OnboardingSplash,
  OnboardingQuiz,
  OnboardingScanner,
  OnboardingEnd,
];

export default function Onboarding() {
  const [currentPage, setCurrentPage] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current; //set button opacity to 0 on start

  const CurrentPageComponent = onboardingPages[currentPage];

  const handleNext = () => {
    if (currentPage < onboardingPages.length - 1) {
      setCurrentPage((prev) => prev + 1);
      setShowNextButton(false); // reset button visibility for the next page
      fadeAnim.setValue(0); // reset opacity for the next page
    } else {
      console.log("Onboarding complete. Navigate to signup.");
    }
  };

  useEffect(() => {
    if (currentPage === 0) {
      const timer = setTimeout(() => {
        setShowNextButton(true);
        //butoton fadein customization
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      }, 3500);

      return () => clearTimeout(timer); 
    } else {
      setShowNextButton(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [currentPage]);

  return (
    <ImageBackground
      source={require("../assets/images/onboarding/background.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={{ flex: 1 }}>
        <CurrentPageComponent />
        {showNextButton && (
          <Animated.View
            style={{
              opacity: fadeAnim,
              position: "absolute",
              bottom: 20,
              right: 20,
            }}
          >
            <NextButton onPress={handleNext} />
          </Animated.View>
        )}
      </View>
    </ImageBackground>
  );
}