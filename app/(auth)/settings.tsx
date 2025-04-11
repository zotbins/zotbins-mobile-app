import { getAuth } from "@react-native-firebase/auth";
import { router, Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, SafeAreaView, View, Text, Alert } from "react-native";
import { getFirestore, doc, getDoc } from "@react-native-firebase/firestore";
import BackButton from "@/components/Reusables/BackButton";

const Settings = () => {
  const router = useRouter();

  const user = getAuth().currentUser;

  const [userDoc, setUserDoc] = useState<any>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // on user change, fetch user document from firestore
  useEffect(() => {
    const fetchUserDoc = async () => {
      const uid = user?.uid;
      if (!uid) {
        return;
      }

      try {
        const db = getFirestore();
        const userDocRef = doc(db, "users", uid);
        const userDocSnap = await getDoc(userDocRef);
        if (!userDocSnap.exists) {
          throw new Error("User document does not exist");
        }
        setUserDoc(userDocSnap.data());
      } catch (error) {
        console.error("Error fetching user document: ", error);
        Alert.alert("Error", "Failed to fetch user document");
      }
    };

    fetchUserDoc();
  });

  return (
    <>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerBackVisible: false,
          headerTransparent: true,
          headerLeft: () => <BackButton />,
          headerTitle: "",
        }}
      />
      <SafeAreaView>
        <Pressable
          onPress={() => router.push("/envimpact")}
          className="bg-blue py-3 rounded-lg"
        >
          <Text className="text-white text-center">
            Check Environmental Impact
          </Text>
        </Pressable>

        {/* Friends container */}
        <View className="pb-2">
          <Pressable
            onPress={() => router.push("/friendrequests")}
            className="bg-blue px-4 py-3 rounded-lg my-2 active:opacity-50"
          >
            <Text className="text-white text-center">Friend Requests</Text>
          </Pressable>
          <Text className="text-xl text-center font-bold">Friends</Text>
          {userDoc?.friendsList?.length > 0 ? (
            // TODO: Update types
            userDoc.friendsList.map((friend: any, index: number) => (
              <Text key={index} className="text-center">
                {friend}
              </Text>
            ))
          ) : (
            <Text className="text-center">No friends added yet!</Text>
          )}
        </View>

        <Pressable
          onPress={() => router.push("/achievements")}
          className="bg-blue px-4 py-3 rounded-lg my-2 active:opacity-50"
        >
          <Text className="text-white text-center">Achievements</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/faq")}
          className="bg-blue px-4 py-3 rounded-lg my-2 active:opacity-50"
        >
          <Text className="text-white text-center">FAQ</Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace("/(auth)/spirittrash")}
          className="bg-blue px-4 py-3 rounded-lg my-2 active:opacity-50"
        >
          <Text className="text-white text-center">
            Retake Spirit Trash Quiz
          </Text>
        </Pressable>

        <Pressable
          onPress={() => getAuth().signOut()}
          className="bg-blue px-4 py-3 rounded-lg my-2 active:opacity-50"
        >
          <Text className="text-white text-center">Sign Out</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/passwordchange")}
          className="bg-blue px-4 py-3 rounded-lg my-2 active:opacity-50"
        >
          <Text className="text-white text-center">Change Password</Text>
        </Pressable>
      </SafeAreaView>
    </>
  );
};

export default Settings;
