import React from "react";
import OnboardingPage from "@/components/Onboarding/OnboardingPage";
import AchievementsIcon from "@/assets/images/onboarding/achievements_icon.svg";

const OnboardingAchievements = ({ onNext }: { onNext: () => void }) => {
  return (
    <OnboardingPage
      Icon={AchievementsIcon}
      headerText="Achievements"
      bodyText="Unlock rewards by completing missions and achievements."
      onNext={onNext}
    />
  );
};

export default OnboardingAchievements;