import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { getAuth, FirebaseAuthTypes } from "@react-native-firebase/auth";
import { Alert, View } from "react-native";
import { ActivityIndicator, Pressable } from "react-native";
import { getFirestore, doc, getDoc } from "@react-native-firebase/firestore";
import { Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();


export let currentUser: FirebaseAuthTypes.User | null;
export let currentUserUid: string | null = null;

export default function RootLayout() {


  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();
  const router = useRouter();
  const segments = useSegments();

  // checks if user has spiritTrash set and/or account details set
  const getSpiritTrashAndAccountDetails = async (uid: string) => {
    const db = getFirestore();
    const snapshot = await getDoc(doc(db, "users", uid))


    const data = snapshot.data();    
    const spiritTrash = data ? data.spiritTrash : "";
    const username = data ? data.username : "";

    return { spiritTrash, username };
  }


  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    // console.log("onAuthStateChanged", user);
    setUser(user);
    if (initializing) {
        SplashScreen.hideAsync();
        setInitializing(false);
    }

    currentUser = user;
    currentUserUid = user?.uid || null;
  };

  useEffect(() => {
    const subscriber = getAuth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);


  useEffect(() => {
    if (initializing) return;
  
    const inAuthGroup = segments[0] === "(auth)";
  
    if (user && !inAuthGroup) {
      Alert.alert("Replacing to home");
      setTimeout(() => {
        // check if user has spiritTrash set and account details set
        getSpiritTrashAndAccountDetails(user.uid).then(({ spiritTrash, username }) => {
          // if user has no username, redirect to account setup
          if (username === "") {
            router.replace("/accountsetup");
          }
          // if user has no spiritTrash, redirect to spirit trash quiz
          else if (spiritTrash === "") {
            router.replace("/spirittrash");
          } else {
            router.replace("/(auth)/(tabs)/home");
          }
        });
      }, 500);
    } else if (!user && inAuthGroup) {
      Alert.alert("Replacing to login");
      setTimeout(() => {
        console.log("Replacing to login")
        router.replace("/login");
      }, 500);
    }
    else if (!user && !inAuthGroup) {
      Alert.alert("Pushing to login");
      setTimeout(() => {
        router.push("/login");
      }, 500);
    }
  }, [user, initializing]);

  if (initializing) {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={({ navigation }) => ({
        headerShown: true,
        headerTitle: '',
        headerBackTitleVisible: false,
        headerTransparent: true,
        headerShadowVisible: false,
        headerTintColor: '#fff',
        headerLeft: () => (
          <Pressable
            onPress={() => navigation.goBack()}
            style={{ paddingLeft: 2 }}
          >
            <View
              style={{
                backgroundColor: 'rgba(201, 255, 226, 1)',
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="arrow-back" size={20} color="#008229" />
            </View>
          </Pressable>
        ),
      })} />
      <Stack.Screen name="signupCredentials" options={({ navigation }) => ({
        headerShown: true,
        headerTitle: '',
        headerBackTitleVisible: false,
        headerTransparent: true,
        headerShadowVisible: false,
        headerTintColor: '#fff',
        headerLeft: () => (
          <Pressable
            onPress={() => navigation.goBack()}
            style={{ paddingLeft: 2 }}
          >
            <View
              style={{
                backgroundColor: 'rgba(201, 255, 226, 1)',
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="arrow-back" size={20} color="#008229" />
            </View>
          </Pressable>
        ),
      })} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}