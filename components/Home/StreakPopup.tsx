import React, { useContext } from "react";
import { View, Text, Pressable, Modal, Image } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import StreakFire from "../../assets/images/streakFire.svg";
import RestoreFire from "@/assets/images/RestoreFire.svg"
import { AntDesign } from "@expo/vector-icons";
import { doc, getFirestore, updateDoc } from "@react-native-firebase/firestore";
import { useUserContext } from "@/context/UserProvider";

interface StreakPopupProps {
  visible: boolean;
  onClose: () => void;
  streakCount: number;
  onRestore?: () => void;
  type: "streak" | "restore";
  restoresLeft?: number;
  uid: string;
}

const StreakPopup = ({
  visible,
  onClose,
  streakCount,
  onRestore,
  type,
  restoresLeft,
  uid,
}: StreakPopupProps) => {
  const handleRestore = async () => {
    try {
      onRestore();
    } catch (error) {
      console.error("Error updating restores left:", error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        {type === "streak" ? (
          <>
            <View className="flex-row items-center justify-center w-full mb-4">
              <View className="px-10 py-16 items-center justify-center bg-white rounded-3xl shadow-lg">
                <View className="flex items-center justify-center">
                  <Pressable
                    className="relative bottom-10 left-[110px]"
                    onPress={onClose}
                  >
                    <AntDesign name="close" size={24} color="#00762B" />
                  </Pressable>
                  <View className="items-center">
                    <StreakFire width={200} height={150} />

                    <Text className="text-4xl text-darkGreen font-bold relative -top-16">
                      {streakCount}
                    </Text>
                  </View>
                </View>
                <Text className="text-xl font-bold text-mediumGreen">
                  You continued your streak!
                </Text>
                <Text className="text-center text-gray-600 my-6 text-base/7">
                  You've been ZotBinning for {streakCount} days.{"\n"}That's
                  awesome.
                </Text>
              </View>
            </View>
          </>
        ) : (
          <>
            <View className="flex-row items-center justify-center w-full mb-4">
              <View className="px-10 py-16 items-center justify-center bg-white rounded-3xl shadow-lg">
                <View className="flex items-center justify-center">
                  <Pressable
                    className="relative bottom-10 left-[110px]"
                    onPress={onClose}
                  >
                    <AntDesign name="close" size={24} color="#00762B" />
                  </Pressable>
                  <View className="items-center mb-8">
                    <RestoreFire width={200} height={150} />
                  </View>
                </View>
                <Text className="text-xl font-bold text-mediumGreen">
                  You lost your {streakCount} day streak!
                </Text>
                <Text className="text-center text-gray-600 my-4 text-base/7">
                  You have {restoresLeft} restore left. Restores will {"\n"}reset
                  at the end of the month.
                </Text>
                {restoresLeft || 0 > 0 ?
                  <Pressable className="border rounded-full px-12 py-4 border border-darkGreen bg-primaryGreen mt-4" onPress={handleRestore}>
                    <Text className="text-white text-xl font-bold">
                      Restore
                    </Text>
                  </Pressable>
                  : null}
              </View>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
};

export default StreakPopup;
