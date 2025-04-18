import React from 'react';
import { View } from 'react-native';

interface ProgressBarProps {
  totalSteps: number;
  answeredQuestions: {
    index: number;
    correct: boolean;
  }[];
}

const ProgressBar = ({ totalSteps, answeredQuestions }: ProgressBarProps) => {
  return (
    <View className="w-full px-5 flex-row justify-between mb-5">
      {[...Array(totalSteps)].map((_, index) => {
        // check if this question has been answered
        const answeredQuestion = answeredQuestions.find(q => q.index === index);
        
        let backgroundColor;
        if (answeredQuestion) {
          backgroundColor = answeredQuestion.correct ? '#48BB78' : '#FF5555';
        } else {
          backgroundColor = '#BDBDBD'; // gray for unanswered
        }

        const marginClass = index === 0 ? "" : "ml-2";
        
        return (
          <View 
            key={index}
            className={`h-2 rounded-full w-[31%] ${marginClass}`}
            style={{ backgroundColor }}
          />
        );
      })}
    </View>
  );
};

export default ProgressBar;