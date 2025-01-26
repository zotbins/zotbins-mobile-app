import auth from "@react-native-firebase/auth";
import React from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ZotBinsLogo from "../../assets/images/zotbins_logo.png";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

interface HeaderProps {
  streak: number;
}

const Header: React.FC<HeaderProps> = ({ streak }) => {
  const user = auth().currentUser;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row justify-between items-center h-[70] px-5">
        <Image
          source={ZotBinsLogo}
          resizeMode="contain"
          className="h-10 w-10"
        />

        <View className="flex-row items-center">
          <Text className="mr-1 text-[#fc8803] text-sm">{streak}</Text>
          <FontAwesome5
            name="fire"
            size={10}
            color="#fc8803"
            className="mr-2"
          />
          <Image
            source={{
              uri: user?.photoURL || "https://via.placeholder.com/250",
            }}
            className="h-12 w-12 rounded-full"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default Header;
