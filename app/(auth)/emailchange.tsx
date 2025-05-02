import auth from "@react-native-firebase/auth";
import React, { useState } from "react";
import {
  Alert,
  Text,
  TextInput,
  Pressable,
  View,
  Image,
  ImageSourcePropType,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/Reusables/BackButton";
import LinearGradient from "react-native-linear-gradient";
import ProfileBanner from "@/components/Profile/profile-banner.svg";
import { router, Stack } from "expo-router";

const EmailChange: React.FC = () => {
  const user = auth().currentUser;

  const [profilePic, setProfilePic] = useState<string | ImageSourcePropType>(
    user?.photoURL || require("@/assets/images/default_profile_picture.png")
  );

  const getImageSource = (source: string | ImageSourcePropType) => {
    if (typeof source === "string") {
      return { uri: source };
    }
    return source;
  };

  const [currentEmail, setCurrentEmail] = useState(user?.email || "");
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const validateNewEmail = () => {
    if (!newEmail)
        return true;
    // check for one or more characters before and after the @ symbol, then a dot and one or more characters
    if (!/\S+@\S+\.\S+/.test(newEmail))
      return false;
    return true;
  }

  const compareNewEmail = () => {
    if (newEmail === currentEmail) {
      return false;
    }
    return true;
  }

  const validateConfirmEmail = () => {
    if (!confirmEmail || confirmEmail !== newEmail) {
      return false;
    }
    return true;
  }

  const validateEmails = () => {
    if (!newEmail || !confirmEmail) {
      Alert.alert("Error", "Please fill in all fields");
      return false;
    }

    if (!validateNewEmail()) {
      Alert.alert("Error", "New email is in an invalid format");
      return false;
    }

    if (!compareNewEmail()) {
      Alert.alert("Error", "New email cannot be the same as current email");
      return false;
    }

    if (!validateConfirmEmail()) {
      Alert.alert("Error", "New emails do not match");
      return false;
    }
    // if all validations pass, return true
    return true;
};

  const handleChangeEmail = async () => {

    if (!validateEmails()) {
      return;
    }

    setLoading(true);
    try {
      await user?.updateEmail(newEmail);
      Alert.alert("Success", "Email updated successfully", [
        {
          text: "OK",
          onPress: () => {
            setNewEmail("");
            setConfirmEmail("");
          },
        },
      ]);
    } catch (error: any) {
      let errorMessage = "An error occurred while changing your email";
      if (error.code === "auth/requires-recent-login") {
        errorMessage = "Please reauthenticate to change your email.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "New email is invalid.";
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#F5FFF5", "#DBFFD8"]} style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView className="flex-1 px-5 gap-2 pb-24">
        <View className="w-11/12 flex flex-row justify-between items-baseline h-16 ml-[5%]">
          <Pressable onPress={() => router.back()}>
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

        <View className="flex-1 px-4 pt-4">
          <Text className="text-2xl font-bold text-gray-800 mb-4">
            Change Email
          </Text>

          {/* Error Message */}
          <Text
            className="text-sm mb-4"
            style={{
              color: newEmail && (!validateNewEmail() || newEmail === currentEmail) ? "#B22222" : "transparent",
              textDecorationLine: "underline",
            }}
          >
            {newEmail === currentEmail
              ? "New email cannot be your current email."
              : "Email is in an invalid format."}
          </Text>

          {/* Current Email */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-green-800 mb-2">Email</Text>
            <TextInput
              className="px-4 py-3 rounded-full bg-white border border-gray-300"
              value={currentEmail}
              editable={false}
            />
          </View>

          {/* New Email */}
          <View className="mb-4">
  <Text className="text-sm font-medium text-green-800 mb-2">New Email</Text>
  
            <View className="rounded-full border border-gray-300 bg-white flex-row justify-between items-center px-4 py-3">
              <TextInput
                className="flex-1 text-base"
                placeholder="Enter new email"
                value={newEmail}
                onChangeText={setNewEmail}
                editable={!loading}
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
                returnKeyType="done"
              />
              {/* Error label rendered beside input text */}
              {newEmail !== confirmEmail && confirmEmail.length > 0 && (
                <Text className="text-xs text-[#B22222] underline ml-2">Emails do not match.</Text>
              )}
            </View>
          </View>

          {/* Confirm New Email */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-green-800 mb-2">
              Confirm New Email
            </Text>
            <TextInput
              className="px-4 py-3 rounded-full bg-white border border-gray-300"
              placeholder="Confirm new email"
              value={confirmEmail}
              onChangeText={setConfirmEmail}
              editable={!loading}
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              returnKeyType="done"
            />
          </View>

          <View className="flex justify-center items-center">
            <Pressable
              onPress={handleChangeEmail}
              disabled={loading}
              className="bg-primaryGreen py-4 rounded-full my-2 active:opacity-50 border border-green-600 w-2/5 mt-5"
            >
              <Text className="text-white text-center font-bold text-sm">
                Change Email
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default EmailChange;