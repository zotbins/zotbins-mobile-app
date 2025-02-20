import auth from "@react-native-firebase/auth";
import { Link, useRouter } from "expo-router";
import { FirebaseError } from "firebase/app";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import firestore from "@react-native-firebase/firestore";

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
const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  
  // function to handle google sign in
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      // opens google sign in prompt
      const userInfo:any = await GoogleSignin.signIn();
      // gets idToken from google sign in
      const idToken = userInfo.data.idToken;

      if (!idToken) {
        throw new Error("No idToken found");
      }
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // signs in with google credential
      const response = await auth().signInWithCredential(googleCredential);

      // if user is new, create user doc in firestore
      if (response.additionalUserInfo?.isNewUser) {
        const uid = response.user.uid;
        const email = response.user.email;
        if (uid && email) {
          await createUserDocument(uid, email, "", "", "");
        }
      }
      
    } catch (e: any) {
      console.error(e);
    } finally{
      setLoading(false);
    }
  }

  // function to handle apple sign in
  const handleAppleSignIn = async () => {
    setLoading(true);
    try {
      // opens apple sign in prompt
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential) {
        const { identityToken } = credential;
        if (!identityToken) {
          throw new Error("No identity token found");
        }
        // creates apple credential
        const appleCredential = auth.AppleAuthProvider.credential(identityToken);

        const response = await auth().signInWithCredential(appleCredential);

        // if user is new, create user doc in firestore
        if (response.additionalUserInfo?.isNewUser) {
          const uid = response.user.uid;
          const email = response.user.email;
          if (uid && email) {
            await createUserDocument(uid, email, "", "", "");
          }
        }
      }
    } catch (e: any) {
      console.error(e);
    } finally{
      setLoading(false);
    }
  }


  // sign in the user or alert if error occures
  const signIn = async () => {
    if (email === "" || password === "") {
      Alert.alert("Error", "Please fill out all fields");
      return;
    }

    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (e: any) {
      const err = e as FirebaseError;
      alert("Registration failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center mx-5">
      <KeyboardAvoidingView behavior="padding">
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
        {loading ? (
          <ActivityIndicator size={"small"} className="my-7" />
        ) : (
          <>
            <Pressable
              onPress={signIn}
              className="items-center justify-center py-5 rounded-md bg-tintColor mt-2 active:opacity-50"
            >
              <Text className="text-white text-xl">Login</Text>
            </Pressable>
            <View className="items-center justify-center pt-2">
              <Link href="/signup">
                <Text className="text-blue">I don't have an account</Text>
              </Link>
            </View>
            {/*Google and Apple Sign In*/}
            <View className="flex-row items-center justify-center p-3">
              <View className="flex-1 border-t border-1 mr-4 border-grey" />
              <Text className="text-lg text-grey ">or</Text>
              <View className="flex-1 border-t border-1 ml-4 text-grey" />
            </View>
            <Pressable
              className="items-center justify-center py-5 rounded-md bg-tintColor mt-2 active:opacity-50 flex-row"
              onPress={handleGoogleSignIn}
            >
              <Ionicons name="logo-google" size={24} color="white" />
              <Text className="ml-2 text-white text-xl">Sign Up with Google</Text>
            </Pressable>
            {(true ||Platform.OS === "ios" )&& (
              <Pressable
                className="items-center justify-center py-5 rounded-md bg-tintColor mt-2 active:opacity-50 flex-row"
                onPress={handleAppleSignIn}
              >
                <Ionicons name="logo-apple" size={24} color="white" />
                <Text className="ml-2 text-white text-xl">Sign Up with Apple</Text>
              </Pressable>
            )}
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

export default Login;
