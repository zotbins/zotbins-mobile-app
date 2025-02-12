import BackButton from "@/components/Reusables/BackButton";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import Accordion from "@/components/Reusables/Accordion";
const FAQ = () => {
  // list of FAQ
  const questions = [
    [
      "What is ZotBins?",
      "ZotBins is an independent group of undergraduate researchers passionate about technology-based zero waste management.",
    ],
    ["Question 2", "Answer 2"],
    ["Question 3", "Answer 3"],
    ["Question 4", "Answer 4"],
    ["Question 5", "Answer 5"],
    ["Question 6", "Answer 6"],
    ["Question 7", "Answer 7"],
    ["Question 8", "Answer 8"],
    ["Question 9", "Answer 9"],
    [
      "Unfortunately, I can't find what I'm looking for.",
      "Reach out to us at zotbins@uci.edu!",
    ],
  ];
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerBackVisible: false,
          headerTransparent: true,
          headerLeft: () => <BackButton />,
          headerTitle: "",
        }}
      />
      <ScrollView>
        <View className="flex justify-center items-center">
          <Text className="text-3xl font-bold text-center p-2 text-tintColor">
            Frequently Asked Questions
          </Text>
          {/* TODO: make zotbins.org and zotbins@uci.edu pressable links */}
          <Text className="text-center p-8">
            Can't find what you're looking for? Visit zotbins.org or send us a
            message at zotbins@uci.edu!
          </Text>
        </View>
        <Accordion questions={questions} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default FAQ;
