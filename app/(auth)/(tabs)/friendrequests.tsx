import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";

const friendrequests = () => {
  const [activeTab, setActiveTab] = useState<"sent" | "received">("sent");
  const [username, setUsername] = useState("");
  const [friendRequestsSent, setFriendRequestsSent] = useState<string[]>([]);
  const [friendRequestsReceived, setFriendRequestsReceived] = useState<string[]>(["Alice", "Bob"]); // sample data

  const handleAddFriend = () => {
    // validation and request handling
    if (!username.trim()) {
      Alert.alert("Error", "Please enter a valid username.");
      return;
    }
    if (username === "BlockedUser") {
      Alert.alert("Error", "You cannot send a request to this user.");
      return;
    }
    // simulate sending a request
    setFriendRequestsSent((prev) => [...prev, username]);
    Alert.alert("Success", `Friend request sent to ${username}`);
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
    <View className="flex-1 p-5 bg-white">
      
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
              onChangeText={setUsername}/>
            <Pressable
              className="bg-blue-500 px-4 py-2 rounded"
              onPress={handleAddFriend}>
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
          <Text className="text-xl font-bold mb-3">Friend Requests Received:</Text>
          {friendRequestsReceived.length > 0 ? (
            friendRequestsReceived.map((request, index) => (
              <View key={index} className="flex-row items-center justify-between mb-3">
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

export default friendrequests;
