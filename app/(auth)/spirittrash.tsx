import { Pressable, StyleSheet, Text, SafeAreaView, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { router, Stack } from 'expo-router'
import { useState } from 'react'

const SpiritTrash = () => {

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState({
    "Candy Wrapper": 0,
    "Chip Bag": 0,
    "Plastic Spork": 0,
    "Apple Core": 0,
    "Banana Peel": 0,
    "Tea Bag": 0,
    "Energy Drink": 0,
    "Lithium Battery": 0,
    "Cardboard Box": 0
  });

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
          text:"Carefully planned and organized",
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
          text:"DIY projects",
          scores:{ 'Cardboard Box': 3, 'Lithium Ion Battery': 2 }
        },
        {
          text:"Relaxing picnic",
          scores:{ 'Tea Bag': 3, 'Plastic Spork': 2 }
        }
      ]
    }
  ]

  const handleAnswer = () =>{
    setCurrentQuestion(currentQuestion + 1);
  }


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

      <View className='items-center justify-center bg-purple-200 w-5/6'>
        <Text className='text-3xl'>Spirit Trash Quiz</Text>

        <Text className='text-xl my-3'>Question {currentQuestion + 1} of {questions.length}</Text>

        <Text className="text-2xl text-center my-3">{questions[currentQuestion].question}</Text>

        <View className=''>

          {questions[currentQuestion].answers.map((answer, index) => 
            (<TouchableOpacity 
              key={index} 
              className="border-2 rounded-3xl border-green-600 bg-tintColor my-2 text-2xl px-4 text-center"
              onPress={()=> handleAnswer}>
              <Text className="text-2xl p-2 text-center">{answer.text}</Text>
            </TouchableOpacity>
          ))}

        </View>

      </View>
        

    </SafeAreaView>
  )
}

export default SpiritTrash
