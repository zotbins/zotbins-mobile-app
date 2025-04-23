import BackButton from "@/components/Reusables/BackButton";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, View, Text, Pressable } from "react-native";
import SentRequests from "@/components/FriendRequests/SentRequests";
import ReceivedRequests from "@/components/FriendRequests/ReceivedRequests";
import LinearGradient from "react-native-linear-gradient";
import FriendsList from "@/components/FriendRequests/FriendsList";

const FriendRequests = () => {
  const [activeTab, setActiveTab] = useState<"sent" | "received">("sent");

  return (
    <LinearGradient colors={["#F5FFF5", "#DBFFD8"]} style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerBackVisible: false,
          headerTransparent: true,
          headerLeft: () => <BackButton />,
          headerTitle: "",
        }}
      />
      <SafeAreaView className="flex-row mb-5">
        <View className="flex items-center py-1 flex-row shadow-sm mt-2 bg-green-100 rounded-xl border border-green-200 mx-5 w-11/12">
          {/* sent requests tabs */}
        <Pressable
        className={`flex-1 mx-2 rounded-xl py-1 ${activeTab === "sent" ? "bg-brightGreen2" : ""}`}
          onPress={() => setActiveTab("sent")}
        >
          <Text
                className={`text-xl text-center -1 ${activeTab === "sent"
                    ? "text-darkestGreen font-semibold"
                    : "text-brightGreen3"
                  }`}
              >
                Friends List
              </Text>
        </Pressable>

        {/* received requests tab */}
        <Pressable
          className={`flex-1 mx-2 rounded-xl py-1 ${activeTab === "received" ? "bg-brightGreen2 " : ""}`}
          onPress={() => setActiveTab("received")}
        >
          <Text
                className={`text-xl text-center -1 ${activeTab === "received"
                    ? "text-darkestGreen font-semibold"
                    : "text-brightGreen3"
                  }`}
              >
                Add Friends
              </Text>
        </Pressable>
          </View>
      </SafeAreaView>

      {/* tab screen for sent requests*/}
      {activeTab === "sent" ? (
        <FriendsList />
      ) : (
        // tab screen for received requests
        <ReceivedRequests />
      )}
    </LinearGradient>
  );
};

export default FriendRequests;
