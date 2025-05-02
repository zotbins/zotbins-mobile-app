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
import { router, Stack, useRouter} from "expo-router";

const PasswordChange: React.FC = () => {
  const user = auth().currentUser;

  // Profile picture logic
  const [profilePic, setProfilePic] = useState<string | ImageSourcePropType>(
    user?.photoURL || require("@/assets/images/default_profile_picture.png")
  );

  const getImageSource = (source: string | ImageSourcePropType) => {
    if (typeof source === "string") {
      return { uri: source };
    }
    return source;
  };

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  //NEED TO SEPARATE VALIDATE PASSWORD AND ALERT LOGIC

  const validateNewPassword = () => {
    if (!newPassword || newPassword.length < 8 || !/\d/.test(newPassword) || !/[a-zA-Z]/.test(newPassword) || !/[#@$!%*?&]/.test(newPassword))
      return false;
    return true;
  };

  const validateConfirmPassword = () => {
    if (!confirmPassword || confirmPassword !== newPassword) {
      return false;
    }
    return true;
  }


  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (!validateNewPassword()) {
      Alert.alert(
        "Error",
        "New password must contain at least 1 letter, 1 number, and 1 symbol. Minimum length is 8 characters."
      );
      return;
    }
    if (!validateConfirmPassword()) {
      Alert.alert("Error", "New passwords don't match");
      return;
    } 

    setLoading(true);
    try {
      const credential = auth.EmailAuthProvider.credential(
        user?.email || "",
        currentPassword
      );
      await user?.reauthenticateWithCredential(credential);
      await user?.updatePassword(newPassword);

      Alert.alert("Success", "Password updated successfully", [
        {
          text: "OK",
          onPress: () => {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
          },
        },
      ]);
    } catch (error: any) {
      let errorMessage = "An error occurred while changing your password";
      if (error.code === "auth/wrong-password") {
        errorMessage = "Current password is incorrect";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "New password is too weak";
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
        {/* Header Section */}
        <View className="w-11/12 flex flex-row justify-between items-baseline h-16 ml-[5%]">
          <Pressable onPress={() => router.back()}>
            <BackButton/>
          </Pressable>
        </View>

        {/* Profile Header */}
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

        {/* Password Change Form */}
        <View className="flex-1 px-4 pt-4">
          <Text className="text-2xl font-bold text-gray-800 mb-4">
            Change Password
          </Text>
          <Text className="text-sm text-darkGreen mb-4">
            Password must contain at least 1 letter, 1 number, and 1 symbol. Minimum length is 8 characters.
          </Text>

      {/* Criteria Message */}
      <Text className="text-sm mb-4" style={{ color: newPassword && !validateNewPassword() ? "red" : "transparent" }}>
        Password does not meet the criteria.
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
    </LinearGradient>
  );
};

export default PasswordChange;