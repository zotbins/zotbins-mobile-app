import BackButton from "@/components/Reusables/BackButton";
import { Stack } from "expo-router";
import { getFirestore, doc, getDoc, getDocs, where, query, collection, arrayRemove, arrayUnion, updateDoc } from "@react-native-firebase/firestore";
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { getAuth } from "@react-native-firebase/auth";

// If a request was sent successfully, the sender's username should be appended
// to the recipient's friendRequestsReceived array, and the recipient's username
// should be appended to the sender's friendRequestsSent array

const FriendRequests = () => {
  const [loading, setLoading] = useState(true);
  const [currentUsername, setCurrentUsername] = useState<any>();
  const [friendRequestsReceived, setFriendRequestsReceived] = useState<
    string[]
  >([]);
  const user = getAuth().currentUser;

  // get username of current user
  useEffect(() => {
    const findCurrentUser = async () => {
      const db = getFirestore();
      const userRef = doc(db, "users", user?.uid || "");
      const userSnapshot = await getDoc(userRef);
      setCurrentUsername(userSnapshot.data()?.username);
      setFriendRequestsReceived(
        userSnapshot.data()?.friendRequestsReceived || friendRequestsReceived
      );
    };

    findCurrentUser();

    setLoading(false);
  }, [loading]);

  // finds and returns a (receiving) user if it exists
  async function findReceivingUser(username: string) {
    const db = getFirestore();
    const receivingUserRef = collection(db, "users");
    const q = query(receivingUserRef, where("username", "==", username));
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

  // TODO: update typescript later
  // clears a friend request for both sender and recipient
  const clearFriendRequest = async (requestedUser: any) => {
    // remove requested user from current user's friendRequestsReceived
    const db = getFirestore();
    const userRef = doc(db, "users", user?.uid || "");
    await updateDoc(userRef, {
      friendRequestsReceived: arrayRemove(
        requestedUser.username
      ),
    });

    // remove current user from requested user's friendRequestsSent
    const requestedUserRef = doc(db, "users", requestedUser.uid || "");
    await updateDoc(requestedUserRef, {
      friendRequestsSent: arrayRemove(currentUsername),
    }
    );
  };

  const handleAccept = async (requestedUser: string) => {
    Alert.alert("Accepted", `You accepted ${requestedUser}'s friend request.`);
    const foundRequestedUser = await findReceivingUser(requestedUser);

    // add requested user to current user's friends list
    const db = getFirestore();
    const userRef = doc(db, "users", user?.uid || "");
    await updateDoc(userRef, {
      friendsList: arrayUnion(
        foundRequestedUser?.username
      ),
    });

    // add current user to requested user's friends list
    const requestedUserRef = doc(db, "users", foundRequestedUser?.uid || "");
    await updateDoc(requestedUserRef, {
      friendsList: arrayUnion(currentUsername),
    }
    );

    clearFriendRequest(foundRequestedUser);

    setFriendRequestsReceived((prev) =>
      prev?.filter((u) => u !== requestedUser)
    );
  };

  const handleDecline = async (requestedUser: string) => {
    Alert.alert("Declined", `You declined ${requestedUser}'s friend request.`);
    const foundRequestedUser = await findReceivingUser(requestedUser);
    clearFriendRequest(foundRequestedUser);

    setFriendRequestsReceived((prev) =>
      prev?.filter((u) => u !== requestedUser)
    );
  };

  const handleBlock = async (requestedUser: string) => {
    Alert.alert("Blocked", `You blocked ${requestedUser}.`);
    const foundRequestedUser = await findReceivingUser(requestedUser);

    // add requested user to current user's blocked list
    const db = getFirestore();
    const userRef = doc(db, "users", user?.uid || "");
    await updateDoc(userRef, {
      blockedUsers: arrayUnion(
        foundRequestedUser?.username
      ),
    });

    clearFriendRequest(foundRequestedUser);

    setFriendRequestsReceived((prev) =>
      prev?.filter((u) => u !== requestedUser)
    );
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
        <Stack.Screen
          options={{
            headerShadowVisible: false,
            headerBackVisible: false,
            headerTransparent: true,
            headerLeft: () => <BackButton />,
            headerTitle: "",
          }}
        />
        <View className="flex-col mb-5">
          <Text className="text-xl font-bold mb-3">
            Friend Requests Received:
          </Text>
          {friendRequestsReceived!.length > 0 ? (
            friendRequestsReceived!.map((request, index) => (
              <View
                key={index}
                className="flex-row items-center justify-between mb-3"
              >
                <Text className="text-lg">{request}</Text>

                <View className="flex-row">
                  <Pressable
                    className="bg-green-500 px-3 py-1 rounded mr-2"
                    onPress={() => handleAccept(request)}
                  >
                    <Text className="text-white font-bold">Accept</Text>
                  </Pressable>
                  <Pressable
                    className="bg-yellow-500 px-3 py-1 rounded mr-2"
                    onPress={() => handleDecline(request)}
                  >
                    <Text className="text-white font-bold">Decline</Text>
                  </Pressable>
                  <Pressable
                    className="bg-red px-3 py-1 rounded"
                    onPress={() => handleBlock(request)}
                  >
                    <Text className="text-white font-bold">Block</Text>
                  </Pressable>
                </View>
              </View>
            ))
          ) : (
            <Text className="text-gray-500">No received requests.</Text>
          )}
        </View>
      </View>
    );
  }
};

export default FriendRequests;
