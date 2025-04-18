import BackButton from "@/components/Reusables/BackButton";
import { Link, Stack, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import data from "../../data/QuizData.js";
import { getFirestore, doc, getDoc, updateDoc, increment, collection, getDocs } from "@react-native-firebase/firestore";
import { getAuth } from "@react-native-firebase/auth";
import { updateAchievementProgress, updateMissionProgress } from "@/functions/src/updateProgress";
import RecycleIcon from "@/assets/icons/recycle.svg";
import QuizBackground from "@/assets/icons/QuizBackground.svg";
import ProgressBar from "@/components/Quiz/ProgressBar";
import ArrowRightIcon from "@/assets/icons/arrow-right.svg";
import ResultsPopup from "@/components/Quiz/ResultsPopup";

interface Question {
  id?: string;
  question: string;
  choices: string[];
  correctAnswer: string;
  createdAt: Date;
  image?: string | null;
  multipleAnswers?: boolean | null;
}

interface AnsweredQuestion {
  index: number;
  correct: boolean;
}

const Quiz = () => {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentSelected, setCurrentSelected] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [isOptionsDisabled, setIsOptionsDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [progress, setProgress] = useState(new Animated.Value(0));
  const [reachedDailyLimit, setReachedDailyLimit] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([]);
  const progressAnim = progress.interpolate({
    inputRange: [0, questions.length],
    outputRange: ["0%", "100%"],
  });

  const getQuestions = async () => {
    try {
      const user = getAuth().currentUser;
      if (!user) return;

      // Check if the user has any daily questions left
      const db = getFirestore();
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists) return;

      const userData = userDoc.data();
      const dailyQuestions = userData?.dailyQuestions || 0;

      // If they've already answered 3 questions today, show limit reached
      if (dailyQuestions >= 3) {
        setReachedDailyLimit(true);
        return;
      }

      // Only display as many questions as they have left for the day
      const questionsRemaining = 3 - dailyQuestions;

      const querySnapshot = await getDocs(collection(db, 'questions'));
      const allQuestions: Question[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        allQuestions.push({
          id: doc.id,
          question: data.question,
          choices: data.choices,
          correctAnswer: data.correctAnswer,
          createdAt: data.createdAt.toDate(),
          image: data.image || null,
          multipleAnswers: data.multipleAnswers,
        });
      });

      // shuffle array
      const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);

      const randomQuestions = shuffledQuestions.slice(0, questionsRemaining);

      setQuestions(randomQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  useEffect(() => {
    getQuestions();
  }, []);

  // display quiz question
  const displayQuestion = () => {
    Animated.timing(progress, {
      toValue: currentQuestionIndex + 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    return (
      <View className="items-center justify-center">
        <RecycleIcon width={240} height={240} />
      </View>
    );
  };

  // display possible answers
  const displayOptions = () => {
    if (!questions[currentQuestionIndex]) return null;

    const { question, choices, correctAnswer } = questions[currentQuestionIndex];

    return (
      <View className="w-full flex-1 rounded-t-3xl overflow-hidden">
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#009838' }}>
          <QuizBackground width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
        </View>
        <View className="w-full px-6 py-8 flex-1 z-10 mb-10">
          <Text className="text-white text-3xl font-semibold mb-4 text-center">
            {question}
          </Text>

          <View className="flex-col">
            {choices.map((choice, index) => {
              let buttonClass, textClass;

              if (isOptionsDisabled) {
                if (choice === correctAnswer) {
                  // correct answer
                  buttonClass = "border border-[#82FFAD] rounded-full py-4 px-5 mb-4 items-center justify-center w-full bg-[#B4F17C]";
                  textClass = "text-lg text-center text-[#00762B]";
                } else if (choice === currentSelected && choice !== correctAnswer) {
                  // wrong answer
                  buttonClass = "border border-[#EC9A78] rounded-full py-4 px-5 mb-4 items-center justify-center w-full bg-[#FFC7D3]";
                  textClass = "text-lg text-center text-[#00762B]";
                } else {
                  // other options
                  buttonClass = "border border-[#82FFAD] rounded-full py-4 px-5 mb-4 items-center justify-center w-full bg-transparent";
                  textClass = "text-lg text-center text-white";
                }
              } else {
                // before answering
                buttonClass = "border border-[#82FFAD] rounded-full py-4 px-5 mb-4 items-center justify-center w-full bg-transparent";
                textClass = "text-lg text-center text-white";
              }

              return (
                <Pressable
                  key={`${choice}-${index}`}
                  disabled={isOptionsDisabled}
                  className={buttonClass}
                  onPress={() => checkAnswer(choice)}
                >
                  <Text className={textClass}>
                    {choice}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    );
  }

  // checks if answer selected is correct
  const checkAnswer = async (selected: string) => {
    let answer = questions[currentQuestionIndex].correctAnswer;
    setCurrentSelected(selected);
    setAnswer(answer);
    setIsOptionsDisabled(true);

    // record this answer for progress bar
    const isCorrect = selected === answer;
    setAnsweredQuestions([
      ...answeredQuestions,
      { index: currentQuestionIndex, correct: isCorrect }
    ]);

    const user = getAuth().currentUser;
    if (user) {
      try {
        const db = getFirestore();
        const userRef = doc(db, 'users', user.uid);

        // Increment the dailyQuestions counter when a question is answered
        await updateDoc(userRef, {
          dailyQuestions: increment(1)
        });

        if (isCorrect) {
          setScore(score + 1);

          // award points for correct answers
          await updateDoc(userRef, {
            totalPoints: increment(1),
          });
          await updateAchievementProgress("points", 1);
          await updateMissionProgress("points", 1);
          console.log("Added points to totalPoints.");
        }
      } catch (error) {
        console.error("Error updating totalPoints:", error);
      }
    }
  };

  // display "next question" button after current one is answered
  const showNextButton = () => {
    if (isOptionsDisabled) {
      const isLastQuestion = currentQuestionIndex === questions.length - 1;

      return (
        <View className="absolute bottom-16 right-6">
          <Pressable
            onPress={handleNext}
            className="relative flex-row items-center pl-8 pr-14 py-4 rounded-3xl bg-[#C9FFE2] border border-[#00D363] active:opacity-50 w-40 shadow-xl"
          >
            <Text className="text-xl font-bold text-[#00762B]">
              {isLastQuestion ? "Finish" : "Next"}
            </Text>
            <View className="absolute right-5">
              <ArrowRightIcon width={24} height={24} fill="#00762B" />
            </View>
          </Pressable>
        </View>
      );
    } else {
      return null;
    }
  };

  // update states for next question
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

  useEffect(() => {
    const updateUserData = async () => {
      const user = getAuth().currentUser;
      if (showResults && user) {
        await updateAchievementProgress("quiz", 1);
        await updateMissionProgress("quiz", 1);
        const db = getFirestore();
        const userRef = doc(db, 'users', user.uid);

        try {
          const docSnapshot = await getDoc(userRef);
          if (docSnapshot.exists) {
            const data = docSnapshot.data();
            const currentXP = data?.xp || 0;
            const currentLevel = data?.level || 1;
            const requiredXPforNextLevel = 50 * currentLevel;
            const newXP = currentXP + 5;
            if (newXP >= requiredXPforNextLevel) {
              const updateXP = newXP - requiredXPforNextLevel;
              await updateDoc(userRef, {
                xp: updateXP,
                level: increment(1),
              });
              await updateAchievementProgress("level", 1);
            } else {
              await updateDoc(userRef, {
                xp: increment(5)
              });
            }
          }
        } catch (error) {
          console.error("Error getting user data: ", error);
        };
      }
    };
    updateUserData();
  }, [showResults]);

  return (
    <>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerBackVisible: false,
          headerTransparent: true,
          headerTitle: "",
        }}
      />

      {reachedDailyLimit ? (
        <View className="pt-32 flex-1 bg-white px-5 py-12">
          <View>
            <Text className="text-5xl text-black text-center pb-2">Daily Limit Reached</Text>
            <Text className="text-xl text-black text-center pb-8">
              You've already answered 3 questions today. Come back tomorrow for more!
            </Text>
            <View className="pt-10 flex items-center justify-center">
              <Link href="/home" asChild>
                <Pressable className="w-11/12 items-center justify-center py-5 px-8 rounded-xl bg-[#009838] active:opacity-50">
                  <Text className="text-white text-xl">Back to Home</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </View>
      ) : (
        <View className="flex-1 bg-[#f8fff8] pt-24 relative">
          <ProgressBar
            totalSteps={3}
            answeredQuestions={answeredQuestions}
          />

          {!showResults && ( // disable back button when results is showing
            <View className="ml-5">
              <BackButton />
            </View>
          )}

          <View className="mb-2">
            {displayQuestion()}
          </View>

          <View className="flex-1 relative mt-2">
            {displayOptions()}
            {showNextButton()}
          </View>

          {showResults && (
            <ResultsPopup score={score} />
          )}
        </View>
      )}
    </>
  );
};

export default Quiz;