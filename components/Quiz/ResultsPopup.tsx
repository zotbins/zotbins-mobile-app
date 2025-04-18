import React from "react";
import { View, Text, Pressable, TouchableWithoutFeedback, Dimensions } from "react-native";
import { Link } from "expo-router";
import ZotbinsLogo from "@/assets/images/zotbins_logo.svg";
import ShinyCard from "@/assets/icons/ShinyCard.svg";

interface ResultsPopupProps {
  score: number;
}

const ResultsPopup = ({ score }: ResultsPopupProps) => {
  const { width, height } = Dimensions.get('window');
  
  return (
    <View className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center shadow-xl" style={{ width, height, backgroundColor: 'rgba(255, 255, 255, 0.4)' }}>
      <View className="w-5/6 bg-[#F5FFF5] rounded-3xl p-8 items-center" style={{ elevation: 5, paddingVertical: 20 }}>
        <View className="w-80 h-80 relative mb-4 items-center justify-center">
          <ShinyCard width="100%" height="100%" />
          <View className="absolute inset-0 items-center justify-center">
            <ZotbinsLogo width={320} height={180} />
          </View>
        </View>

        <Text className="text-[#00762B] text-3xl font-bold text-center mb-2">
          You got {score} points from today's quiz!
        </Text>

        <Text className="text-black text-xl text-center mb-6">
          Keep doing the daily quizzes to earn more points
        </Text>

        <Link href="/home" asChild>
          <Pressable 
            className="items-center justify-center py-6 px-12 rounded-full bg-[#48BB78] border border-[#008E42] active:opacity-50"
            style={{ elevation: 2 }}
          >
            <Text className="text-white text-xl font-bold">Back to Home</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
};

export default ResultsPopup;