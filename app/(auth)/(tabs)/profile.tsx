import { getAuth } from "@react-native-firebase/auth";
import { getFirestore, doc, getDoc } from "@react-native-firebase/firestore";
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

const Profile = () => {
  const router = useRouter();

  const user = getAuth().currentUser;
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

  const [userDoc, setUserDoc] = useState<any>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // on user change, fetch user document from firestore
  useEffect(() => {
    const fetchUserDoc = async () => {
      const uid = user?.uid;
      if (!uid) {
        return;
      }

      try {
        const db = getFirestore();
        const userDocRef = doc(db, "users", uid);
        const userDocSnap = await getDoc(userDocRef);
        if (!userDocSnap.exists) {
          throw new Error("User document does not exist");
        }
        setUserDoc(userDocSnap.data());
      } catch (error) {
        console.error("Error fetching user document: ", error);
        Alert.alert("Error", "Failed to fetch user document");
      }
    };

    fetchUserDoc();
  });

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
        () => {},
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
        <SafeAreaView className="flex justify-center items-center w-full">
          <View className="w-11/12 flex flex-row justify-between items-baseline bg-rose-200 h-14">
            <SimpleLogoSvg width={100} height={100} />
            <SettingsButton width={50} />
          </View>

          <View className="relative mb-5">
            <ProfileBanner />
            <View className="absolute left-0 right-0 bottom-3 flex items-center justify-center">
              <Pressable onPress={pickImage}>
                {/* <Image
                  source={{ uri: profilePic }}
                  className="w-24 h-24 rounded-full"
                /> */}
                <Image
                  source={getImageSource(profilePic)}
                  className="w-24 h-24 rounded-full"
                />
                <View className="absolute bottom-0 right-0 bg-mediumGreen rounded-full p-2">
                  <FontAwesome name="pencil" size={14} color="white" />
                </View>
              </Pressable>
            </View>
          </View>

          <View
            style={{ borderRadius: 35 }}
            className="bg-lightBackground flex flex-row items-center justify-between w-10/12 py-2 border"
          >
            <View className="flex flex-col items-center">
              <SpiritIcon />
              <Text>Spirit Trash</Text>
            </View>
            <View className="flex flex-col items-center">
              <Text>Level 4</Text>
              <Text className="text-xs">20/100 XP to reach Level 5</Text>
            </View>
            <View className="flex flex-col items-center">
              <View className="flex flex-row items-center gap-x-1">
                <Text>16</Text>
                <StreakIcon />
              </View>

              <Text>Streak</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
};

export default Profile;
