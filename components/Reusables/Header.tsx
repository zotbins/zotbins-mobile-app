import { getAuth } from "@react-native-firebase/auth";
import React from "react";
import { Image, ImageSourcePropType, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ZotBinsLogo from "../../assets/images/zotbins_logo.png";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

interface HeaderProps {
  streak: number;
}

const Header: React.FC<HeaderProps> = ({ streak }) => {
  const user = getAuth().currentUser;


  return (
      <View className="flex-col justify-between px-5 py-4">
        <Image
          source={ZotBinsLogo}
          resizeMode="contain"
          className="h-10 w-10"
        />

        <Text>
          Hello, {user?.displayName}!
        </Text>
      </View>
  );
};
export default Header;
