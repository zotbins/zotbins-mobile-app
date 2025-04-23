import BackButton from "@/components/Reusables/BackButton";
import CO2SavedCard from "@/components/EnvImpact/CO2SavedCard";
import { Stack } from "expo-router";
import React, { useState, useEffect } from "react";
import { Alert, SafeAreaView, View, Text, Pressable, ScrollView } from "react-native";
import { getAuth } from "@react-native-firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "react-native-linear-gradient";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const envimpact = () => {
  const user = getAuth().currentUser;
  const [userDoc, setUserDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // on user change, fetch user document from firestore
  useEffect(() => {
    const fetchUserDoc = async () => {
      setLoading(true);
      const uid = user?.uid;
      if (!uid) {
        setLoading(false);
        return;
      }

      try {
        const db = getFirestore();
        const userDocRef = doc(db, "users", uid);
        const userDocSnap = await getDoc(userDocRef);
        if (!userDocSnap.exists) {
          throw new Error("User document does not exist");
        }

        // get user data
        const userData = userDocSnap.data();

        // if landfill, recyclableScanned or compostScanned don't exist, create them
        if (
          userData &&
          (!userData.hasOwnProperty("recyclableScanned") ||
            !userData.hasOwnProperty("compostScanned") ||
            !userData.hasOwnProperty("landfillScanned"))
        ) {
          await updateDoc(userDocRef, {
            recyclableScanned: userData.recyclableScanned || 0,
            compostScanned: userData.compostScanned || 0,
            landfillScanned: userData.landfillScanned || 0,
          });

          // fetch updated document
          const updatedDocSnap = await getDoc(userDocRef);
          setUserDoc(updatedDocSnap.data());
        } else {
          setUserDoc(userData);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user document: ", error);
        Alert.alert("Error", "Failed to fetch user document");
        setLoading(false);
      }
    };

    fetchUserDoc();
  }, [user]);

  // calculate total points
  // adjust points based on item
  const calculateTotalPoints = () => {
    if (!userDoc) return 0;

    const recyclePoints = (userDoc.recyclableScanned || 0) * 2; // 2 points for recycling
    const compostPoints = (userDoc.compostScanned || 0) * 3; // 3 more for composting
    const landfillPoints = userDoc.landfillScanned || 0; // 1 point for landfill

    return recyclePoints + compostPoints + landfillPoints;
  };

  // calculate total items discarded
  const totalItemsDiscarded = () => {
    if (!userDoc) return 0;
    return (
      (userDoc.landfillScanned || 0) +
      (userDoc.recyclableScanned || 0) +
      (userDoc.compostScanned || 0)
    );
  };

  // calculate CO2 saved
  const calculateCO2Saved = () => {
    if (!userDoc) return "0g";

    // calculation: 30g per recycled item, 50g per composted item
    // FAKE sample calculation, change later
    const co2Saved =
      (userDoc.recyclableScanned || 0) * 30 +
      (userDoc.landfillScanned || 0) * 100 +
      (userDoc.compostScanned || 0) * 50;

    return `${co2Saved}g`;
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#F5FFF5", "#DBFFD8"]}
      style={{ flex: 1 }}
    >
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerBackVisible: false,
          headerTransparent: true,
          headerLeft: () => <BackButton />,
          headerTitle: "",
        }}
      />
      <ScrollView>
        <SafeAreaView className="px-6 pt-24 mt-8 justify-center flex-1 bg-lightBackground">
          <Text className="text-4xl font-bold text-darkGreen">
            Your Impact
          </Text>

          <View className="flex-row justify-center mt-12 mb-5">
            <CO2SavedCard co2Saved={calculateCO2Saved()} />
          </View>

          <View className="flex-row justify-center mb-5">
            {/* carbon footprint stats*/}
            <View className="flex items-center justify-center mx-10">
              <Text className="text-5xl font-bold">{calculateCO2Saved()}</Text>
              <Text className="">CO2 saved!</Text>
            </View>

            {/* vertical divider */}
            <View className="w-px h-5/6 bg-gray-300 self-center"></View>

            {/* scanned, landfill, recycle, compost stats*/}
            <View className="mx-10 flex">
              <Text className="text-2xl mt-3 font-bold">
                {userDoc?.landfillScanned || 0} items
              </Text>
              <View className="flex-row">
                <Ionicons name="trash-outline" size={23} color="green" />
                <Text className="text-lg"> discarded</Text>
              </View>

              <Text className="text-2xl mt-3 font-bold">
                {userDoc?.recyclableScanned || 0} items
              </Text>
              <View className="flex-row">
                <Ionicons name="refresh" size={23} color="green" />
                <Text className="text-lg"> recycled</Text>
              </View>

              <Text className="text-2xl mt-3 font-bold">
                {userDoc?.compostScanned || 0} items
              </Text>
              <View className="flex-row">
                <Ionicons name="leaf-outline" size={23} color="green" />
                <Text className="text-lg"> composted</Text>
              </View>
            </View>
          </View>

          <View>
            <Text className="text-lg text-center mb-8">
              for a total of {calculateTotalPoints()} points earned!
            </Text>
          </View>

          <View className="bg-tintColor rounded-3xl mx-5 mb-10 p-5">
            <Text className="text-3xl text-center font-bold py-6">Materials</Text>

            <View className="flex-row items-center pb-10 ml-12">
              <Ionicons name="fast-food-outline" size={70} color="green" />
              <Text className="text-xl">
                {" "}
                {Math.floor((userDoc?.recyclableScanned || 0) * 0.6)} pieces of
                plastic
              </Text>
            </View>

            <View className="flex-row items-center pb-10 ml-12">
              <Ionicons name="bus" size={70} color="green" />
              <Text className="text-xl">
                {" "}
                {Math.floor((userDoc?.recyclableScanned || 0) * 0.3)} pieces
                metals
              </Text>
            </View>

            <View className="flex-row items-center pb-10 ml-12">
              <Ionicons name="earth" size={70} color="green" />
              <Text className="text-xl">
                {" "}
                {Math.floor((userDoc?.recyclableScanned || 0) * 0.1)} pieces of
                cardboard
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </LinearGradient>
  );
};

export default envimpact;
