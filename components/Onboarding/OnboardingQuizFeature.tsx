import React from "react";
import OnboardingPage from "@/components/Onboarding/OnboardingPage";
import QuizIcon from "@/assets/images/onboarding/quiz_icon.svg";

const OnboardingQuizFeature = ({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) => {
  return (
    <OnboardingPage
      Icon={QuizIcon}
      headerText="Daily Quiz"
      bodyText="Strengthen your knowledge and earn points. Climb the leaderboard and compete with your friends."
      onNext={onNext}
      onSkip={onSkip}
    />
  );
};

export default OnboardingQuizFeature;