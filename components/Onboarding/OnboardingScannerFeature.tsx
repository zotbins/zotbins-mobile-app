import React from "react";
import OnboardingPage from "@/components/Onboarding/OnboardingPage";
import ScannerIcon from "@/assets/images/onboarding/scanner_icon.svg";

const OnboardingScannerFeature = ({ onNext }: { onNext: () => void }) => {
  return (
    <OnboardingPage
      Icon={ScannerIcon}
      headerText="Scan Your Trash"
      bodyText="Learn more about proper disposal practices and help contribute to our data collection. Scan to keep your streak up!"
      onNext={onNext}
    />
  );
};

export default OnboardingScannerFeature;