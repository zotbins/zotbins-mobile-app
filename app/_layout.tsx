import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import "react-native-reanimated";
import { getAuth, FirebaseAuthTypes } from "@react-native-firebase/auth";
import { View } from "react-native";
import { ActivityIndicator, Pressable } from "react-native";
import { getFirestore, doc, getDoc } from "@react-native-firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { UserProvider } from "@/context/UserProvider";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import AsyncStorage from "@react-native-async-storage/async-storage";

export let currentUser: FirebaseAuthTypes.User | null = null;
export let currentUserUid: string | null = null;

// use this to reset async storage for has launched
const resetFirstLaunch = async () => {
  await AsyncStorage.removeItem("hasLaunched");
  console.log("First launch reset successfully");
};

resetFirstLaunch();

export default function RootLayout() {
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLEWEBCLIENTID,
    offlineAccess: true,
  });

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const router = useRouter();
  const segments = useSegments();

  // check if this is the first launch for the user
  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem("hasLaunched");
        if (hasLaunched === null) {
          // first time launching the app
          console.log("first time launching");
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.error("Error checking first launch:", error);
        setIsFirstLaunch(false);
      }
    };

    checkFirstLaunch();
  }, []);

  // checks if user has spiritTrash set and/or account details set
  const getSpiritTrashAndAccountDetails = async (uid: string) => {
    const db = getFirestore();
    const snapshot = await getDoc(doc(db, "users", uid));

    const data = snapshot.data();
    const spiritTrash = data ? data.spiritTrash : "";
    const username = data ? data.username : "";

    return { spiritTrash, username };
  };

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    // console.log("onAuthStateChanged", user);
    setUser(user);
    if (initializing) setInitializing(false);
    currentUser = user;
    currentUserUid = user?.uid || null;
  };

  useEffect(() => {
    const subscriber = getAuth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  useEffect(() => {
    if (initializing || isFirstLaunch === null) return;

    // if it's the first launch -> onboarding slides
    if (isFirstLaunch && !user) {
      router.replace("/onboarding");
      AsyncStorage.setItem("hasLaunched", "true");
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";

    if (user && !inAuthGroup) {
      // check if user has spiritTrash set and account details set
      getSpiritTrashAndAccountDetails(user.uid).then(({ username }) => {
        // if user has no username, redirect to account setup
        if (username === "") {
          router.replace("/accountsetup");
        }
        // if user has no spiritTrash, redirect to spirit trash quiz
        // else if (spiritTrash === "") {
        //   // router.replace("/spirittrash");
        else {
          router.replace("/(tabs)/home");
        }
      });
    } else if (!user) {
      router.replace("/login");
    }
  }, [user, initializing, isFirstLaunch]);

  return (
    <UserProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen
          name="signup"
          options={({ navigation }) => ({
            headerShown: true,
            headerTitle: "",
            headerBackTitleVisible: false,
            headerTransparent: true,
            headerShadowVisible: false,
            headerTintColor: "#fff",
            headerLeft: () => (
              <Pressable
                onPress={() => navigation.goBack()}
                style={{ paddingLeft: 2 }}
              >
                <View
                  style={{
                    backgroundColor: "rgba(201, 255, 226, 1)",
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="arrow-back" size={20} color="#008229" />
                </View>
              </Pressable>
            ),
          })}
        />
        <Stack.Screen
          name="signupCredentials"
          options={({ navigation }) => ({
            headerShown: true,
            headerTitle: "",
            headerBackTitleVisible: false,
            headerTransparent: true,
            headerShadowVisible: false,
            headerTintColor: "#fff",
            headerLeft: () => (
              <Pressable
                onPress={() => navigation.goBack()}
                style={{ paddingLeft: 2 }}
              >
                <View
                  style={{
                    backgroundColor: "rgba(201, 255, 226, 1)",
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="arrow-back" size={20} color="#008229" />
                </View>
              </Pressable>
            ),
          })}
        />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </UserProvider>
  );
}
