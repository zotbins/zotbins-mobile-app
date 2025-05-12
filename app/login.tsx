import auth, { getAuth } from "@react-native-firebase/auth";
import { Link, useRouter } from "expo-router";
import { FirebaseError } from "firebase/app";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
  Image,
  KeyboardAvoidingView,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import {
  getFirestore,
  doc,
  setDoc,
  writeBatch,
  collection,
  where,
  query,
  getDocs,
  serverTimestamp,
} from "@react-native-firebase/firestore";
import LinearGradient from "react-native-linear-gradient";
import ZotbinsLogo from "../assets/images/zotbins_logo.png";
import LeftCircle from '@/assets/images/left-bg-circle.png';
import RightCircle from '@/assets/images/right-bg-circle.png';
import BottomCircle from '@/assets/images/bottom-bg-circle.png';
import Background from '@/assets/images/background.png';

// initialize user doc in firestore
const createUserDocument = async (
  uid: string,
  email: string,
  firstName: string,
  lastName: string,
  username: string
) => {
  // initialize default values for user doc
  const xp: number = 0;
  const level: number = 1;
  const totalPoints: number = 0;
  const weeklyPoints: number = 0;
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
    firstName,
    lastName,
    xp,
    level,
    totalPoints,
    weeklyPoints,
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

  async function populateMissions(uid: string) {
    const db = getFirestore();
    const missionsRef = collection(db, "missions");
    const missionsQuery = query(missionsRef, where("status", "==", true));
    const missionsSnapshot = await getDocs(missionsQuery);
    const userMissionsRef = collection(db, "users", uid, "missions");

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
            await populateMissions(uid);
            await populateAchievements(uid);
          }
        }
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

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

  const [hidePassword, setHidePassword] = useState(true);

  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword);
  };

  return (
    <ImageBackground
      source={Background}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        className="flex-1">

        <View className="flex-1 justify-center items-center px-5">
          {/* ZotBins Logo */}
          <View
            style={{
              width: 250,
              height: 250,
              borderRadius: 360,
              backgroundColor: "#e8ffe8",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 50,
              borderWidth: 10,
              marginTop: 50,
              borderColor: "#66b679",
            }}
          >
            <Image
              source={ZotbinsLogo}
              resizeMode="contain"
              style={{ width: 150, height: 150 }}
            />
          </View>
          {/* Email*/}
          <View className="w-full max-w-md">
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Email"
              placeholderTextColor="white"
              style={{
                marginHorizontal: 20,
                marginBottom: 10,
                marginTop: 50,
                fontSize: 16,
                color: "white",
              }}
            />
            <View
              style={{
                height: 1.5,
                backgroundColor: "white",
                marginBottom: 15,
                marginHorizontal: 20,
              }}
            />

            {/* Password */}
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={hidePassword}
              placeholder="Password"
              placeholderTextColor="white"
              style={{
                marginHorizontal: 20,
                marginBottom: 10,
                marginTop: 10,
                fontSize: 16,
                color: "white",
              }}
            />
            <Pressable
              onPress={togglePasswordVisibility}
            >
              <Ionicons
                name={hidePassword ? 'eye-off' : 'eye'}
                size={24}
                color="white"
                className="absolute right-6 bottom-2"
              />
            </Pressable>
            <View
              style={{
                height: 1.5,
                backgroundColor: "white",
                marginBottom: 15,
                marginHorizontal: 20,
              }}
            />

            {loading ? (
              <ActivityIndicator size={"large"} className="my-7" color="white" />
            ) : (
              <>
                {/* Login Button */}
                <Pressable
                  onPress={signIn}
                  style={{
                    backgroundColor: "#DDEEDD",
                    borderRadius: 100,
                    paddingVertical: 15,
                    marginHorizontal: 20,
                    marginVertical: 15,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "#82FFAD",
                  }}
                >
                  <Text
                    style={{ color: "#00762B", fontSize: 20, fontWeight: "bold" }}
                  >
                    Log in
                  </Text>
                </Pressable>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: 15,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      height: 1,
                      backgroundColor: "white",
                      marginHorizontal: 20,
                    }}
                  />
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 14,
                    }}
                  >
                    Or login with
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      height: 1,
                      backgroundColor: "white",
                      marginHorizontal: 20,
                    }}
                  />
                </View>

                {/* Google and Apple Sign In */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 20,
                    width: "100%",
                    marginBottom: 20,
                  }}
                >
                  {/* Google Sign In */}
                  <Pressable
                    onPress={handleGoogleSignIn}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 50,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={require("../assets/images/google_signin.png")}
                      style={{ width: 50, height: 50 }}
                    />
                  </Pressable>

                  {/* Apple Sign In */}
                  {(true || Platform.OS === "ios") && (
                    <Pressable
                      onPress={handleAppleSignIn}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 50,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={require("../assets/images/apple_signin.png")}
                        style={{ width: 50, height: 50 }}
                      />
                    </Pressable>
                  )}
                </View>

                {/* Sign Up Link */}
                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                      fontWeight: "semibold",
                    }}
                  >
                    Don’t have an account?{" "}
                  </Text>

                  <Link href="/signup">
                    <Text
                      style={{
                        color: "#A4F0FF",
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      Sign up
                    </Text>
                  </Link>
                </View>
              </>
            )}
          </View>
          {/* <View className="absolute bottom-12 left-5 z-10">
          <Pressable
            className="bg-tintColor w-12 h-12 rounded-full justify-center items-center active:opacity-50"
            onPress={() => router.push("/onboarding")}
          >
            <Text className="text-white text-3xl">?</Text>
          </Pressable>
        </View> */}
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Login;
