import { View, Image } from "react-native";
import React from "react";
import "../global.css";
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
