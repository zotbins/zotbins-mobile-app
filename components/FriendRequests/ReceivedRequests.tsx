import BackButton from "@/components/BackButton";
import { Stack } from "expo-router";
import firestore from "@react-native-firebase/firestore";
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import auth from "@react-native-firebase/auth";

// If a request was sent successfully, the sender's username should be appended
// to the recipient's friendRequestsReceived array, and the recipient's username
// should be appended to the sender's friendRequestsSent array

const FriendRequests = () => {
  const [loading, setLoading] = useState(true);
  const [currentUsername, setCurrentUsername] = useState<any>();
  const [friendRequestsReceived, setFriendRequestsReceived] = useState<
    string[]
  >([]);
  const user = auth().currentUser;

  // get username of current user
  useEffect(() => {
    const findCurrentUser = async () => {
      const querySnapshot = await firestore()
        .collection("users")
        .doc(user?.uid)
        .get();
      setCurrentUsername(querySnapshot.data()?.username);
      setFriendRequestsReceived(querySnapshot.data()?.friendRequestsReceived);
    };

    findCurrentUser();

    setLoading(false);
  }, [loading]);

  // finds and returns a (receiving) user if it exists
  async function findReceivingUser(username: string) {
    const querySnapshot = await firestore()
      .collection("users")
      .where("username", "==", username)
      .get();

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
    await firestore()
      .collection("users")
      .doc(user?.uid)
      .update({
        friendRequestsReceived: firestore.FieldValue.arrayRemove(
          requestedUser.username
        ),
      });

    // remove current user from requested user's friendRequestsSent
    await firestore()
      .collection("users")
      .doc(requestedUser.uid)
      .update({
        friendRequestsReceived:
          firestore.FieldValue.arrayRemove(currentUsername),
      });
  };

  const handleAccept = async (requestedUser: string) => {
    Alert.alert("Accepted", `You accepted ${requestedUser}'s friend request.`);
    const foundRequestedUser = await findReceivingUser(requestedUser);

    // add requested user to current user's friends list
    firestore()
      .collection("users")
      .doc(user?.uid)
      .update({
        // no need to check for duplicates since arrayUnion handles that
        friendsList: firestore.FieldValue.arrayUnion(
          foundRequestedUser?.username
        ),
      });

    // add current user to requested user's friends list
    firestore()
      .collection("users")
      .doc(foundRequestedUser?.uid)
      .update({
        // no need to check for duplicates since arrayUnion handles that
        friendsList: firestore.FieldValue.arrayUnion(currentUsername),
      });

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
    firestore()
      .collection("users")
      .doc(user?.uid)
      .update({
        // no need to check for duplicates since arrayUnion handles that
        blockedUsers: firestore.FieldValue.arrayUnion(
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
