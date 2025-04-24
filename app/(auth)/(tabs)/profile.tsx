import { useUserContext } from "@/context/UserProvider"
import {
  getStorage,
  ref,
  getDownloadURL,
} from "@react-native-firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import LinearGradient from "react-native-linear-gradient";
import Header from "@/components/Reusables/Header";
import SimpleLogoSvg from "@/components/Reusables/SimpleLogoSVG";
import SettingsButton from "@/components/Profile/settingsButton.svg";
import ProfileBanner from "@/components/Profile/profile-banner.svg";
import SpiritIcon from "@/components/Profile/spiritIcon.svg";
import StreakIcon from "@/components/Profile/streakIcon.svg";
import StatusBar from "@/components/Profile/statusBar.svg";
import AddFriendsIcon from "@/components/Profile/friendsIcon.svg";
import FriendIcons from "@/components/Profile/friendIcons";
import XPBar from "@/components/Profile/XPBar";
import Achievements from "../achievements";
import EnvImpactPreview from "@/components/Reusables/EnvImpactPreview";

const Profile = () => {
  const router = useRouter();
  const { user, userDoc } = useUserContext();
  
  // user document data
  const level = userDoc?.level ?? 1;
  const xp = userDoc?.xp ?? 0;
  const requiredXP = 50 * level;
  const streak = userDoc?.dailyStreak ?? 0;
  const spiritTrash = userDoc?.spiritTrash ?? 0;

  // set profile picture to user's photoURL or placeholder image
  const [profilePic, setProfilePic] = useState<string | ImageSourcePropType>(
    user?.photoURL || require("@/assets/images/default_profile_picture.png")
  );

  const getImageSource = (source: string | ImageSourcePropType) => {
    if (typeof source === "string") {
      return { uri: source };
    }
    return source;
  };

  // request permission to access camera roll
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Sorry, we need camera roll permissions to add a profile picture!"
      );
    }
  };

  // pick image from camera roll, upload to firebase storage, and set user photoURL to storage URL
  const pickImage = async () => {
    requestPermission();

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0,
    });

    if (!result.canceled && result.assets) {
      const selectedImageUri = result.assets[0].uri;
      const uid = user?.uid;

      if (!uid) {
        return;
      }

      const storage = getStorage();
      const storageRef = ref(storage, `zotzero-user-profile-pics/${uid}`);
      const uploadTask = storageRef.putFile(selectedImageUri);

      uploadTask.on(
        "state_changed",
        () => { },
        (error) => {
          console.error(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(storageRef);
          user?.updateProfile({ photoURL: downloadURL });
          setProfilePic(downloadURL);
        }
      );
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <LinearGradient colors={["#F5FFF5", "#DBFFD8"]} style={{ flex: 1 }}>
        <SafeAreaView className="flex-1 px-5 gap-2">
          <ScrollView
            showsVerticalScrollIndicator={false}
          >
            <View className="flex justify-center items-center w-full">
              <View className="w-11/12 flex flex-row justify-between items-baseline h-16">
                <SimpleLogoSvg width={100} height={100} />

                <Pressable onPress={() => router.push("/settings")}>
                  <SettingsButton width={50} />
                </Pressable>
              </View>

              <View className="relative mb-5">
                <ProfileBanner />
                <View className="absolute left-0 right-0 bottom-3 flex items-center justify-center">
                  <Pressable onPress={pickImage}>
                    <Image
                      source={getImageSource(profilePic)}
                      className="w-24 h-24 rounded-full"
                    />
                    <View className="absolute bottom-0 right-2 bg-primaryGreen rounded-full p-2">
                      <FontAwesome name="pencil" size={14} color="white" />
                    </View>
                  </Pressable>
                </View>
                <View className="absolute left-24 top-24">
                  <Pressable onPress={() => router.push("/friendrequests")}>
                    <AddFriendsIcon />
                  </Pressable>
                </View>
                <FriendIcons />
              </View>

              <View className="w-[95%] shadow-sm">
                <LinearGradient
                  colors={["#018029", "#DFFFE3", "#b4fabd", "#004c18"]}
                  style={{
                    padding: 1,
                    borderRadius: 35,
                  }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="mb-4 shadow-lg"
                  locations={[0, 0.1, 0.9, 1]}
                >
                  <View className="bg-lightBackground rounded-full py-2 flex flex-row items-center justify-between">
                    <View className="flex flex-col items-center w-1/4 pl-4">
                      <SpiritIcon />
                      <Text className="font-medium text-xs text-mediumGreen text-center">
                        {spiritTrash}
                      </Text>
                    </View>

                    <View className="flex flex-col items-center w-2/4 gap-y-1">
                      <Text className="font-semibold text-mediumGreen">
                        Level {level}
                      </Text>

                      <XPBar xp={xp} requiredXP={requiredXP} />

                      <Text className="text-[9px] text-center text-mediumGreen font-light">
                        {xp}/{requiredXP} XP to reach Level {level + 1}
                      </Text>
                    </View>

                    <View className="flex flex-col items-center w-1/4">
                      <View className="flex flex-row items-center gap-x-1">
                        <Text className="text-mediumGreen font-light text-sm">
                          {streak}
                        </Text>
                        <StreakIcon />
                      </View>
                      <Text className="font-medium text-xs text-mediumGreen">
                        Streak
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            </View>

            <EnvImpactPreview />
            <View className="flex flex-row items-center ml-6 mb-4">
              <Text className="text-xl font-bold text-primaryGreen">Achievements</Text>
              <Text className="text-sm text-primaryGreen underline ml-2">See all</Text>
            </View>
            <Achievements />
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
};

export default Profile;
