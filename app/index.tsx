import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { Redirect, useRouter } from "expo-router";
import ZotbinsLogo from "../assets/images/zotbins_logo.png";
import "../global.css";
import { currentUser } from "./_layout";

const Home = () => {
  const router = useRouter();

  const goToOnboarding = () => {
    router.push("/onboarding");
  };

  const goToLogin = () => {
    router.push("/login");
  };
  if (!currentUser) {
    return <Redirect href="/login" />;
  } else {
      return <Redirect href="/(auth)/(tabs)/home" />;
  }
};

export default Home;