import PasswordChange from "@/components/PasswordChange";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";

const Profile = () => {

  const user = auth().currentUser;
  // set profile picture to user's photoURL or placeholder image
  const [profilePic, setProfilePic] = useState<string>(
    user?.photoURL || "https://via.placeholder.com/250"
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
      <View className="bg-white h-screen w-screen">

        {/* container for profile photo, username, and full name */}
        <View className="bg-teal pt-24 items-center"> 
          
          <Image
            source={{ uri: profilePic }}
            className="mb-3 w-36 h-36 rounded-full"/>

          <Text className="text-3xl">@{user?.email?.split('@')[0]}</Text>
          {/* parse email to create a username from username@gmail.com  */}
          <Text className="text-xl pb-4">{userDoc?.firstname} {userDoc?.lastname}</Text>

        </View>

        {/* socials container */}
        <View className="bg-tealLite justify-center items-center">
        <Pressable
              onPress={pickImage}
              className="bg-tealMed px-4 py-3 rounded-lg my-2 active:opacity-50 w-1/2">
              <Text className="text-white text-center">Friend Requests</Text>
          </Pressable>
        </View>

        {/* view container for change profile, password, sign out */}
        <View className="bg-tealLite flex-1 justify-center items-center">
          <Pressable
              onPress={pickImage}
              className="bg-tealMed px-4 py-3 rounded-lg my-2 active:opacity-50 w-1/2">
              <Text className="text-white text-center">Change Profile Picture</Text>
          </Pressable>

          <Pressable
            onPress={() => setShowPasswordForm(!showPasswordForm)}
            className="bg-tealMed px-4 py-3 rounded-lg my-2 active:opacity-50 w-1/2">
            <Text className="text-white text-center">
              {showPasswordForm ? "Cancel Password Change" : "Change Password"}
            </Text>
          </Pressable>

          {/* Conditionally render the PasswordChange form */}
          {showPasswordForm && (
            <PasswordChange onComplete={() => setShowPasswordForm(false)} />
          )}

          <Pressable
            onPress={() => auth().signOut()}
            className="bg-tealMed px-4 py-3 rounded-lg my-2 active:opacity-50 w-1/2">
            <Text className="text-white text-center">Sign Out</Text>
          </Pressable>

        </View>
          
      </View>

    </>
  );
};

export default Profile;
