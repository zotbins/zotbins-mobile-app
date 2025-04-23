import React from "react";
import { View, Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

interface ItemTypeCardProps {
  count: number;
  type: string;
}

const WasteTypeCard: React.FC<ItemTypeCardProps> = ({ count, type }) => {
  // Define icon based on the type
  let icon = "";
  let label = "";
  
  switch (type.toLowerCase()) {
    case "landfill":
      icon = "trash-outline";
      label = "Discarded";
      break;
    case "recycled":
      icon = "refresh";
      label = "Recycled";
      break;
    case "composted":
      icon = "leaf-outline";
      label = "Composted";
      break;
    default:
      icon = "cube-outline";
      label = type.toLowerCase();
  }

  return (
    <View 
    style={{width: "30%"}}
    className="bg-primaryGreen rounded-2xl p-1">
        <Text className="text-lg text-center text-white px-2 font-semibold">
        {label}
      </Text>
      <View className="bg-white rounded-xl p-4 flex-row items-center justify-center">
        <Ionicons name={icon} size={30} color="#48BB78" className="mr-2" />
        <Text className="text-3xl text-center font-bold text-primaryGreen">
          {count}
        </Text>
      </View>

    </View>
  );
};

export default WasteTypeCard;
