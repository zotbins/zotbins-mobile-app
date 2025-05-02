import React, { useState } from "react";
import {
  Alert,
  Text,
  TextInput,
  Pressable,
  View,
  ImageSourcePropType,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";
import { router, Stack } from "expo-router";
import auth from "@react-native-firebase/auth";
import ProfileHeader from "@/components/Settings/ProfileHeader";
import VerificationPopup from "@/components/Settings/VerificationPopup";

const EmailChange: React.FC = () => {
  const user = auth().currentUser;

  const [profilePic] = useState<string | ImageSourcePropType>(
    user?.photoURL || require("@/assets/images/default_profile_picture.png")
  );
  const [currentEmail] = useState(user?.email || "");
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);

  const validateEmails = () => {
    if (!newEmail || !confirmEmail) {
      Alert.alert("Error", "Please fill in all fields");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(newEmail)) {
      Alert.alert("Error", "New email is in an invalid format");
      return false;
    }
    if (newEmail === currentEmail) {
      Alert.alert("Error", "New email cannot be the same as current email");
      return false;
    }
    if (newEmail !== confirmEmail) {
      Alert.alert("Error", "New emails do not match");
      return false;
    }
    return true;
  };

  const handleChangeEmail = async () => {
    if (!validateEmails()) return;

    setLoading(true);
    try {
      await user?.updateEmail(newEmail);
      setShowVerificationPopup(true);
      setNewEmail("");
      setConfirmEmail("");
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
        <ProfileHeader
          onBackPress={() => router.back()}
          profilePic={profilePic}
        />

        <View className="flex-1 px-4 pt-4">
          <Text className="text-2xl font-bold text-gray-800 mb-4">
            Change Email
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
            <Text className="text-sm font-medium text-green-800 mb-2">
              New Email
            </Text>
            <TextInput
              className="px-4 py-3 rounded-full bg-white border border-gray-300"
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

      {/* Popup */}
      {showVerificationPopup && (
        <VerificationPopup
          onClose={() => setShowVerificationPopup(false)}
          onResend={() => Alert.alert("Resend", "Verification email resent.")}
        />
      )}
    </LinearGradient>
  );
};

export default EmailChange;