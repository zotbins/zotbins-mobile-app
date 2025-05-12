import React from "react";
import OnboardingPage from "@/components/Onboarding/OnboardingPage";
import RecycleIcon from "@/assets/images/onboarding/recycle_icon.svg";

const OnboardingAbout = ({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) => {
  return (
    <OnboardingPage
      Icon={RecycleIcon}
      headerText="Welcome to ZotBins!"
      bodyText="An innovative smart waste bin system designed to optimize waste management efficiency."
      onNext={onNext}
      onSkip={onSkip}
    />
  );
};

export default OnboardingAbout;