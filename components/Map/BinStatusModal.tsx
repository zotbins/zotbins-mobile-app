import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
// @ts-ignore
import ProgressBar from "react-native-progress/Bar";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config";

const fullConfig = resolveConfig(tailwindConfig) as any;

const BinStatusModal = (props: {
  name: string;
  closeModal: Function;
  activateRouting: Function;
}) => {
  return (
    <View className=" bg-white rounded-xl shadow-lg absolute bottom-8 h-[150px] w-[350px] flex flex-col gap-12 items-center justify-center">
      <Pressable
        className="rounded-full shadow-md bg-white p-0.5 active:opacity-50 absolute top-[-12] left-[-12] z-10"
        onPress={() => props.closeModal()}
      >
        <Ionicons
          name="close-outline"
          size={24}
          color={fullConfig.theme.colors["red"]}
        />
      </Pressable>

      <View className="flex flex-row w-full flex-1 z-0">
        <Text className="absolute left-4 top-4 text-2xl font-bold color-blue">
          {props.name}
        </Text>
        <Pressable
          onPress={() => {
            props.activateRouting();
          }}
          className="px-4 py-2 rounded-md bg-tintColor active:opacity-50 items-center justify-center absolute right-4 top-4"
        >
          <Text className="text-white">Directions</Text>
        </Pressable>
      </View>
      <View className="justify-center flex flex-1 w-full items-center pb-2">
        <Text className="color-blue pb-2 w-full pl-4">Bin Capcity: 30%</Text>
        <ProgressBar
          progress={0.3}
          width={320}
          height={15}
          border={8}
          unfilledColor={"#e4f5e6"}
          color={fullConfig.theme.colors[`tintColor`]}
        />
      </View>
    </View>
  );
};

export default BinStatusModal;
