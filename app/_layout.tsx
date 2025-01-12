import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import "react-native-reanimated";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { View } from "react-native";
import { ActivityIndicator } from "react-native";

export let currentUser: FirebaseAuthTypes.User | null = null;
export let currentUserUid: string | null = null;

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();
  const router = useRouter();
  const segments = useSegments();

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    // console.log("onAuthStateChanged", user);
    setUser(user);
    if (initializing) setInitializing(false);
    currentUser = user;
    currentUserUid = user?.uid || null;
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  useEffect(() => {
    if (initializing) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (user && !inAuthGroup) {
      router.replace("/(auth)/(tabs)/home");
    } else if (!user && inAuthGroup) {
      router.replace("/login");
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
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}
