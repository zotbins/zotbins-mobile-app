import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { Alert, View, Text, Pressable } from "react-native";
import { getAuth } from "@react-native-firebase/auth";
import { getFirestore, doc, getDoc } from "@react-native-firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import LinearGradient from "react-native-linear-gradient";
import ChevronRight from "@/assets/icons/chevron-right.svg";

const EnvImpactPreview = () => {
  const router = useRouter();
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
          await userDocRef.update({
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

  return (
    <View className="mb-3 shadow-sm">
      <LinearGradient
        colors={["#008229", "#DFFFE3", "#B4FABD", "#004C18"]}
        style={{
          padding: 1,
          borderRadius: 35,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="mb-4 shadow-lg"
        locations={[0.1, 0.5, 0.8, 1]}
      >
        <Pressable
          style={{
            padding: 1,
            borderRadius: 35,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 7 },
            shadowOpacity: 0.4,
            shadowRadius: 3.84,
          }}
          className="flex-row py-8 rounded-[33px] justify-evenly bg-lightBackground"
          onPress={() => router.push("/envimpact")}
        >
          <View className="absolute top-4 right-4">
            <ChevronRight />
          </View>
          {/* carbon footprint stats*/}
          <View className="flex-col items-center justify-center px-3">
            <Text className="text-darkestGreen text-lg font-semibold">
              {calculateCO2Saved()}
            </Text>
            <Text className="text-darkestGreen text-lg font-semibold">
              CO₂ saved
            </Text>
          </View>

          {/* vertical divider */}
          <View className="w-px h-full bg-gray-200 self-center"></View>

          <View className="flex-col justify-center items-center px-3">
            <Text className="text-darkestGreen text-lg font-semibold">
              {userDoc?.landfillScanned || 0} items
            </Text>
            <Text className="text-darkestGreen text-lg font-semibold">
              {" "}
              discarded
            </Text>
          </View>

          {/* vertical divider */}
          <View className="w-px h-full bg-gray-200 self-center"></View>

          <View className="flex-col justify-center items-center px-3 mr-4">
            <Text className="text-darkestGreen text-lg font-semibold">
              {userDoc?.recyclableScanned || 0} items
            </Text>
            <Text className="text-darkestGreen text-lg font-semibold">
              {" "}
              recycled
            </Text>
          </View>
        </Pressable>
      </LinearGradient>
    </View>
  );
};

export default EnvImpactPreview;
