import BackButton from "@/components/Reusables/BackButton";
import { Link, Stack, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import data from "../../data/QuizData.js";
import { getFirestore, doc, getDoc, updateDoc, increment, collection, getDocs } from "@react-native-firebase/firestore";
import { getAuth } from "@react-native-firebase/auth";
import { updateAchievementProgress, updateMissionProgress } from "@/functions/src/updateProgress";

interface Question {
  id?: string;
  question: string;
  choices: string[];
  correctAnswer: string;
  createdAt: Date;
  image?: string | null;
  multipleAnswers?: boolean | null;
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
  const progressAnim = progress.interpolate({
    inputRange: [0, questions.length],
    outputRange: ["0%", "100%"],
  });

  const getQuestions = async () => {
    try {
      const db = getFirestore();
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

      // select the first 5 random questions
      const randomQuestions = shuffledQuestions.slice(0, 3);

      setQuestions(randomQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  useEffect(() => {
    getQuestions();
  }, []);

  // show a progress bar of the quiz
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

  // display quiz question
  const displayQuestion = () => {
    Animated.timing(progress, {
      toValue: currentQuestionIndex + 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    return (
      <View className="flex justify-center items-center">
        <View className="pt-8 pb-5 w-11/12">
          <View className="flex-row items-end pb-2">
            <Text className="text-black text-2xl">
              {currentQuestionIndex + 1}{" "}
            </Text>
            <Text className="text-black text-2xl">/ {questions.length}</Text>
          </View>
          <Text className="text-black text-4xl">
            {questions[currentQuestionIndex]?.question}
          </Text>
        </View>
      </View>
    );
  };

  // display possible answers
  const displayOptions = () => {
    return (
      <View className="flex-1 px-5 mt-4">
        {questions[currentQuestionIndex]?.choices.slice(0, 5).map((choice, index) => (
          <Pressable
            key={`${choice}-${index}`}
            disabled={isOptionsDisabled}
            className={`min-h-16 rounded-xl items-start justify-center px-5 py-3 my-2 active:opacity-50
              ${choice === answer
                ? "bg-tintColor"
                : choice === currentSelected
                  ? "bg-red"
                  : "bg-blue"
              }`}
            onPress={() => checkAnswer(choice)}
          >
            <Text className="text-xl text-white">{choice}</Text>
          </Pressable>
        ))}
      </View>
    );
  };

  // checks if answer selected is correct
  const checkAnswer = async (selected: string) => {
    let answer = questions[currentQuestionIndex].correctAnswer;
    setCurrentSelected(selected);
    setAnswer(answer);
    setIsOptionsDisabled(true);
    if (selected == answer) {
      setScore(score + 1);

      // award points for correct answers
      const user = getAuth().currentUser;
      if (user) {
        try {
          const db = getFirestore();
          const userRef = doc(db, 'users', user.uid);

          await updateDoc(userRef, {
            totalPoints: increment(1),
          });
          await updateAchievementProgress("points", 1);
          await updateMissionProgress("points", 1);
          console.log("Added points to totalPoints.");
        } catch (error) {
          console.error("Error updating totalPoints:", error);
        }
      }
    }
  };

  // display "next question" button after current one is answered
  const showNextButton = () => {
    if (isOptionsDisabled) {
      return (
        <View className="flex justify-center items-center">
          <Pressable
            onPress={handleNext}
            className="w-11/12 border-2 border-grey bg-white my-2.5 h-16 rounded-[10px] 
            flex justify-center active:opacity-50"
          >
            <Text className="text-2xl text-black text-center">
              {currentQuestionIndex == questions.length - 1
                ? "Show Results"
                : "Next Question"}
            </Text>
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
            <Text className="text-5xl text-black text-center pb-2">Results</Text>
            <Text className="text-3xl text-black text-center">
              {score} / {questions.length}
            </Text>
            <View className="pt-10 flex items-center justify-center">
              <Link href="/home" asChild>
                <Pressable className="w-11/12 items-center justify-center py-5 px-8 rounded-xl bg-tintColor active:opacity-50">
                  <Text className="text-white text-xl">Back to Home</Text>
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
