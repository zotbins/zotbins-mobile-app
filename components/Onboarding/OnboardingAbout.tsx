import React from "react";
import OnboardingPage from "@/components/Onboarding/OnboardingPage";
import RecycleIcon from "@/assets/images/onboarding/recycle_icon.svg";

interface OnboardingAboutProps {
  onNext: () => void;
  onSkip: () => void;
  progress: number;
}

const OnboardingAbout: React.FC<OnboardingAboutProps> = ({ onNext, onSkip, progress }) => {
  return (
    <OnboardingPage
      Icon={RecycleIcon}
      headerText="Welcome to ZotBins!"
      bodyText="An innovative smart waste bin system designed to optimize waste management efficiency."
      onNext={onNext}
      onSkip={onSkip}
      progress={progress}
    />
  );
};

export default OnboardingAbout;
