import { getAuth } from "@react-native-firebase/auth";
import { router, Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  View,
  Text,
  Alert,
  StatusBar,
  Image,
  ImageSourcePropType,
} from "react-native";
import { getFirestore, doc, getDoc } from "@react-native-firebase/firestore";
import BackButton from "@/components/Reusables/back-button.svg";
import SimpleLogoSvg from "@/components/Reusables/SimpleLogoSVG";
import { FontAwesome } from "@expo/vector-icons";
import LinearGradient from "react-native-linear-gradient";
import ProfileBanner from "@/components/Profile/profile-banner.svg";
import SpiritIcon from "@/components/Profile/spiritIcon.svg";
import StreakIcon from "@/components/Profile/streakIcon.svg";
import * as ImagePicker from "expo-image-picker";
import {
  getStorage,
  ref,
  getDownloadURL,
} from "@react-native-firebase/storage";

const Settings = () => {
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
      <LinearGradient colors={["#F5FFF5", "#DBFFD8"]} style={{ flex: 1 }}>
        <Stack.Screen options={{ headerShown: false }} />
        {/* <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerBackVisible: false,
          headerTransparent: true,
          headerLeft: () => <BackButton />,
          headerTitle: "",
        }}
      /> */}
        <SafeAreaView className="flex-1 px-5 gap-2 pb-24">
          <View className="flex justify-center items-center w-full">
            <View className="w-11/12 flex flex-row justify-between items-baseline h-16 ml-[5%]">
              <Pressable onPress={() => router.push("/(auth)/profile")}>
                <BackButton />
              </Pressable>

              {/* <Pressable onPress={() => router.push("/settings")}>
              <SettingsButton width={50} />
            </Pressable> */}
            </View>

            <View className="relative mb-5">
              <ProfileBanner />

              <View className="absolute left-0 right-0 bottom-3 flex items-center justify-center">
                <Pressable onPress={pickImage}>
                  <Image
                    source={getImageSource(profilePic)}
                    className="w-24 h-24 rounded-full"
                  />
                  <View className="absolute bottom-0 right-2 bg-mediumGreen rounded-full p-2">
                    <FontAwesome name="pencil" size={14} color="white" />
                  </View>
                </Pressable>
              </View>
            </View>
          </View>

          {/* <Pressable
            onPress={() => router.push("/envimpact")}
            className="bg-blue py-3 rounded-lg"
          >
            <Text className="text-white text-center">
              Check Environmental Impact
            </Text>
          </Pressable> */}

          {/* Friends container */}
          {/* <View className="pb-2">
          <Pressable
            onPress={() => router.push("/friendrequests")}
            className="bg-blue px-4 py-3 rounded-lg my-2 active:opacity-50"
          >
            <Text className="text-white text-center">Friend Requests</Text>
          </Pressable>
          <Text className="text-xl text-center font-bold">Friends</Text>
          {userDoc?.friendsList?.length > 0 ? (
            // TODO: Update types
            userDoc.friendsList.map((friend: any, index: number) => (
              <Text key={index} className="text-center">
                {friend}
              </Text>
            ))
          ) : (
            <Text className="text-center">No friends added yet!</Text>
          )}
        </View> */}

          {/* <Pressable
          onPress={() => router.push("/achievements")}
          className="bg-blue px-4 py-3 rounded-lg my-2 active:opacity-50"
        >
          <Text className="text-white text-center">Achievements</Text>
        </Pressable> */}

          <View className="flex justify-center items-center ">
            <Pressable
              //TODO ~ Link to email change page
              onPress={() => router.push("/emailchange")}
              className="bg-brightGreen py-4 rounded-full my-2 active:opacity-50 border border-green-500 w-9/12 mt-5"
            >
              <Text className="text-darkGreen text-center font-bold text-xl">
                Change Email
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/passwordchange")}
              className="bg-brightGreen py-4 rounded-full my-2 active:opacity-50 border border-green-500 w-9/12"
            >
              <Text className="text-darkGreen text-center font-bold text-xl">
                Change Password
              </Text>
            </Pressable>
            <Pressable
              onPress={() => router.replace("/(auth)/spirittrash")}
              className="bg-brightGreen py-4 rounded-full my-2 active:opacity-50 border border-green-500 w-9/12"
            >
              <Text className="text-darkGreen text-center font-bold text-xl">
                Retake Spirit Trash Quiz
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.replace("/faq")}
              className="bg-brightGreen py-4 rounded-full my-2 active:opacity-50 border border-green-500 w-9/12"
            >
              <Text className="text-darkGreen text-center font-bold text-xl">
                FAQ
              </Text>
            </Pressable>

            <Pressable
              onPress={() => getAuth().signOut()}
              className="bg-primaryGreen py-4 rounded-full my-2 active:opacity-50 border border-green-500 w-2/5 mt-5"
            >
              <Text className="text-white text-center font-bold text-xl">
                Sign Out
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
};

export default Settings;