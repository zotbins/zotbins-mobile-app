import BackButton from "@/components/BackButton";
import { Stack } from "expo-router";
import firestore from "@react-native-firebase/firestore";
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import auth from "@react-native-firebase/auth";

const FriendRequests = () => {
  const [activeTab, setActiveTab] = useState<"sent" | "received">("sent");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>();
  const [friendRequestsSent, setFriendRequestsSent] = useState<string[]>([]);
  const [friendRequestsReceived, setFriendRequestsReceived] = useState<
    string[]
  >(["Alice", "Bob"]); // sample data
  const user = auth().currentUser;

  useEffect(() => {
    setLoading(false);
    const findUsername = async () => {
      const querySnapshot = await firestore()
        .collection("users")
        .where("email", "==", user?.email)
        .get();
      setCurrentUser(querySnapshot.docs[0].data());
    };
    findUsername();
  }, [loading]);

  // finds and returns a user if it exists
  async function findUser(username: string) {
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

  const handleAddFriend = async () => {
    // validation and request handling
    const foundUser = await findUser(username.trim());
    console.log(foundUser?.blockedUsers);
    if (foundUser == null || foundUser == undefined) {
      Alert.alert(
        "Error",
        `Unable to send friend request: user ${username.trim()} not found!`
      );
      return;
    }
    // cannot send request to blocked user
    else if (
      foundUser.length > 0 &&
      foundUser.blocked.includes(currentUser.username)
    ) {
      Alert.alert("Error", "You cannot send a request to this user.");
      return;
    }

    // update sent friend requests array (the current user)
    firestore()
      .collection("users")
      .doc(currentUser.uid)
      .update({
        // no need to check for duplicates since arrayUnion handles that
        friendRequestsSent: firestore.FieldValue.arrayUnion(foundUser.username),
      });

    // update received friend requests array (the receiving user)
    firestore()
      .collection("users")
      .doc(foundUser.uid)
      .update({
        // no need to check for duplicates since arrayUnion handles that
        friendRequestsReceived: firestore.FieldValue.arrayUnion(
          currentUser.username
        ),
      });
    Alert.alert("Success!", `Friend request sent to ${username}`);
    setUsername("");
  };

  const handleAccept = (user: string) => {
    Alert.alert("Accepted", `You accepted ${user}'s friend request.`);
    setFriendRequestsReceived((prev) => prev.filter((u) => u !== user));
  };

  const handleDecline = (user: string) => {
    Alert.alert("Declined", `You declined ${user}'s friend request.`);
    setFriendRequestsReceived((prev) => prev.filter((u) => u !== user));
  };

  const handleBlock = (user: string) => {
    Alert.alert("Blocked", `You blocked ${user}.`);
    setFriendRequestsReceived((prev) => prev.filter((u) => u !== user));
  };

  return (
    <View className="pt-32 flex-1 p-5 bg-white">
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerBackVisible: false,
          headerTransparent: true,
          headerLeft: () => <BackButton />,
          headerTitle: "",
        }}
      />
      <View className="flex-row mb-5">
        {/* sent requests tabs */}
        <Pressable
          className={`flex-1 p-3 items-center border-b-2 ${
            activeTab === "sent" ? "border-blue-500" : "border-gray-300"
          }`}
          onPress={() => setActiveTab("sent")}
        >
          <Text className="text-lg font-bold text-gray-700">Sent Requests</Text>
        </Pressable>

        {/* received requests tab */}
        <Pressable
          className={`flex-1 p-3 items-center border-b-2 ${
            activeTab === "received" ? "border-blue-500" : "border-gray-300"
          }`}
          onPress={() => setActiveTab("received")}
        >
          <Text className="text-lg font-bold text-gray-700">
            Received Requests
          </Text>
        </Pressable>
      </View>

      {/* tab screen for sent requests*/}
      {activeTab === "sent" ? (
        <View>
          <View className="flex-row items-center mb-5">
            {/* search username in search box and add friend */}
            <TextInput
              className="flex-1 border border-gray-300 rounded px-3 py-2 mr-2"
              placeholder="Enter username"
              value={username}
              onChangeText={setUsername}
            />
            <Pressable
              className="bg-tealMed px-4 py-2 rounded"
              onPress={handleAddFriend}
            >
              <Text className="text-white font-bold">Add Friend</Text>
            </Pressable>
          </View>

          {/* view list of sent requests */}
          <Text className="text-xl font-bold mb-3">Friend Requests Sent:</Text>
          {friendRequestsSent.length > 0 ? (
            friendRequestsSent.map((request, index) => (
              <Text key={index} className="text-lg py-1">
                {request}
              </Text>
            ))
          ) : (
            <Text className="text-gray-500">No sent requests.</Text>
          )}
        </View>
      ) : (
        // tab screen for received requests

        // If a request was sent successfully, the sender's username should be appended
        // to the recipient's friendRequestsReceived array, and the recipient's username
        // should be appended to the sender's friendRequestsSent array

        <View>
          <Text className="text-xl font-bold mb-3">
            Friend Requests Received:
          </Text>
          {friendRequestsReceived.length > 0 ? (
            friendRequestsReceived.map((request, index) => (
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
      )}
    </View>
  );
};

export default FriendRequests;
