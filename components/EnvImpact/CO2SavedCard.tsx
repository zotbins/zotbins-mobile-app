import React from "react";
import { View, Text } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface CO2SavedCardProps {
  co2Saved: string;
}

const CO2SavedCard: React.FC<CO2SavedCardProps> = ({ co2Saved }) => {
  return (
    <View className="bg-primaryGreen rounded-2xl p-1">
      <View className="bg-lightBackground rounded-xl p-5 flex-row items-center justify-center">
        <MaterialCommunityIcons name="tree-outline" size={36} color="#48BB78" className="mr-2" />
        <Text className="text-4xl text-center font-bold text-primaryGreen">
          {co2Saved}
        </Text>
      </View>
      <Text className="text-xl text-center text-white px-6 font-semibold">
        Total CO2 saved
      </Text>
    </View>
  );
};

export default CO2SavedCard;
