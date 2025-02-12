import BackButton from "@/components/Reusables/BackButton";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { View, Text, SafeAreaView } from "react-native";
import Accordion from "@/components/Reusables/Accordion";
const FAQ = () => {
  const q = [
    ["Question 1", "Answer 1"],
    ["Question 2", "Answer 2"],
    ["Question 3", "Answer 3"],
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
      <View>
        <Accordion questions={q} />
      </View>
    </SafeAreaView>
  );
};

export default FAQ;
