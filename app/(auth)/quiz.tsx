import BackButton from "@/components/BackButton";
import { Link, Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import data from "../../data/QuizData.js";

const Quiz = () => {
  const router = useRouter();

  const questions = data;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentSelected, setCurrentSelected] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [isOptionsDisabled, setIsOptionsDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [progress, setProgress] = useState(new Animated.Value(0));
  const progressAnim = progress.interpolate({
    inputRange: [0, questions.length],
    outputRange: ["0%", "100%"],
  });

  const displayProgress = () => {
    return (
      <View className="w-full h-5 rounded-[20px] bg-black/20">
        <Animated.View
          className="h-5 rounded-[20px] bg-tintColor"
          style={{ width: progressAnim }}
        ></Animated.View>
      </View>
    );
  };

  const displayQuestion = () => {
    Animated.timing(progress, {
      toValue: currentQuestionIndex + 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    return (
      <View className="pt-8 pb-5">
        <View className="flex-row items-end">
          <Text className="text-black text-2xl">
            {currentQuestionIndex + 1}{" "}
          </Text>
          <Text className="text-black text-2xl">/ {questions.length}</Text>
        </View>
        <Text className="text-black text-4xl">
          {questions[currentQuestionIndex]?.question}
        </Text>
      </View>
    );
  };

  const displayOptions = () => {
    return (
      <View>
        {questions[currentQuestionIndex]?.options.map((option) => (
          <Pressable
            key={option}
            disabled={isOptionsDisabled}
            className={`h-24 rounded-[10px] flex-row items-center justify-between px-5 my-3 active:opacity-50
              ${
                option == answer
                  ? "bg-tintColor"
                  : option == currentSelected
                  ? "bg-red"
                  : "bg-blue"
              }`}
            onPress={() => checkAnswer(option)}
          >
            <Text className="text-xl text-white">{option}</Text>
          </Pressable>
        ))}
      </View>
    );
  };

  const checkAnswer = (selected: string) => {
    let answer = questions[currentQuestionIndex]["answer"];
    setCurrentSelected(selected);
    setAnswer(answer);
    setIsOptionsDisabled(true);
    if (selected == answer) {
      setScore(score + 1);
    }
  };

  const showNextButton = () => {
    if (isOptionsDisabled) {
      return (
        <Pressable
          onPress={handleNext}
          className="w-full border-2 border-grey bg-white px-5 my-2.5 h-16 rounded-[10px] 
            flex-row items-center justify-center active:opacity-50"
        >
          <Text className="text-2xl text-black text-center">
            {currentQuestionIndex == questions.length - 1
              ? "Show Results"
              : "Next Question"}
          </Text>
        </Pressable>
      );
    } else {
      return null;
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex == questions.length - 1) {
      setShowResults(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentSelected(null);
      setAnswer(null);
      setIsOptionsDisabled(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerBackVisible: false,
          headerTransparent: true,
          headerLeft: () => <BackButton />,
          headerTitle: "",
        }}
      />
      <View className="pt-32 flex-1 bg-white px-5 py-12">
        {!showResults && displayProgress()}
        {!showResults && displayQuestion()}
        {!showResults && displayOptions()}
        {!showResults && showNextButton()}

        {showResults && (
          <View>
            <Text className="text-5xl text-black text-center">Results</Text>
            <Text className="text-2xl text-black text-center">
              {score} / {questions.length}
            </Text>
            <View className="pt-12">
              <Link href="/home" asChild>
                <Pressable className="items-center justify-center py-5 px-8 rounded-sm shadow-sm bg-tintColor active:opacity-50">
                  <Text className="text-black">Back to Home</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        )}
      </View>
    </>
  );
};

export default Quiz;
