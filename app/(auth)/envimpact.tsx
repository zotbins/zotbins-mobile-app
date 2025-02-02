import BackButton from "@/components/Reusables/BackButton";
import { Stack } from "expo-router";
import React, { useState, useEffect} from "react";
import { Alert, SafeAreaView, View, Text, Pressable } from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import Ionicons from "react-native-vector-icons/Ionicons";

const envimpact = () => {
    const user = auth().currentUser;
    const [userDoc, setUserDoc] = useState<any>(null);

    // on user change, fetch user document from firestore
    useEffect(() => {
        const fetchUserDoc = async () => {
        const uid = user?.uid;
        if (!uid) {
            return;
        }

        try {
            const userDocRef = firestore().collection("users").doc(uid);
            const userDocSnap = await userDocRef.get();
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
    }, [user]);

  return (
    <View className="bg-white flex-1">
        <Stack.Screen
            options={{
            headerShadowVisible: false,
            headerBackVisible: false,
            headerTransparent: true,
            headerLeft: () => <BackButton />,
            headerTitle: "",
            }}
        />
        <SafeAreaView className="">
            <Text className="text-4xl text-center font-bold">Hi {userDoc?.firstname},</Text>
            <Text className="text-3xl text-center mb-5">This month you...</Text>

            <View className="flex-row justify-center mb-5">
                {/* carbon footprint stats*/}
                <View className="flex items-center justify-center mx-10">
                    <Text className="text-5xl font-bold">500g</Text>
                    <Text className="">CO2 saved!</Text>
                </View>

                

                {/* vertical divider */}
                <View className="w-px h-5/6 bg-gray-300 self-center"></View>
     
                {/* landfill, recycle, compost stats*/}
                <View className="mx-10 flex">
                    <Text className="text-2xl mt-3 font-bold">325 items</Text>
                    <View className="flex-row">
                        <Ionicons name="trash-outline" size={23} color="green"/>
                        <Text className="text-lg"> discarded</Text>
                    </View>

                    <Text className="text-2xl mt-3 font-bold">43 items</Text>
                    <View className="flex-row">
                        <Ionicons name="refresh" size={23} color="green" />
                        <Text className="text-lg"> recycled</Text>
                    </View>

                    <Text className="text-2xl mt-3 font-bold">9 items</Text>
                    <View className="flex-row">
                        <Ionicons name="leaf-outline" size={23} color="green"/>
                        <Text className="text-lg"> composted</Text>
                    </View>
                </View>
            </View>

            <View>
                <Text className="text-lg text-center mb-8">for a total of 800 points earned!</Text>
            </View>

            <View className="bg-tintColor h-full rounded-3xl mx-5">
                <Text className="text-3xl text-center font-bold py-6">Materials</Text>

                <View className="flex-row items-center pb-10 ml-12">
                    <Ionicons name="fast-food-outline" size={70} color="green" />
                    <Text className="text-xl">  10 pieces of plastic</Text>
                </View>

                <View className="flex-row items-center pb-10 ml-12">
                    <Ionicons name="bus" size={70} color="green" />
                    <Text className="text-xl">  9 pieces metals</Text>
                </View>

                <View className="flex-row items-center pb-10 ml-12">
                    <Ionicons name="earth" size={70} color="green" />
                    <Text className="text-xl">  2 pieces of cardboard</Text>
                </View>
                
            </View>

            
        </SafeAreaView>
        
    </View>
  )
}

export default envimpact
