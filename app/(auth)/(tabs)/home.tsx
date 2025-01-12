import { View, Text, Pressable } from "react-native";
import React from "react";
import { Link, Stack } from "expo-router";
import Header from "@/components/Header";

const Home = () => {
  return (
    <>
      <Stack.Screen
        options={{
          header: () => <Header />,
        }}
      />

      <View className="flex-1 bg-white px-5 py-12">
        <Link href="/quiz" asChild>
          <Pressable className="items-center justify-center py-6 px-8 rounded-md bg-tintColor mb-2 active:opacity-50">
            <Text className="text-white">Daily Quiz</Text>
          </Pressable>
        </Link>
        <Link href="/leaderboard" asChild>
          <Pressable className="items-center justify-center py-6 px-8 rounded-md bg-tintColor mb-2 active:opacity-50">
            <Text className="text-white">Leaderboard</Text>
          </Pressable>
        </Link>
        <Link href="/map" asChild>
          <Pressable className="items-center justify-center py-6 px-8 rounded-md bg-tintColor mb-2 active:opacity-50">
            <Text className="text-white">Map</Text>
          </Pressable>
        </Link>
      </View>
    </>
  );
};

export default Home;
