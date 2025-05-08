import { View, Text, Image, Pressable } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Colors from "@/constants/Colors";
import { Redirect, useRouter } from "expo-router";
import ZotbinsLogo from "../assets/images/zotbins_logo.png";
import "../global.css";
import { currentUser } from "./_layout";
import SplashScreenImage from "../assets/images/splash-screen.png";

const Index = () => {

  return (
    <View>
      <Image 
        source={SplashScreenImage} 
        resizeMode="contain"
      />
    </View>
  );
};

export default Index;
