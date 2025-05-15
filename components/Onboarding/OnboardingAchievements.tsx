import React from "react";
import OnboardingPage from "@/components/Onboarding/OnboardingPage";
import AchievementsIcon from "@/assets/images/onboarding/achievements_icon.svg";

interface OnboardingAchievementsProps {
  onNext: () => void;
  onSkip: () => void;
  progress: number;
}

const OnboardingAchievements: React.FC<OnboardingAchievementsProps> = ({ onNext, onSkip, progress }) => {
  return (
    <OnboardingPage
      Icon={AchievementsIcon}
      headerText="Achievements"
      bodyText="Unlock rewards by completing missions and achievements."
      onNext={onNext}
      onSkip={onSkip}
      progress={progress} 
    />
  );
};

export default OnboardingAchievements;