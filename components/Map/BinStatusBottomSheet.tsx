import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useEffect } from "react";
import { Pressable, Text, View } from "react-native";

import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";



interface BinStatusBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal>;
  onClose: () => void;
  name: string;
  activateRouting: () => void;
}
const BinStatusBottomSheet: React.FC<BinStatusBottomSheetProps> = ({ bottomSheetRef, onClose, name, activateRouting }) => {
  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={[]}
      index={0}
      onDismiss={onClose}
      animateOnMount={true}
    >
      <BottomSheetView
        className="items-center justify-center  px-8 py-8"
      >
        <View className="flex-row w-full justify-between px-4">
            <Text className="text-3xl font-extrabold text-black">
                {name}
            </Text>

            <Pressable
            onPress={activateRouting}
            className="px-6 py-2 bg-tintColor rounded-full flex-row items-center justify-center active:opacity-50">
                <Ionicons name="walk"   size={16} color="white" />
                <Text className="text-white ">Go</Text>

            </Pressable>

        </View>

        <View className="w-full border-b border-gray-200 py-3 mx-3" />

        <View className="w-full flex-row items-center justify-between px-4 pt-4">
            <View className="flex-col items-start justify-center">
                <Text className="text-black">Bin Capacity</Text>
                <Text className="text-black font-bold">30%</Text>
            </View>

            <View className="flex-col items-start justify-center">
                <Text className="text-black">Distance</Text>
                <Text className="text-black font-bold">0.5 mi</Text>
            </View>
            <View className="flex-col items-start justify-center">
                <Text className="text-black">ETA</Text>
                <Text className="text-black font-bold">10 min</Text>
            </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default BinStatusBottomSheet;