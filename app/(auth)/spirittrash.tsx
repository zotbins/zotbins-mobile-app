import {
  Pressable,
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  ImageBackground,
} from "react-native";
import React, { useEffect } from "react";
import { router, Stack } from "expo-router";
import { useState } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
} from "@react-native-firebase/firestore";
import { getAuth } from "@react-native-firebase/auth";
import Background from "@/assets/images/quizBackground.png";
import { Ionicons } from "@expo/vector-icons";

// update spiritTrash in firestore
const updateSpiritTrash = async (spiritTrash: string) => {
  const uid = getAuth().currentUser?.uid;
  if (!uid) return;

  const db = getFirestore();
  const userRef = doc(db, "users", uid);
  const userSnapshot = await getDoc(userRef);
  if (!userSnapshot.exists) {
    console.error("User document does not exist");
  } else {
    updateDoc(userRef, { spiritTrash });
  }
};

const SpiritTrash = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isOptionsDisabled, setIsOptionsDisabled] = useState(true);
  const [scores, setScores] = useState({
    "Candy Wrapper": 0,
    "Chip Bag": 0,
    "Plastic Spork": 0,
    "Apple Core": 0,
    "Banana Peel": 0,
    "Tea Bag": 0,
    "Energy Drink Can": 0,
    "Lithium Ion Battery": 0,
    "Cardboard Box": 0,
  });
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);

  const questions = [
    {
      question: "How do you typically spend your free time?",
      answers: [
        {
          text: "Binge-watching TV shows",
          scores: { "Chip Bag": 3, "Candy Wrapper": 2 },
        },
        {
          text: "Reading in a cozy café",
          scores: { "Tea Bag": 3, "Cardboard Box": 2 },
        },
        {
          text: "High-intensity workouts",
          scores: { "Energy Drink Can": 4, "Banana Peel": 1 },
        },
        {
          text: "Tinkering with electronics",
          scores: { "Lithium Ion Battery": 3, "Plastic Spork": 2 },
        },
      ],
    },
    {
      question: "What's your approach to decision making?",
      answers: [
        {
          text: "Quick and practical",
          scores: { "Plastic Spork": 3, "Energy Drink Can": 2 },
        },
        {
          text: "Careful planning",
          scores: { "Cardboard Box": 3, "Lithium Ion Battery": 2 },
        },
        {
          text: "Go with the flow",
          scores: { "Banana Peel": 3, "Tea Bag": 2 },
        },
        {
          text: "Spontaneous and fun",
          scores: { "Candy Wrapper": 3, "Chip Bag": 2 },
        },
      ],
    },

    {
      question: "What best describes your energy level?",
      answers: [
        {
          text: "Consistently charged up",
          scores: { "Energy Drink Can": 3, "Lithium Ion Battery": 2 },
        },
        {
          text: "Steady and reliable",
          scores: { "Cardboard Box": 3, "Plastic Spork": 2 },
        },
        {
          text: "Natural and organic",
          scores: { "Apple Core": 3, "Banana Peel": 2 },
        },
        {
          text: "Peaks and valleys",
          scores: { "Candy Wrapper": 3, "Tea Bag": 2 },
        },
      ],
    },

    {
      question: "How would your friends describe your personality?",
      answers: [
        {
          text: "Sweet and fun-loving",
          scores: { "Candy Wrapper": 4, "Apple Core": 1 },
        },
        {
          text: "Practical and resourceful",
          scores: { "Cardboard Box": 3, "Plastic Spork": 2 },
        },
        {
          text: "Energetic and bold",
          scores: { "Energy Drink Can": 3, "Chip Bag": 2 },
        },
        {
          text: "Calm and grounding",
          scores: { "Tea Bag": 3, "Banana Peel": 2 },
        },
      ],
    },

    {
      question: "What's your ideal weekend activity?",
      answers: [
        {
          text: "Nature hike with healthy snacks",
          scores: { "Apple Core": 3, "Banana Peel": 2 },
        },
        {
          text: "Gaming marathon with friends",
          scores: { "Chip Bag": 3, "Energy Drink Can": 2 },
        },
        {
          text: "Going to an amusement park",
          scores: { "Cardboard Box": 3, "Lithium Ion Battery": 2 },
        },
        {
          text: "Viewing the sunset at a beach",
          scores: { "Tea Bag": 3, "Plastic Spork": 2 },
        },
      ],
    },
  ];

  // adds weight to spirit trash score for each question answered
  const handleAnswer = (answerScores) => {
    const newScores = { ...scores };
    Object.entries(answerScores).forEach(([spiritTrash, score]) => {
      newScores[spiritTrash] += score;
    });
    setScores(newScores);
    setIsOptionsDisabled(false);
    // proceed to next question, else if reached last question, show spirit trash result
    // if (currentQuestion < questions.length - 1) {
    //   setCurrentQuestion(currentQuestion + 1);
    // } else {
    //   setShowResult(true);
    // }
  };

  const handleNext = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setIsOptionsDisabled(true);
    } else {
      setShowResult(true);
    }
  };

  // compare each pair of [trash, score] to find the one with the highest score
  // a is the accumulator, b is the current pair being compared
  const getSpiritTrash = () => {
    return Object.entries(scores).reduce((a, b) => (b[1] > a[1] ? b : a))[0];
  };

  const getCategory = (trash) => {
    const categories = {
      Garbage: ["Candy Wrapper", "Chip Bag", "Plastic Spork"],
      Compost: ["Apple Core", "Banana Peel", "Tea Bag"],
      Recyclable: ["Energy Drink Can", "Lithium Ion Battery", "Cardboard Box"],
    };
    return (Object.entries(categories).find(([_, items]) =>
      items.includes(trash)
    ) as [string, string[]])[0];
  };

  const showNextButton = () => {
    if (!isOptionsDisabled) {
      const isLastQuestion = currentQuestion === questions.length - 1;
      return (
        <Pressable
          onPress={handleNext}
          className="w-[132px] rounded-xl bg-brightGreen py-2 flex flex-row 
          items-center justify-between px-3 shadow-sm border border-brightGreen2"
        >
          <Text className="text-mediumGreen font-semibold text-xl px-3">
            Next
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#008229" />
        </Pressable>
      );
    } else {
      return null;
    }
  };

  // if all questions have been completed, showResult is set to true
  // and calls getSpiritTrash() and getCategory()
  const spiritResult = showResult ? getSpiritTrash() : "";
  const spiritCategory = showResult ? getCategory(spiritResult) : "";

  useEffect(() => {
    if (showResult) {
      updateSpiritTrash(spiritResult);
    }
  }, [showResult]);

  useEffect(() => {
    setSelectedAnswerIndex(null);
  }, [currentQuestion]);

  return (
    <ImageBackground source={Background} style={{ flex: 1 }} resizeMode="cover">
      <SafeAreaView className="flex-1 items-center mt-40">
        <Stack.Screen
          options={{
            headerShadowVisible: false,
            headerBackVisible: false,
            headerTransparent: true,
            headerTitle: "",
          }}
        />

        {/* while there are questions to answer, show questions */}
        {!showResult ? (
          <View className="items-center justify-center w-4/5">
            <Text className="text-2xl text-center mt-12 mb-5 text-white font-semibold">
              {questions[currentQuestion].question}
            </Text>

            <View className="w-full">
              {questions[currentQuestion].answers.map((answer, index) => (
                <Pressable
                  key={index}
                  onPress={() => {
                    setSelectedAnswerIndex(index);
                    handleAnswer(answer.scores); // If needed here
                  }}
                >
                  {({ pressed }) => (
                    <View
                      className={`border border-brightGreen2 my-3 rounded-full py-2.5 ${selectedAnswerIndex === index
                          ? "bg-brightGreen4"
                          : "bg-primaryGreen"
                        }`}
                    >
                      <Text
                        className={`text-lg text-center p-2 ${selectedAnswerIndex === index
                            ? "text-mediumGreen"
                            : "text-white"
                          }`}
                      >
                        {answer.text}
                      </Text>
                    </View>
                  )}
                </Pressable>
              ))}

              {/* next button */}
              <View className="flex items-end mt-52">
              {showNextButton()}
              </View>
            </View>
          </View>
        ) : (
          // else, show spirit trash results
          <View className="h-screen items-center mt-16 w-4/5">
            <Text className="text-3xl text-center text-white font-semibold">
              Your spirit trash is...
            </Text>
            <View className="rounded-sm bg-white p-20 py-28 my-5">
              <Text>placeholder</Text>
            </View>
            <Text className="text-4xl font-bold my-3 text-white">
              {spiritResult}
            </Text>
            <Text className="text-xl text-center text-white">
              Category: {spiritCategory}
            </Text>

            <View className="w-full flex items-end mt-52">
              <Pressable
                className="w-[132px] rounded-xl bg-brightGreen py-2 flex flex-row 
    items-center justify-between px-3 shadow-sm border border-brightGreen2"
                onPress={() => router.replace("/(auth)/(tabs)/home")}
              >
                <Text className="text-mediumGreen font-semibold text-xl px-1">
                  Awesome
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#008229" />
              </Pressable>
            </View>
          </View>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

export default SpiritTrash;
