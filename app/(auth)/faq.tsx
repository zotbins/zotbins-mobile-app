import BackButton from "@/components/Reusables/BackButton";
import { Stack } from "expo-router";
import React from "react";
import { View, Text, SafeAreaView } from "react-native";

const FAQ = () => {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <Stack.Screen
                options={{
                    headerShadowVisible: false,
                    headerBackVisible: false,
                    headerTransparent: true,
                    headerLeft: () => <BackButton />,
                    headerTitle: "",
                }}
            />
        </SafeAreaView>
    );
};

export default FAQ;
