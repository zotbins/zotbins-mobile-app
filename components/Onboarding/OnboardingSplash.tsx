import React from "react";
import { ScrollView, Text, Image, View, SafeAreaView } from "react-native";
import LogoAnimation from "@/components/Onboarding/LogoAnimation";

const OnboardingSplash = () => {
  return (
    <View style = {{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
      </ScrollView>

      <LogoAnimation>
      </LogoAnimation>
    </View>
  );
};

export default OnboardingSplash;
