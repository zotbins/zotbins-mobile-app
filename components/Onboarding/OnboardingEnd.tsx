import {
  View,
  Text,
  Pressable,
  Image,
} from "react-native";
import React from "react";
import { useRouter, Link } from "expo-router";
import Zotbins from "@/assets/images/zotbins_logo.png"

interface OnboardingEndProps {
  onNext?: () => void;
}

const OnboardingEnd: React.FC<OnboardingEndProps> = ({ onNext }) => {
  const router = useRouter();

  const handleSignUp = () => {
    if (onNext) {
      onNext();
    }
    router.push("/signup");
  };

  return (
    <View className="flex-1 items-center justify-center px-5">
      <Text className="text-[36px] font-bold text-mediumGreen text-center mb-8">
        Get Started With{"\n"}Sustainability Today!
      </Text>
      
      <View className="justify-center items-center my-6">
        <Image
          source={Zotbins}
          className="w-80 h-80"
          resizeMode="contain"
        />
      </View>

      <Pressable
        className="bg-lightestGreen py-4 px-16 rounded-full mt-8 mb-5 shadow-md active:opacity-80 border border-mediumGreen"
        onPress={handleSignUp}
      >
        <Text className="text-mediumGreen text-xl font-semibold">Sign up</Text>
      </Pressable>
      
      <View className="flex-row mb-5">
        <Text className="text-base text-darkestGreen font-bold">Already have an account? </Text>
        <Link href="/login" className="text-base text-blue font-semibold underline">
          Login
        </Link>
      </View>
      
    </View>
  );
};

export default OnboardingEnd;