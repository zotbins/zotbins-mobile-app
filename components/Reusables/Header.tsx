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

  const getImageSource = (source: string | ImageSourcePropType) => {
    if (typeof source === 'string') {
      return { uri: source };
    }
    return source;
  };

  const profilePicSource = user?.photoURL || require("@/assets/images/default_profile_picture.png");

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
            source={getImageSource(profilePicSource)}
            className="h-12 w-12 rounded-full"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default Header;
