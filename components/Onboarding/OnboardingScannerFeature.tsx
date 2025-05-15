import React from "react";
import OnboardingPage from "@/components/Onboarding/OnboardingPage";
import ScannerIcon from "@/assets/images/onboarding/scanner_icon.svg";

interface OnboardingScannerFeatureProps {
  onNext: () => void;
  onSkip: () => void;
  progress: number;
}

const OnboardingScannerFeature: React.FC<OnboardingScannerFeatureProps> = ({ onNext, onSkip, progress }) => {
  return (
    <OnboardingPage
      Icon={ScannerIcon}
      headerText="Scan Your Trash"
      bodyText="Learn more about proper disposal practices and help contribute to our data collection. Scan to keep your streak up!"
      onNext={onNext}
      onSkip={onSkip}
      progress={progress}
    />
  );
};

export default OnboardingScannerFeature;