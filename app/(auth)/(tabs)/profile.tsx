import PasswordChange from "@/components/Profile/PasswordChange";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

const Profile = () => {
  const router = useRouter();

  const user = auth().currentUser;
  // set profile picture to user's photoURL or placeholder image
  const [profilePic, setProfilePic] = useState<string>(
    user?.photoURL || "https://placehold.co/250"
  );

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
        const userDocRef = firestore().collection("users").doc(uid);
        const userDocSnap = await userDocRef.get();
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
  }, [user]);

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

      const storageRef = storage().ref(`zotzero-user-profile-pics/${uid}`);
      const uploadTask = storageRef.putFile(selectedImageUri);

      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          console.error(error);
        },
        async () => {
          const downloadURL = await storageRef.getDownloadURL();
          user?.updateProfile({ photoURL: downloadURL });
          setProfilePic(downloadURL);
        }
      );
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView className="bg-white flex-1">
        {/* Above Divider */}
        <View className="p-4">
          <View className="flex-row items-center">
            <View className="relative">
              <Pressable onPress={pickImage}>
                <Image
                  source={{ uri: profilePic }}
                  className="w-24 h-24 rounded-full"
                />
                <View className="absolute bottom-0 right-0 bg-gray-800 rounded-full p-2">
                  <FontAwesome name="pencil" size={14} color="white" />
                </View>
              </Pressable>
            </View>
            <View className="flex-1 ml-4">
              <Text className="text-3xl">@{userDoc?.username}</Text>
              <Text className="text-black">Points: {userDoc?.totalPoints}</Text>
            </View>
            <Text className="mr-1 text-[#fc8803] text-lg">
              {userDoc?.dailyStreak}
            </Text>
            <FontAwesome5
              name="fire"
              size={12}
              color="#fc8803"
              className="mr-2"
            />
          </View>
        </View>

        {/* Profile Divider */}
        <View className="w-full h-[1px] bg-gray-300 my-4" />

        {/* Below Divider */}
        <View className="flex-1 p-4">
          <View className="flex-row justify-between items-center mb-4">
            <View className="items-center">
              <Text className="text-black text-lg font-bold">Footprint</Text>
              <Text className="text-black">{userDoc?.footprint}</Text>
            </View>
            <View className="items-center">
              <Text className="text-black text-lg font-bold">Spirit Trash</Text>
              <Text className="text-black">{userDoc?.spiritTrash}</Text>
            </View>
          </View>

          <Pressable 
            onPress={() => router.push("/envimpact")}
            className="bg-blue py-3 rounded-lg">
            <Text className="text-white text-center">Check Environmental Impact</Text>
          </Pressable>

          {/* Friends container */}
          <View className="pb-2">
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
              <Text>No friends added yet!</Text>
            )}
          </View>

          <Pressable
            onPress={() => router.push("/achievements")}
            className="bg-blue px-4 py-3 rounded-lg my-2 active:opacity-50"
          >
            <Text className="text-white text-center">Achievements</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/faq")}
            className="bg-blue px-4 py-3 rounded-lg my-2 active:opacity-50"
          >
            <Text className="text-white text-center">FAQ</Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace("/(auth)/spirittrash")}
            className="bg-blue px-4 py-3 rounded-lg my-2 active:opacity-50"
            >
              <Text className="text-white text-center">Retake Spirit Trash Quiz</Text>
          </Pressable>

          <Pressable
            onPress={() => auth().signOut()}
            className="bg-blue px-4 py-3 rounded-lg my-2 active:opacity-50"
          >
            <Text className="text-white text-center">Sign Out</Text>
          </Pressable>

          {/* Conditionally render the PasswordChange form */}
          <Pressable
            onPress={() => setShowPasswordForm(!showPasswordForm)}
            className="bg-blue px-4 py-3 rounded-lg my-2 active:opacity-50"
          >
            <Text className="text-white text-center">
              {showPasswordForm ? "Cancel Password Change" : "Change Password"}
            </Text>
          </Pressable>
          {showPasswordForm && (
            <PasswordChange onComplete={() => setShowPasswordForm(false)} />
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

export default Profile;
