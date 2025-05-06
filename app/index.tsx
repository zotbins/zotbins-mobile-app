import { View, Text, Image, Pressable } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Colors from "@/constants/Colors";
import { Redirect, useRouter } from "expo-router";
import ZotbinsLogo from "../assets/images/zotbins_logo.png";
import "../global.css";
import { currentUser } from "./_layout";
import * as SplashScreen from 'expo-splash-screen';
import SplashScreenImage from "../assets/images/splash-screen.png";
import { useUserContext } from "@/context/UserProvider";

SplashScreen.preventAutoHideAsync();
const Home = () => {
  const router = useRouter();
  const { userDoc, initializing } = useUserContext();
  
  
  useEffect(() => {
    const hideSplashScreen = async () => {
      if (!initializing) {
        await SplashScreen.hideAsync();
        console.log("Splash screen hidden");
      }
    };
    hideSplashScreen();
  }, [initializing]);

  useEffect(() => {

    if (!initializing) {
      if (!userDoc) {
        router.push("/login");
      } else {
        router.push("/(auth)/(tabs)/home");
      }
    }
  }, [ router, userDoc]);

  return (
    <View>
      <Image 
        source={SplashScreenImage} 
        resizeMode="contain"
      />
    </View>
  );
};

export default Home;