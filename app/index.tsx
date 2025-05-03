import { View, Text, Image, Pressable } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Colors from "@/constants/Colors";
import { Redirect, useRouter } from "expo-router";
import ZotbinsLogo from "../assets/images/zotbins_logo.png";
import "../global.css";
import { currentUser } from "./_layout";
import * as SplashScreen from 'expo-splash-screen';
import SplashScreenImage from "../assets/images/splash-screen.png";

SplashScreen.preventAutoHideAsync();
const Home = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const router = useRouter();
  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);
  
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  useEffect(() => {

    if (appIsReady) {
      if (!currentUser) {
        router.push("/login");
      } else {
        router.push("/(auth)/(tabs)/home");
      }
    }
  }, [appIsReady, currentUser, router]);

  return (
    <View onLayout={onLayoutRootView}>
      <Image 
        source={SplashScreenImage} 
        resizeMode="contain"
      />
    </View>
  );
};

export default Home;