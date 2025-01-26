import BackButton from "@/components/Reusables/BackButton";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import SentRequests from "@/components/FriendRequests/SentRequests";
import ReceivedRequests from "@/components/FriendRequests/ReceivedRequests";

const FriendRequests = () => {
  const [activeTab, setActiveTab] = useState<"sent" | "received">("sent");

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
        <SentRequests />
      ) : (
        // tab screen for received requests
        <ReceivedRequests />
      )}
    </View>
  );
};

export default FriendRequests;
