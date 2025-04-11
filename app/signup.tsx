import auth, { getAuth } from "@react-native-firebase/auth";
import { getFirestore, doc, setDoc, getDocs, writeBatch, serverTimestamp, query, collection, where } from "@react-native-firebase/firestore";
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
  Platform,
} from "react-native";
// import * as AppleAuthentication from "expo-apple-authentication";
import {
  GoogleSignin,
  SignInResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLEWEBCLIENTID,
  offlineAccess: true,
});

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
  const totalScans: number = 0;
  const lastLoginUpdate: number = Date.now();
  const lastStreakUpdate: number = Date.now();
  const footprint: number = 0;
  const spiritTrash: string = "";
  const db = getFirestore();
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, {
    email,
    uid,
    firstname,
    lastname,
    xp,
    level,
    totalPoints,
    dailyStreak,
    dailyScans,
    totalScans,
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

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // function to handle google sign in
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      // opens google sign in prompt
      const userInfo: any = await GoogleSignin.signIn();
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
          await populateMissions(uid);
          await populateAchievements(uid);
        }
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // function to handle apple sign in
  const handleAppleSignIn = async () => {
    // temporarily disabled until apple dev account is created.
    return;
    // setLoading(true);
    // try {
    //   // opens apple sign in prompt
    //   const credential = await AppleAuthentication.signInAsync({
    //     requestedScopes: [
    //       AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
    //       AppleAuthentication.AppleAuthenticationScope.EMAIL,
    //     ],
    //   });

    //   if (credential) {
    //     const { identityToken } = credential;
    //     if (!identityToken) {
    //       throw new Error("No identity token found");
    //     }
    //     // creates apple credential
    //     const appleCredential = auth.AppleAuthProvider.credential(identityToken);

    //     const response = await auth().signInWithCredential(appleCredential);

    //     // if user is new, create user doc in firestore
    //     if (response.additionalUserInfo?.isNewUser) {
    //       const uid = response.user.uid;
    //       const email = response.user.email;
    //       if (uid && email) {
    //         await createUserDocument(uid, email, "", "", "");
    //       }
    //     }
    //   }
    // } catch (e: any) {
    //   console.error(e);
    // } finally{
    //   setLoading(false);
    // }
  };

  // should be more robust in the future
  const validatePassword = () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords don't match");
      return false;
    } else if (password.length < 6 || confirmPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return false;
    } else if (!isSecure(password)) {
      Alert.alert(
        "Error",
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      );
      return false;
    } else {
      return true;
    }
  };

  async function populateMissions(uid: string) {
    const db = getFirestore();
    const missionsRef = collection(db, "missions");
    const userMissionsRef = collection(db, "users", uid, "missions");
    const missionsQuery = query(missionsRef, where("status", "==", true));
    const missionsSnapshot = await getDocs(missionsQuery);

    const batch = writeBatch(db);
    missionsSnapshot.forEach((document) => {
        const userMissionRef = doc(userMissionsRef, document.id);
        batch.set(userMissionRef, {
            ...document.data(),
            id: document.id,
            progress: 0,
            userStatus: false,
            assignedAt: serverTimestamp(),
        });
    });

    await batch.commit();
  }

  async function populateAchievements(uid: string) { 
    const db = getFirestore();
    const achievementsRef = collection(db, "achievements");
    const achievementsSnapshot = await getDocs(achievementsRef);
    const userAchievementsRef = collection(db, "users", uid, "achievements");

    const batch = writeBatch(db);
    achievementsSnapshot.forEach((document) => {
        const userAchievementRef = doc(userAchievementsRef, document.id);
        batch.set(userAchievementRef, {
            ...document.data(),
            id: document.id,
            progress: 0,
            userStatus: false,
        });
    });

    await batch.commit();
  }

  // create user with email and password in firebase auth and create user doc in firestore
  const signUp = async () => {
    if (email === "" || password === "" || confirmPassword === "") {
      Alert.alert("Error", "Please fill out all fields");
      return;
    }

    setLoading(true);
    try {
      if (validatePassword()) {
        const response = await auth().createUserWithEmailAndPassword(
          email,
          password
        );

        if (response.additionalUserInfo?.isNewUser) {
          const uid = response.user.uid;
          const email = response.user.email;
          if (uid && email) {
            await createUserDocument(uid, email, "", "", "");
            await populateMissions(uid);
            await populateAchievements(uid);
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
            {/* Google and Apple sign in buttons */}
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
              <Text className="ml-2 text-white text-xl">
                Sign Up with Google
              </Text>
            </Pressable>
            {/* Apple sign in is only available on iOS, but currently set to always show for testing purposes */}
            {(true || Platform.OS === "ios") && (
              <Pressable
                className="items-center justify-center py-5 rounded-md bg-tintColor mt-2 active:opacity-50 flex-row"
                onPress={handleAppleSignIn}
              >
                <Ionicons name="logo-apple" size={24} color="white" />
                <Text className="ml-2 text-white text-xl">
                  Sign Up with Apple
                </Text>
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

export default Signup;
