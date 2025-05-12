import React from "react";
import OnboardingPage from "@/components/Onboarding/OnboardingPage";
import ScannerIcon from "@/assets/images/onboarding/scanner_icon.svg";

const OnboardingScannerFeature = ({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) => {
  return (
    <OnboardingPage
      Icon={ScannerIcon}
      headerText="Scan Your Trash"
      bodyText="Learn more about proper disposal practices and help contribute to our data collection. Scan to keep your streak up!"
      onNext={onNext}
      onSkip={onSkip}
    />
  );
};

export default OnboardingScannerFeature;