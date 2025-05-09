import React from "react";
import OnboardingPage from "@/components/Onboarding/OnboardingPage";
import QuizIcon from "@/assets/images/onboarding/quiz_icon.svg";

const OnboardingQuizFeature = ({ onNext }: { onNext: () => void }) => {
  return (
    <OnboardingPage
      Icon={QuizIcon}
      headerText="Daily Quiz"
      bodyText="Strengthen your knowledge and earn points. Climb the leaderboard and compete with your friends."
      onNext={onNext}
    />
  );
};

export default OnboardingQuizFeature;