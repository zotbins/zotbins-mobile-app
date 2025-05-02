import React from "react";
import { View, Image, Pressable, ImageSourcePropType } from "react-native";
import BackButton from "@/components/Reusables/BackButton";
import ProfileBanner from "@/components/Profile/profile-banner.svg";

interface ProfileHeader {
  onBackPress: () => void;
  profilePic: string | ImageSourcePropType;
}

const ProfileHeader: React.FC<ProfileHeader> = ({
  onBackPress,
  profilePic,
}) => {
  const getImageSource = (source: string | ImageSourcePropType) => {
    if (typeof source === "string") {
      return { uri: source };
    }
    return source;
  };

  return (
    <View>
      <View className="w-11/12 flex flex-row justify-between items-baseline h-16 ml-[5%]">
        <Pressable onPress={onBackPress}>
          <BackButton />
        </Pressable>
      </View>

      <View className="flex justify-center items-center w-full">
        <View className="relative mb-5">
          <ProfileBanner />
          <View className="absolute left-0 right-0 bottom-3 flex items-center justify-center">
            <Image
              source={getImageSource(profilePic)}
              className="w-24 h-24 rounded-full"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProfileHeader;