import auth from "@react-native-firebase/auth";
import React, { useState } from "react";
import { Alert, Text, TextInput, Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import BackButton from "@/components/Reusables/BackButton";

const isSecure = (password: string) => {
  const passwordRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})"
  );
  return passwordRegex.test(password);
};

const PasswordChange: React.FC = () => {
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const user = auth().currentUser;

  const validatePasswords = () => {
    // Validate if all fields are filled
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return false;
    }

    // Check if new password is the same as the current password
    if (
      currentPassword === newPassword ||
      currentPassword === confirmPassword
    ) {
      Alert.alert(
        "Error",
        "Password cannot be the same as your current password"
      );
      return false;
    }

    // Check if new password meets the minimum length requirement
    if (newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters long");
      return false;
    }

    // Check if new passwords match
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords don't match");
      return false;
    }

    // Check if new password meets security requirements
    if (!isSecure(newPassword)) {
      Alert.alert(
        "Error",
        "New password must contain at least one uppercase letter, one lowercase letter, and one number"
      );
      return false;
    }

    return true;
  };

  const handleChangePassword = async () => {
    if (!validatePasswords()) return;
    if (!user || !user.email) return;

    setLoading(true);
    try {
      // Reauthenticate user with current password
      const credential = auth.EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await user?.reauthenticateWithCredential(credential);
      await user?.updatePassword(newPassword);

      // Show success message and navigate back
      Alert.alert("Success", "Your password has been updated successfully", [
        {
          text: "OK",
          onPress: () => {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            navigation.goBack();
          },
        },
      ]);
    } catch (error: any) {
      let errorMessage = "An error occurred while changing your password";

      // Handle specific Firebase error codes
      switch (error.code) {
        case "auth/wrong-password":
          errorMessage = "Current password is incorrect";
          break;
        case "auth/weak-password":
          errorMessage = "New password is too weak";
          break;
        case "auth/requires-recent-login":
          errorMessage =
            "Please sign out and sign in again before changing your password";
          break;
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Stack Screen Header */}
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerBackVisible: false,
          headerTransparent: true,
          headerLeft: () => <BackButton />,
          headerTitle: "",
        }}
      />

      <View className="flex-1 px-4 pt-12">
        {/* Title */}
        <Text className="text-2xl font-bold text-gray-800 mb-4">
          Change Password
        </Text>

        {/* Current Password Input */}
        <TextInput
          className="px-4 py-3 my-2 rounded-lg bg-slate-100 border-2"
          placeholder="Current Password"
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
          editable={!loading}
        />

        {/* New Password Input */}
        <TextInput
          className="px-4 py-3 my-2 rounded-lg bg-slate-100 border-2"
          placeholder="New Password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          editable={!loading}
        />

        {/* Confirm New Password Input */}
        <TextInput
          className="px-4 py-3 my-2 rounded-lg bg-slate-100 border-2"
          placeholder="Confirm New Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          editable={!loading}
        />

        {/* Change Password Button */}
        <Pressable
          onPress={handleChangePassword}
          disabled={loading}
          className={`px-4 py-3 my-2 rounded-lg ${
            loading ? "bg-blue/50" : "bg-blue"
          } active:opacity-50`}
        >
          <Text className="text-white text-center">
            {loading ? "Changing Password..." : "Change Password"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default PasswordChange;
