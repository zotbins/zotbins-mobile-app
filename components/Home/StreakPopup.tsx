import React from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";

interface StreakPopupProps {
  visible: boolean;
  onClose: () => void;
  streakCount: number;
  type: "streak" | "restore";
  onRestore?: () => void;
  restoresLeft?: number;
}

const StreakPopup = ({
  visible,
  onClose,
  streakCount,
  type,
  onRestore,
  restoresLeft,
}: StreakPopupProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-3xl p-6 m-4 items-center w-[80%]">
          {type === "streak" ? (
            <>
              <View className="w-24 h-24 mb-4">
                <LinearGradient
                  colors={["#50C878", "#3CB371"]}
                  className="w-full h-full rounded-full items-center justify-center"
                >
                  <Text className="text-4xl text-white font-bold">
                    {streakCount}
                  </Text>
                </LinearGradient>
              </View>
              <Text className="text-xl font-bold mb-2">
                You continued your streak!
              </Text>
              <Text className="text-center text-gray-600 mb-4">
                You've been ZotBinning for {streakCount} days.{"\n"}That's
                awesome.
              </Text>
              <Pressable
                className="bg-[#50C878] px-8 py-3 rounded-full"
                onPress={onClose}
              >
                <Text className="text-white font-bold">Continue</Text>
              </Pressable>
            </>
          ) : (
            <>
              <View className="w-24 h-24 mb-4 items-center justify-center">
                <View className="w-full h-full rounded-full bg-gray-300 items-center justify-center">
                  <Text className="text-4xl">🔥</Text>
                </View>
              </View>
              <Text className="text-xl font-bold mb-2">
                You lost your {streakCount} day streak!
              </Text>
              <Text className="text-center text-gray-600 mb-4">
                You have {restoresLeft} restore left. Restores will reset{"\n"}
                at the end of the month.
              </Text>
              <View className="flex-row gap-3">
                <Pressable
                  className="bg-gray-200 px-8 py-3 rounded-full"
                  onPress={onClose}
                >
                  <Text className="font-bold">No thanks</Text>
                </Pressable>
                <Pressable
                  className="bg-[#50C878] px-8 py-3 rounded-full"
                  onPress={onRestore}
                >
                  <Text className="text-white font-bold">Restore</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default StreakPopup;
