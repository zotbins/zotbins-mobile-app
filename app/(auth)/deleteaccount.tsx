import auth, { getAuth } from "@react-native-firebase/auth";
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
import LinearGradient from "react-native-linear-gradient";
import ProfileHeader from "@/components/Settings/ProfileHeader";
import { Stack, useRouter } from "expo-router";
import {
  getFirestore,
  doc,
  getDoc,
  deleteDoc,
} from "@react-native-firebase/firestore";
import {
  getStorage,
  ref,
} from "@react-native-firebase/storage";

const DeleteAccount: React.FC = () => {
  const router = useRouter();
  const user = getAuth().currentUser;
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleDeleteAccount = async () => {
    if (!password) {
      Alert.alert("Error", "Password is required");
      return;
    }

    setLoading(true);
    try {
      if (!user || !user.email) {
        Alert.alert("Error", "User not found");
        return;
      }

      // Re-authenticate
      const credential = auth.EmailAuthProvider.credential(
        user.email,
        password
      );
      await user.reauthenticateWithCredential(credential);

      // Confirm once more before proceeding
      Alert.alert(
        "Confirm Deletion",
        "Are you absolutely sure you want to delete your account? This action cannot be undone.",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => setLoading(false),
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                // Now proceed with deletion
                const uid = user.uid;
                const db = getFirestore();
                const userDocRef = doc(db, "users", uid);

                // Check if document exists before deleting
                const docSnapshot = await getDoc(userDocRef);
                if (docSnapshot.exists) {
                  await deleteDoc(userDocRef);
                }

                if (user.photoURL) {
                  const storage = getStorage();
                  const storageRef = ref(
                    storage,
                    `zotzero-user-profile-pics/${uid}`
                  );
                  try {
                    await storageRef.delete();
                  } catch (storageError) {
                    console.error(
                      "Error deleting profile picture:",
                      storageError
                    );
                  }
                }

                await user.delete();

                Alert.alert(
                  "Account Deleted",
                  "Your account has been successfully deleted.",
                  [
                    {
                      text: "OK",
                      onPress: () => router.replace("/login"),
                    },
                  ]
                );
              } catch (error) {
                console.error("Error deleting account:", error);
                Alert.alert(
                  "Error",
                  "Failed to delete account. Please try again."
                );
                setLoading(false);
              }
            },
          },
        ]
      );
    } catch (error: any) {
      let errorMessage = "An error occurred";
      if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many attempts. Please try again later.";
      } else if (error.code === "auth/requires-recent-login") {
        errorMessage = "Please log out and log back in before trying again.";
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

        {/* Delete Account Form */}
        <View className="flex-1 px-4 pt-4">
          <Text className="text-2xl font-bold text-gray-800 mb-4">
            Delete Account
          </Text>
          <Text className="text-sm text-red-500 mb-4">
            Warning: This action cannot be undone. All your data will be permanently deleted.
          </Text>

          {/* Password Field */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-green-800 mb-2">
              Enter your password to confirm
            </Text>
            <TextInput
              className="px-4 py-3 rounded-full bg-white border border-gray-300"
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />
          </View>

          <View className="flex justify-center items-center mt-8">
            <Pressable
              onPress={handleDeleteAccount}
              disabled={loading}
              className="bg-primaryGreen py-4 rounded-full my-2 active:opacity-50 border border-green-600 w-2/5"
            >
              <Text className="text-white text-center font-bold text-sm">
                {loading ? "Processing..." : "Delete Account"}
              </Text>
            </Pressable>
            
            <Pressable
              onPress={() => router.back()}
              disabled={loading}
              className="py-4 rounded-full my-2 active:opacity-50 w-2/5 mt-2"
            >
              <Text className="text-darkGreen text-center font-medium text-sm">
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default DeleteAccount;