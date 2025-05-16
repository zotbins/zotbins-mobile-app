import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const handleQuiz = () => {
  router.push("/(auth)/quiz");
};

const DailyQuizWidget = () => {
  return (
    <View className="mb-3 shadow-sm">
      <LinearGradient
        colors={["#008229", "#DFFFE3", "#B4FABD", "#004C18"]}
        style={{
          padding: 1,
          borderRadius: 35,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="mb-4 shadow-lg"
        locations={[0.1, 0.5, 0.8, 1]}
      >
        <View
          style={{ borderRadius: 35 }}
          className="bg-lightBackground p-5 w-full"
        >
          <Text className="text-darkGreen text-2xl font-semibold mb-2">
            Daily Quiz
          </Text>
          <Text className="text-darkGreen text-lg font-normal">
            Can you recycle Styrofoam?
          </Text>
          <Text className="text-darkGreen text-lg font-normal">
            Find out here!
          </Text>
          <View className="flex-row items-center justify-end">
            <Pressable
              onPress={handleQuiz}
              className="bg-primaryGreen rounded-full p-3 px-6 border border-darkGreen"
            >
              <Text className="text-white font-semibold text-md">
                Start Quiz
              </Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default DailyQuizWidget;

const styles = StyleSheet.create({});
