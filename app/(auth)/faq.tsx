import BackButton from "@/components/Reusables/BackButton";
import { Link, Stack } from "expo-router";
import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Accordion from "@/components/Reusables/Accordion";
import { LinearGradient } from "react-native-linear-gradient";

const FAQ = () => {
  // list of FAQ
  const questions = [
    [
      "What is ZotBins?",
      "ZotBins is a UCI club of undergraduate researchers passionate about technology-based zero waste management. We create smart waste bins (also dubbed ZotBins) that help classify your waste to facilitate proper disposal on campus!",
    ],
    ["What are 'smart' waste bins?", "Smart waste bins are bins that use technology to help classify waste. Our smart bins use computer vision to classify waste into categories like compost, recycling, and landfill."],
    ["What is the goal of ZotBins?", "We aim to lower waste diversion rates on campus by making waste disposal more interactive and educational. Our goal is to make waste disposal fun and easy for everyone!"],
    ["Where can I find the ZotBins?", "You can find our smart bins at the Java City near Donald Bren Hall and the Green Room near the Trevor School of the Arts. Our mobile app has a map feature that shows the navigation to the nearest ZotBin."],
    ["What does the ZotBins mobile app do?", "The ZotBins mobile app makes your waste disposal experience more interactive! You can scan your waste to get immediate feedback, earn points for proper disposal to compete with friends, and it tracks your environmental footprint!"],
    ["Will there be more ZotBins locations?", "Soon! We are working on expanding our smart bin locations to more areas on campus."],
    ["I have feedback for the website/mobile app, how do I reach out?", "We would love to hear your feedback! Reach out to us at zotbins@uci.edu!"],
    ["Who is ZotBins partnered with?", "We serve an active role in the sustainability community, as we are partnered with UCI Dining, UCI Earthreps, and the UCI Sustainability Resource Center."],
    ["How do I apply for a position at ZotBins?", "We have our recruitment in the Fall quarter. Keep an eye out for our recruitment posters and application links on our Instagram @zotbins!"],
    [
      "Unfortunately, I can't find what I'm looking for.",
      "Reach out to us at zotbins@uci.edu!",
    ],
  ];
  return (
    <LinearGradient
      colors={["#F5FFF5", "#DBFFD8"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1">
        <Stack.Screen
          options={{
            headerShadowVisible: false,
            headerBackVisible: false,
            headerTransparent: true,
            headerLeft: () => <BackButton />,
            headerTitle: "",
          }}
        />
        <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 45 }}
        >
          <View className="flex justify-center mt-16 px-6">
            <Text className="text-4xl font-bold text-darkGreen p-1">
              FAQ
            </Text>
            <Text className="p-1 text-darkGreen text-lg">
              Can't find your question? 
              Please email us at{" "} <Link href="mailto:zotbins@uci.edu" className="text-darkGreen font-semibold"> zotbins@uci.edu</Link> 
              , or checkout our socials: zotbins!
            </Text>
            <View className="border-b-2 border-darkGreen my-4" />
          </View>

          <Accordion questions={questions} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default FAQ;
