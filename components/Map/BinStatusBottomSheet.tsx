import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";

interface BinStatusBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal>;
  onClose: () => void;
  name: string;
  activateRouting: () => void;
  distance: number | null;
  eta: number | null;
  activeRoute: any;
  setActiveRoute: any;
  userLocation: number[];
}
// string format for distance and eta
const metersToMilesOrFeetString = (meters: number | null) => {
  if (meters === null) {
    return "N/A";
  }
  if (meters > 1609.34) {
    return `${(meters / 1609.34).toFixed(2)} mi`;
  } else {
    return `${meters.toFixed(0)} ft`;
  }
};

const secondsToMinutesString = (seconds: number | null) => {
  if (seconds === null) {
    return "N/A";
  }
  return `${(seconds / 60).toFixed(0)} min`;
};

const BinStatusBottomSheet: React.FC<BinStatusBottomSheetProps> = ({
  bottomSheetRef,
  onClose,
  name,
  activateRouting,
  distance,
  eta,
  activeRoute,
  setActiveRoute,
  userLocation,
}) => {
  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={["35%", "55%"]}
      index={1}
      onDismiss={onClose}
      enablePanDownToClose={true}
      onChange={(index) => {
        if (index === 0) {
          bottomSheetRef.current?.close();
        }
      }}
      handleStyle={{
        backgroundColor: "#F4FFF2",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
      }}
      backgroundStyle={{backgroundColor: "#F4FFF2",}}
    >
      {/* Bottom Sheet Content */}
      <BottomSheetView className="items-center justify-center p-8 bg-lightBackground">
        <View className="flex-row w-full justify-between">
          <Text className="text-3xl font-extrabold text-black">{name}</Text>

          {/* Cancel or Go button depending on if a route is active */}
          {activeRoute ? (
            <Pressable
              onPress={() => setActiveRoute(null)}
              className="px-4 py-2 bg-primaryGreen rounded-full flex-row items-center justify-center active:opacity-50"
            >
              <Ionicons name="close" size={16} color="white" />
              <Text className="text-white"> Cancel</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={activateRouting}
              disabled={!userLocation}
              className="px-6 py-2 bg-primaryGreen rounded-full flex-row items-center justify-center active:opacity-50"
            >
              <Ionicons name="walk" size={16} color="white" />
              <Text className="text-white ">Go</Text>
            </Pressable>
          )}
        </View>

        <View className="w-full border-b border-gray py-3 mx-3" />
        {/* Bin Capacity, Distance, ETA (capacity currently hardcoded) */}
        <View className="w-full flex-row items-center justify-between pt-4 px-2">
          <View className="flex-col items-start justify-center">
            <Text className="text-black">Bin Capacity</Text>
            <Text className="text-black font-bold">30%</Text>
          </View>

          <View className="flex-col items-start justify-center">
            <Text className="text-black">Distance</Text>
            <Text className="text-black font-bold">
              {metersToMilesOrFeetString(distance)}
            </Text>
          </View>
          <View className="flex-col items-start justify-center">
            <Text className="text-black">ETA</Text>
            <Text className="text-black font-bold">
              {secondsToMinutesString(eta)}
            </Text>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default BinStatusBottomSheet;
