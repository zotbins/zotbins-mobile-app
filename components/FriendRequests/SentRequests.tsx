import BackButton from "@/components/Reusables/BackButton";
import { Stack } from "expo-router";
import { getFirestore, doc, getDoc, getDocs, query, collection, where, arrayUnion, updateDoc } from "@react-native-firebase/firestore";
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { getAuth } from "@react-native-firebase/auth";

const SentRequests = () => {
  const [usernameInput, setUsernameInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUsername, setCurrentUsername] = useState<any>();
  const [friendRequestsSent, setFriendRequestsSent] = useState<string[]>([]);

  const user = getAuth().currentUser;

  // get username of current user
  useEffect(() => {
    const findCurrentUser = async () => {
      const db = getFirestore();
      const userRef = doc(db, "users", user?.uid || "");
      const userDocSnap = await getDoc(userRef);
      if (!userDocSnap.exists) {
        console.error("Error fetching user document: User does not exist");
        Alert.alert("Error", "Failed to fetch user document");
        setLoading(false);
        return;
      }
      setCurrentUsername(userDocSnap.data()?.username);
      setFriendRequestsSent(
        userDocSnap.data()?.friendRequestsSent || friendRequestsSent
      );
    };

    findCurrentUser();

    setLoading(false);
  }, [loading]);

  // finds and returns a (receiving) user if it exists
  async function findReceivingUser(username: string) {
    const db = getFirestore();
    const userRef = collection(db, "users");
    const q = query(userRef, where ("username", "==", username.toLowerCase()));
    const querySnapshot = await getDocs(q);

    // check if username exists and is not the user's own
    if (
      !querySnapshot.empty &&
      querySnapshot.docs[0].data().email !== user?.email
    ) {
      return querySnapshot.docs[0].data();
    }
    return null;
  }

  const handleAddFriend = async () => {
    // validation and request handling
    const receivingUser = await findReceivingUser(usernameInput.trim());
    if (receivingUser == null || receivingUser == undefined) {
      Alert.alert(
        "Error",
        `Unable to send friend request: user "${usernameInput.trim()}" unavailable!`
      );
      return;
    }
    // cannot send request to blocked user
    else if (
      receivingUser.blockedUsers.length > 0 &&
      receivingUser.blockedUsers.includes(currentUsername)
    ) {
      Alert.alert("Error", "You cannot send a request to this user.");
      return;
    } else if (friendRequestsSent.includes(usernameInput.trim())) {
      Alert.alert(
        "Error",
        "You have already sent a friend request to this user!"
      );
      return;
    }
    // add receiving user to current user's sentFriendRequests
    const db = getFirestore();
    const userRef = doc(db, "users", user?.uid || "");
    const userDocSnap = await getDoc(userRef);
    if (!userDocSnap.exists) { 
      console.error("Error fetching user document: User does not exist");
      return;
    }

    // update current user's friendRequestsSent
    await updateDoc(userRef, {friendRequestsSent: arrayUnion(
      receivingUser.username)});

    // add current user to receiving user's receivedFriendRequests
    const receivingRef = doc(db, "users", receivingUser.uid);
    const receivingDocSnap = await getDoc(receivingRef);
    if (!userDocSnap.exists) { 
      console.error("Error fetching user document: User does not exist");
      return;
    }
    await updateDoc(receivingRef, {friendRequestsReceived:
      arrayUnion(currentUsername)})
    Alert.alert("Success!", `Friend request sent to ${usernameInput}`);
    setUsernameInput("");
    setFriendRequestsSent((prev) => [...prev, usernameInput]);
  };

  if (loading) {
    return (
      <View>
        <Stack.Screen
          options={{
            headerShadowVisible: false,
            headerBackVisible: false,
            headerTransparent: true,
            headerLeft: () => <BackButton />,
            headerTitle: "",
          }}
        />
        <Text className="text-xl">Loading</Text>
      </View>
    );
  } else {
    return (
      <View>
        <View className="flex-row items-center mb-5">
          {/* search username in search box and add friend */}
          <TextInput
            className="flex-1 border border-gray-300 rounded px-3 py-2 mr-2"
            placeholder="Enter username"
            value={usernameInput}
            onChangeText={setUsernameInput}
            autoCapitalize="none"
          />
          <Pressable
            className="bg-blue px-4 py-2 rounded"
            onPress={handleAddFriend}
          >
            <Text className="text-white font-bold">Add Friend</Text>
          </Pressable>
        </View>

        {/* view list of sent requests */}
        <Text className="text-xl font-bold mb-3">Friend Requests Sent:</Text>
        {friendRequestsSent.length > 0 ? (
          friendRequestsSent.map((request: string, index: number) => (
            <Text key={index} className="text-lg py-1">
              {request}
            </Text>
          ))
        ) : (
          <Text className="text-gray-500">No sent requests.</Text>
        )}
      </View>
    );
  }
};

export default SentRequests;
