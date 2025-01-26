import PasswordChange from "@/components/PasswordChange";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";

const Profile = () => {
  const router = useRouter();

  const user = auth().currentUser;
  // set profile picture to user's photoURL or placeholder image
  const [profilePic, setProfilePic] = useState<string>(
    user?.photoURL || "https://via.placeholder.com/250"
  );

  const [userDoc, setUserDoc] = useState<any>(null);
  // const [username, setUsername] = useState("");
  // const [loading, setLoading] = useState(true);
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
        () => { },
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
              <Text className="text-black text-lg font-bold">{user?.email}</Text>
              <Text className="text-black">Points: {userDoc?.totalPoints}</Text>
            </View>
            <Text className="text-black text-lg font-bold">
              Streak: {userDoc?.dailyStreak}
            </Text>
          </View>
        </View>

        <View className="w-full h-[1px] bg-gray-300 my-4" />

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
            onPress={() => auth().signOut()}
            className="bg-blue px-4 py-3 rounded-lg my-2 active:opacity-50"
          >
            <Text className="text-white text-center">Sign Out</Text>

      <View className="bg-white h-screen w-screen">
        {/* container for profile photo, username, and full name */}
        <View className="bg-teal pt-24 items-center">
          <Image
            source={{ uri: profilePic }}
            className="mb-3 w-36 h-36 rounded-full"
          />

          {/* <Text className="text-3xl">@{user?.email?.split('@')[0]}</Text> */}
          <Text className="text-3xl">@{userDoc?.username}</Text>
          {/* parse email to create a username from username@gmail.com  */}
          <Text className="text-xl pb-4">
            {userDoc?.firstname} {userDoc?.lastname}
          </Text>
        </View>

        {/* socials container */}
        <View className="bg-tealLite pt-10 justify-center items-center">
          <Pressable
            onPress={() => router.push("/friendrequests")}
            className="bg-tealMed px-4 py-3 rounded-lg my-2 active:opacity-50 w-1/2"
          >
            <Text className="text-white text-center">Friend Requests</Text>
          </Pressable>
          <Text className="text-xl font-bold">Friends</Text>
          <Text className="text-center">{userDoc?.friendsList}</Text>
        </View>

        {/* view container for change profile, password, sign out */}
        <View className="bg-tealLite flex-1 justify-center items-center">
          <Pressable
            onPress={pickImage}
            className="bg-tealMed px-4 py-3 rounded-lg my-2 active:opacity-50 w-1/2"
          >
            <Text className="text-white text-center">
              Change Profile Picture
            </Text>

          </Pressable>

          <Pressable
            onPress={() => setShowPasswordForm(!showPasswordForm)}
            className="bg-blue px-4 py-3 rounded-lg my-2 active:opacity-50"
          >
            <Text className="text-white text-center">
              {showPasswordForm ? "Cancel Password Change" : "Change Password"}
            </Text>
          </Pressable>

          {/* Conditionally render the PasswordChange form */}
          {showPasswordForm && (
            <PasswordChange onComplete={() => setShowPasswordForm(false)} />
          )}

        </View>
      </SafeAreaView>

          <Pressable
            onPress={() => auth().signOut()}
            className="bg-tealMed px-4 py-3 rounded-lg my-2 active:opacity-50 w-1/2"
          >
            <Text className="text-white text-center">Sign Out</Text>
          </Pressable>
        </View>
      </View>

    </>
  );
};

export default Profile;
