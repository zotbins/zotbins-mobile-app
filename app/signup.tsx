import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { Link, useRouter } from "expo-router";
import { FirebaseError } from "firebase/app";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

// initialize user doc in firestore
const createUserDocument = async (
  uid: string,
  email: string,
  firstname: string,
  lastname: string,
  username: string
) => {
  // initialize default values for user doc
  const xp: number = 0;
  const level: number = 1;
  const totalPoints: number = 0;
  const dailyStreak: number = 0;
  const dailyScans: number = 0;
  const lastLoginUpdate: number = Date.now();
  const lastStreakUpdate: number = Date.now();
  const footprint: number = 0;
  const spiritTrash: string = "";
  await firestore().collection("users").doc(uid).set({
    email,
    uid,
    firstname,
    lastname,
    xp,
    level,
    totalPoints,
    dailyStreak,
    dailyScans,
    lastLoginUpdate,
    lastStreakUpdate,
    footprint,
    spiritTrash,
    username,
    friendsList: [],
    friendRequestsSent: [],
    friendRequestsReceived: [],
    blockedUsers: [],
  });
};

// verifies password has at least one uppercase, one lowercase, one number, and is at least 6 characters long
const isSecure = (password: string) => {
  const passwordRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})"
  );
  return passwordRegex.test(password);
};

async function isUsernameAvailable(username: string) {
  const querySnapshot = await firestore()
    .collection("users")
    .where("username", "==", username)
    .get();
  return querySnapshot.empty;
}

const Signup = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // should be more robust in the future
  const validatePassword = () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "New passwords don't match");
      return false;
    } else if (password.length < 6 || confirmPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters long");
      return false;
    } else if (!isSecure(password)) {
      Alert.alert(
        "Error",
        "New password must contain at least one uppercase letter, one lowercase letter, and one number"
      );
      return false;
    } else {
      return true;
    }
  };

  // create user with email and password in firebase auth and create user doc in firestore
  const signUp = async () => {
    setLoading(true);
    try {
      const usernameAvailable = await isUsernameAvailable(username);
      if (!usernameAvailable) {
        Alert.alert(
          "Error",
          "This username is already taken. Please choose another one."
        );
      }

      if (validatePassword() && usernameAvailable) {
        const response = await auth().createUserWithEmailAndPassword(
          email,
          password
        );

        if (response.additionalUserInfo?.isNewUser) {
          const uid = response.user.uid;
          const email = response.user.email;
          if (uid && email) {
            await createUserDocument(uid, email, firstName, lastName, username);
          }
        } else {
          Alert.alert("Info", "This account already exists.");
        }
      }
    } catch (e: any) {
      const err = e as FirebaseError;
      Alert.alert("Registration failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="mx-5 flex-1 justify-center">
      <KeyboardAvoidingView behavior="padding">
        <TextInput
          className="my-1 h-14 border rounded-md p-2 bg-white"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholder="Username"
        />
        <TextInput
          className="my-1 h-14 border rounded-md p-2 bg-white"
          value={firstName}
          onChangeText={setFirstName}
          placeholder="First Name"
        />
        <TextInput
          className="my-1 h-14 border rounded-md p-2 bg-white"
          value={lastName}
          onChangeText={setLastName}
          placeholder="Last Name"
        />
        <TextInput
          className="my-1 h-14 border rounded-md p-2 bg-white"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Email"
        />
        <TextInput
          className="my-1 h-14 border rounded-md p-2 bg-white"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Password"
        />
        <TextInput
          className="my-1 h-14 border rounded-md p-2 bg-white"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholder="Confirm Password"
        />
        {loading ? (
          <ActivityIndicator size={"small"} className="m-7" />
        ) : (
          <>
            <Pressable
              className="items-center justify-center py-5 rounded-md bg-tintColor mt-2 active:opacity-50"
              onPress={signUp}
            >
              <Text className="text-white text-xl">Sign Up</Text>
            </Pressable>
            <View className="items-center justify-center pt-2">
              <Link href="/login">
                <Text className="text-blue">I already have an account</Text>
              </Link>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
      <View className="absolute bottom-12 left-5 z-10">
        <Pressable
          className="bg-tintColor w-12 h-12 rounded-full justify-center items-center active:opacity-50"
          onPress={() => router.push("/onboarding")}
        >
          <Text className="text-white text-3xl">?</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Signup;
