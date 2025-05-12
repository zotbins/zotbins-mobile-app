import { getAuth } from "@react-native-firebase/auth";
import React from "react";
import { Image, ImageSourcePropType, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ZotBinsLogo from "../../assets/images/zotbins_logo.png";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import SimpleLogoSvg from "./SimpleLogoSVG";

interface HeaderProps {
  username: string;
}

const Header: React.FC<HeaderProps> = ({ username }) => {

  return (
      <View className="flex-col justify-between py-6 px-2">
        <SimpleLogoSvg width={100} height={50} />

        <Text className="text-darkGreen text-4xl font-bold mt-3">
          Hello, {username}!
        </Text>
      </View>
  );
};
export default Header;
