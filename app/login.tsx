import auth from "@react-native-firebase/auth";
import { Link, useRouter } from "expo-router";
import { FirebaseError } from "firebase/app";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
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
              <Text className="text-white">Login</Text>
            </Pressable>
            <View className="items-center justify-center pt-2">
              <Link href="/signup">
                <Text className="text-blue">I don't have an account</Text>
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

export default Login;
