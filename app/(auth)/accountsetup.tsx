import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import { getFirestore, doc, updateDoc, where, query, collection, getDocs } from "@react-native-firebase/firestore";
import { getAuth } from "@react-native-firebase/auth";
import { router, Stack } from "expo-router";
import Checkbox from "expo-checkbox";
import LinearGradient from "react-native-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";

// Import background images
import LeftCircle from "@/assets/images/left-bg-circle.png";
import RightCircle from "@/assets/images/right-bg-circle.png";
import BottomCircle from "@/assets/images/bottom-bg-circle.png";

const AccountSetup = () => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const isUsernameAvailable = async (username: string) => {
    const db = getFirestore();
    const q = query(collection(db, "users"), where("username", "==", username));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  };

  const setAccountDetails = async (username: string, firstName: string, lastName: string) => {
    if (username === "" || firstName === "" || lastName === "") {
      Alert.alert("Error", "Please fill out all fields");
      return;
    }

    if (!agreedToTerms) {
      Alert.alert("Error", "You must agree to the Privacy Policy and Terms of Service to continue.");
      return;
    }

    try {
      const available = await isUsernameAvailable(username);
      if (!available) {
        Alert.alert("Error", "Username is already taken");
        return;
      }

      const db = getFirestore();
      const user = getAuth().currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          username: username,
          firstName: firstName,
          lastName: lastName,
        });
        // navigate to spirittrash page
        router.replace("/spirittrash");
      }
    } catch (error) {
      console.error("Error setting account details:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <LinearGradient colors={["#48BB78", "#009838"]} style={{ flex: 1 }}>
      <Image source={LeftCircle} className="absolute" />
      <Image source={RightCircle} className="absolute top-56 right-0" />
      <Image
        source={BottomCircle}
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        className="flex-1"
      >
        <SafeAreaView className="mx-5 pt-10 flex-1">
          <Stack.Screen
            options={{
              headerShadowVisible: false,
              headerBackVisible: false,
              headerTransparent: true,
              headerTitle: "",
            }}
          />
          
          <Text className="text-white text-4xl font-semibold mt-16 pl-1">
            Complete Your Profile
          </Text>

          <View className="flex-1 justify-center">
            {/* Username */}
            <View className="flex-row justify-center items-center">
              <TextInput
                className="flex-1 pl-10 my-1 h-14 border-b border-white rounded-md p-2 text-[16px] text-white"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                placeholder="Username"
                placeholderTextColor="#fff"
              />
              <FontAwesome
                name="user"
                size={24}
                color="white"
                className="absolute left-2"
              />
            </View>

            {/* First Name */}
            <View className="flex-row justify-center items-center">
              <TextInput
                className="flex-1 pl-10 my-1 h-14 border-b border-white rounded-md p-2 text-[16px] text-white"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First Name"
                placeholderTextColor="#fff"
              />
              <FontAwesome
                name="id-card"
                size={20}
                color="white"
                className="absolute left-2"
              />
            </View>

            {/* Last Name */}
            <View className="flex-row justify-center items-center">
              <TextInput
                className="flex-1 pl-10 my-1 h-14 border-b border-white rounded-md p-2 text-[16px] text-white"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last Name"
                placeholderTextColor="#fff"
              />
              <FontAwesome
                name="id-card"
                size={20}
                color="white"
                className="absolute left-2"
              />
            </View>

            {/* Terms and Conditions */}
            <View className="flex-row items-center mt-4 mb-2 ml-1">
              <Checkbox
                value={agreedToTerms}
                onValueChange={setAgreedToTerms}
                color={agreedToTerms ? "#009838" : undefined}
                className="mr-2"
              />
              <Text className="text-white text-sm flex-1">
                I agree to the{" "}
                <Text
                  className="underline"
                  onPress={() =>
                    Linking.openURL(
                      "https://docs.google.com/document/d/1dQKEX97twJYKaWKl1xt-mqr1uISkzUAtmTWxODRS8eA/edit?tab=t.0"
                    )
                  }
                >
                  Privacy Policy
                </Text>
                {" "}and{" "}
                <Text
                  className="underline"
                  onPress={() =>
                    Linking.openURL(
                      "https://docs.google.com/document/d/1dQKEX97twJYKaWKl1xt-mqr1uISkzUAtmTWxODRS8eA/edit?tab=t.0"
                    )
                  }
                >
                  Terms of Service
                </Text>
              </Text>
            </View>

            <Pressable
              onPress={() => setAccountDetails(username, firstName, lastName)}
              className="h-14 bg-lightestGreen rounded-full items-center justify-center mt-4"
            >
              <Text className="text-mediumGreen text-xl font-semibold">
                Continue
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default AccountSetup;