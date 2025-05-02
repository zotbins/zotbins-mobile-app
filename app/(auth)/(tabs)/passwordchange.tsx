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
import ProfileHeader from "@/components/Settings/ProfileHeader";
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
        <ProfileHeader
          onBackPress={() => router.back()}
          profilePic={getImageSource(profilePic)}
        />

        {/* Password Change Form */}
        <View className="flex-1 px-4 pt-4">
          <Text className="text-2xl font-bold text-gray-800 mb-4">
            Change Password
          </Text>
          <Text className="text-sm text-darkGreen mb-4">
            Password must contain at least 1 letter, 1 number, and 1 symbol. Minimum length is 8 characters.
          </Text>

          {/* Criteria Message */}
          <Text className="text-sm mb-4" style={{ color: newPassword && !validateNewPassword() ? "#B22222" : "transparent", textDecorationLine: "underline",}}>
            Password does not meet the criteria.
          </Text>

          {/* Current Password Field */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-green-800 mb-2">
              Current Password
            </Text>
            <TextInput
              className="px-4 py-3 rounded-full bg-white border border-gray-300"
              placeholder="Enter current password"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
              editable={!loading}
            />
          </View>

          {/* New Password Field */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-green-800 mb-2">New Password</Text>

            <View className="relative">
              <TextInput
                className="px-4 py-3 pr-36 rounded-full bg-white border border-gray-300"
                placeholder="Enter new password"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                editable={!loading}
                style={{
                  textAlignVertical: "center",
                }}
              />
              {confirmPassword.length > 0 && confirmPassword !== newPassword && (
                <Text className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#B22222] underline">
                  Passwords do not match.
                </Text>
              )}
            </View>
          </View>

          {/* Confirm New Password Field */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-green-800 mb-2">
              Confirm New Password
            </Text>
            <TextInput
              className="px-4 py-3 rounded-full bg-white border border-gray-300"
              placeholder="Confirm new password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!loading}
            />
          </View>
          <View className= "flex justify-center items-center">
            <Pressable
              onPress={handleChangePassword}
              disabled={loading}  
              className="bg-primaryGreen py-4 rounded-full my-2 active:opacity-50 border border-green-600 w-2/5 mt-5"
            >
              <Text className="text-white text-center font-bold text-sm">
                Change Password
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default PasswordChange;