import auth from "@react-native-firebase/auth";
import React, { useState } from "react";
import { Alert, Text, TextInput, Pressable, View } from "react-native";

const isSecure = (password: string) => {
  const passwordRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})"
  );
  return passwordRegex.test(password);
};

interface PasswordChangeFormProps {
  onComplete: () => void;
}

const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({
  onComplete,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const user = auth().currentUser;

  const validatePasswords = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return false;
    }

    if (currentPassword == newPassword || currentPassword == confirmPassword) {
      Alert.alert(
        "Error",
        "Password cannot be the same as your current password"
      );
      return false;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters long");
      return false;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords don't match");
      return false;
    }

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
      const credential = auth.EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await user?.reauthenticateWithCredential(credential);
      await user?.updatePassword(newPassword);

      Alert.alert("Success", "Your password has been updated successfully", [
        {
          text: "OK",
          onPress: () => {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            onComplete();
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
    <View className="w-64 px-4">
      <Text className="px-4 py-3 font-semibold">Change Password</Text>

      <TextInput
        className="px-4 py-3 my-2 rounded-lg bg-slate-100"
        placeholder="Current Password"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
        editable={!loading}
      />

      <TextInput
        className="px-4 py-3 my-2 rounded-lg bg-slate-100"
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        editable={!loading}
      />

      <TextInput
        className="px-4 py-3 my-2 rounded-lg bg-slate-100"
        placeholder="Confirm New Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        editable={!loading}
      />

      <Pressable
        onPress={handleChangePassword}
        disabled={loading}
        className={`px-4 py-3 my-2 rounded-lg active:opacity-50 ${
          loading ? "bg-blue" : "bg-blue"
        }`}
      >
        <Text className="text-white text-center">
          {loading ? "Changing Password..." : "Change Password"}
        </Text>
      </Pressable>
    </View>
  );
};

export default PasswordChangeForm;
