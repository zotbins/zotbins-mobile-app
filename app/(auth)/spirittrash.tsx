import { Pressable, StyleSheet, Text, SafeAreaView, View, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { router, Stack } from 'expo-router'
import { useState } from 'react'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

// update spiritTrash in firestore
const updateSpiritTrash = async (spiritTrash: string) => {
  const uid = auth().currentUser?.uid;
  if (!uid) return;

  await firestore()
    .collection("users")
    .doc(uid)
    .update({ spiritTrash });
}

const SpiritTrash = () => {

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({
    "Candy Wrapper": 0,
    "Chip Bag": 0,
    "Plastic Spork": 0,
    "Apple Core": 0,
    "Banana Peel": 0,
    "Tea Bag": 0,
    "Energy Drink Can": 0,
    "Lithium Ion Battery": 0,
    "Cardboard Box": 0
  });
  const [showResult, setShowResult] = useState(false);

  const questions = [
    { question: "How do you typically spend your free time?",
      answers: [
        {
          text:"Binge-watching TV shows",
          scores:{ 'Chip Bag': 3, 'Candy Wrapper': 2 }
        },
        {
          text:"Reading in a cozy café",
          scores: { 'Tea Bag': 3, 'Cardboard Box': 2 }
        },
        {
          text:"High-intensity workouts",
          scores:{ 'Energy Drink Can': 4, 'Banana Peel': 1 }
        },
        {
          text:"Tinkering with electronics",
          scores:{ 'Lithium Ion Battery': 3, 'Plastic Spork': 2 }
        }
      ]
    },
    { question: "What's your approach to decision making?",
      answers: [
        {
          text:"Quick and practical",
          scores:{ 'Plastic Spork': 3, 'Energy Drink Can': 2 }
        },
        {
          text:"Careful planning",
          scores:{ 'Cardboard Box': 3, 'Lithium Ion Battery': 2 }
        },
        {
          text:"Go with the flow",
          scores:{ 'Banana Peel': 3, 'Tea Bag': 2 }
        },
        {
          text:"Spontaneous and fun",
          scores: { 'Candy Wrapper': 3, 'Chip Bag': 2 }
        }
      ]
    },

    { question: "What best describes your energy level?",
      answers: [
        {
          text:"Consistently charged up",
          scores:{ 'Energy Drink Can': 3, 'Lithium Ion Battery': 2 }
        },
        {
          text:"Steady and reliable",
          scores:{ 'Cardboard Box': 3, 'Plastic Spork': 2 }
        },
        {
          text:"Natural and organic",
          scores:{ 'Apple Core': 3, 'Banana Peel': 2 }
        },
        {
          text:"Peaks and valleys",
          scores: { 'Candy Wrapper': 3, 'Tea Bag': 2 }
        }
      ]
    },

    { question: "How would your friends describe your personality?",
      answers: [
        {
          text:"Sweet and fun-loving",
          scores:{ 'Candy Wrapper': 4, 'Apple Core': 1 }
        },
        {
          text:"Practical and resourceful",
          scores:{ 'Cardboard Box': 3, 'Plastic Spork': 2 }
        },
        {
          text:"Energetic and bold",
          scores:{ 'Energy Drink Can': 3, 'Chip Bag': 2 }
        },
        {
          text:"Calm and grounding",
          scores:{ 'Tea Bag': 3, 'Banana Peel': 2 }
        }
      ]
    },

    { question: "What's your ideal weekend activity?",
      answers: [
        {
          text:"Nature hike with healthy snacks",
          scores:{ 'Apple Core': 3, 'Banana Peel': 2 }
        },
        {
          text:"Gaming marathon with friends",
          scores:{ 'Chip Bag': 3, 'Energy Drink Can': 2 }
        },
        {
          text:"Going to an amusement park",
          scores:{ 'Cardboard Box': 3, 'Lithium Ion Battery': 2 }
        },
        {
          text:"Viewing the sunset at a beach",
          scores:{ 'Tea Bag': 3, 'Plastic Spork': 2 }
        }
      ]
    }
  ]

  // adds weight to spirit trash score for each question answered
  const handleAnswer = (answerScores) => {
    const newScores = {...scores};
    Object.entries(answerScores).forEach(([spiritTrash, score]) => {
        newScores[spiritTrash] += score;
      }
    );
    setScores(newScores);

    // proceed to next question, else if reached last question, show spirit trash result
    if(currentQuestion < questions.length - 1){ 
      setCurrentQuestion(currentQuestion + 1);
    }
    else{
      setShowResult(true);
    }
  }


  // compare each pair of [trash, score] to find the one with the highest score
  // a is the accumulator, b is the current pair being compared
  const getSpiritTrash = () => {
    return Object.entries(scores).reduce((a, b) => (b[1] > a[1] ? b : a))[0];
  }

  const getCategory = (trash) => {
    const categories = {
      'Garbage': ['Candy Wrapper', 'Chip Bag', 'Plastic Spork'],
      'Compost': ['Apple Core', 'Banana Peel', 'Tea Bag'],
      'Recyclable': ['Energy Drink Can', 'Lithium Ion Battery', 'Cardboard Box']
    };
    return Object.entries(categories).find(([_, items]) => items.includes(trash))[0];
  };


  // if all questions have been completed, showResult is set to true
  // and calls getSpiritTrash() and getCategory()
  const spiritResult = showResult ? getSpiritTrash() : '';
  const spiritCategory = showResult ? getCategory(spiritResult) : '';

  useEffect(() => {
    if (showResult) {
      updateSpiritTrash(spiritResult);
    }
  }, [showResult]);

  return (
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
        <View className='items-center justify-center w-5/6'>
          <Text className='text-3xl'>Spirit Trash Quiz</Text>
          <Text className='text-xl my-3'>Question {currentQuestion + 1} of {questions.length}</Text>
          <Text className="text-2xl text-center my-3">{questions[currentQuestion].question}</Text>
          
          <View className='w-4/5'>
            {questions[currentQuestion].answers.map((answer, index) => (
              <Pressable 
                key={index} 
                className="border-2 rounded-3xl border-green-600 bg-tintColor my-2 text-2xl"
                onPress={() => handleAnswer(answer.scores)}
              >
                <Text className="text-2xl text-center p-2">{answer.text}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) 
      : 
      // else, show spirit trash results
      (

          <View className='h-screen items-center mt-40 w-5/6'>
            <Text className='text-3xl text-center'>Your spirit trash is...</Text>
            <Text className='text-4xl font-bold my-4'>{spiritResult}!</Text>
            <Text className='text-xl text-center'>Category: {spiritCategory}</Text>
            <Pressable className="border-2 rounded-3xl border-green-600 bg-tintColor my-2 text-2xl px-5"
              onPress={() => router.replace("/(auth)/(tabs)/home")}>
              <Text className="text-2xl text-center text-black">Back to Home</Text>
            </Pressable>
          </View>

      )}        

    </SafeAreaView>
  )
}

export default SpiritTrash
