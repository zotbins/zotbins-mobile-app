import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useEffect } from "react";
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
}

const metersToMilesOrFeetString = (meters: number | null) => {
  if (meters === null) {
    return "N/A";
  }
  if (meters > 1609.34) {
    return `${(meters / 1609.34).toFixed(2)} mi`;
  } else {
    return `${meters.toFixed(0)} ft`;
  }
}

const secondsToMinutesString = (seconds: number | null) => {  
  if (seconds === null) {
    return "N/A";
  }
  return `${(seconds / 60).toFixed(0)} min`;
}

const BinStatusBottomSheet: React.FC<BinStatusBottomSheetProps> = 
  ({  bottomSheetRef, 
      onClose, 
      name, 
      activateRouting, 
      distance, 
      eta,
      activeRoute,
      setActiveRoute,
  }) => {


  return (
    
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={[]}
      index={0}
      onDismiss={onClose}
      animateOnMount={true}
    >
      <BottomSheetView
        className="items-center justify-center p-8"
      >
        <View className="flex-row w-full justify-between px-4">
            <Text className="text-3xl font-extrabold text-black">
                {name}
            </Text>

            {activeRoute ? (
                <Pressable
                onPress={() => setActiveRoute(null)}
                className="px-6 py-2 bg-tintColor rounded-full flex-row items-center justify-center active:opacity-50">
                    <Ionicons name="close" size={16} color="white" />
                    <Text className="text-white">Cancel</Text>
                </Pressable>
            ) : (
            <Pressable
              onPress={activateRouting}
              className="px-6 py-2 bg-tintColor rounded-full flex-row items-center justify-center active:opacity-50">
                <Ionicons name="walk"   size={16} color="white" />
                <Text className="text-white ">Go</Text>
  
            </Pressable>
            )}

        </View>

        <View className="w-full border-b border-gray-200 py-3 mx-3" />

        <View className="w-full flex-row items-center justify-between px-4 pt-4">
            <View className="flex-col items-start justify-center">
                <Text className="text-black">Bin Capacity</Text>
                <Text className="text-black font-bold">30%</Text>
            </View>

            <View className="flex-col items-start justify-center">
                <Text className="text-black">Distance</Text>
                <Text className="text-black font-bold">{metersToMilesOrFeetString(distance)}</Text>
            </View>
            <View className="flex-col items-start justify-center">
                <Text className="text-black">ETA</Text>
                <Text className="text-black font-bold">{secondsToMinutesString(eta)}</Text>
            </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default BinStatusBottomSheet;