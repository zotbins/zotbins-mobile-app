import React from "react";
import OnboardingPage from "@/components/Onboarding/OnboardingPage";
import QuizIcon from "@/assets/images/onboarding/quiz_icon.svg";

interface OnboardingQuizFeatureProps {
  onNext: () => void;
  onSkip: () => void;
  progress: number;
}

const OnboardingQuizFeature: React.FC<OnboardingQuizFeatureProps> = ({ onNext, onSkip, progress }) => {
  return (
    <OnboardingPage
      Icon={QuizIcon}
      headerText="Daily Quiz"
      bodyText="Strengthen your knowledge and earn points. Climb the leaderboard and compete with your friends."
      onNext={onNext}
      onSkip={onSkip}
      progress={progress}
    />
  );
};

export default OnboardingQuizFeature;
