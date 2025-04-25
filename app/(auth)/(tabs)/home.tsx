import { View, Text, Pressable, Button, ScrollView } from "react-native";
import React, { useEffect } from "react";
import { Link, Stack } from "expo-router";
import Header from "@/components/Reusables/Header";
import { getAuth } from "@react-native-firebase/auth";
import { useUserContext } from "@/context/UserProvider";
import { LinearGradient } from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import ScanWidget from "@/components/Home/ScanWidget";
import DailyQuizWidget from "@/components/Home/DailyQuizWidget";
import MissionsWidget from "@/components/Home/MissionsWidget";
import QuizData from "@/data/QuizData";
import EnvImpactPreview from "@/components/Reusables/EnvImpactPreview";

const Home = () => {
  const { userDoc } = useUserContext();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <LinearGradient
        colors={["#F5FFF5", "#DBFFD8"]}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 45 }}
          showsVerticalScrollIndicator={false}
          >
          <SafeAreaView className="flex-1 px-5 gap-2 pb-24">
            <Header username={userDoc?.username || "User"} />
            <EnvImpactPreview />
            <ScanWidget scans={3 - userDoc?.dailyScans || 0} />
            <DailyQuizWidget />

            <MissionsWidget />


          </SafeAreaView>
        </ScrollView>


      </LinearGradient>
    </>
  );
};

export default Home;
