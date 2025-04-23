import React from "react";
import { View, Text } from "react-native";
import { FontAwesome5, Feather, Ionicons } from "@expo/vector-icons";

interface ItemTypeCardProps {
  count: number;
  type: string;
}

const WasteTypeCard: React.FC<ItemTypeCardProps> = ({ count, type }) => {
  // Define icon based on the type
  let iconType = "ionicons";
  let icon = "";
  let label = "";
  
  switch (type.toLowerCase()) {
    case "landfill":
      iconType = "feather";
      icon = "trash";
      label = "Discarded";
      break;
    case "recycled":
      iconType = "fontawesome5";
      icon = "recycle";
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
        {iconType === "ionicons" ? (
          <Ionicons name={icon} size={30} color="#48BB78" className="mr-2" />
        ) : iconType === "fontawesome5" ? (
          <FontAwesome5 name={icon} size={24} color="#48BB78" className="mr-2" />
        ) : (
          <Feather name={icon} size={24} color="#48BB78" className="mr-2" />
        )}
        <Text className="text-3xl text-center font-bold text-primaryGreen">
          {count}
        </Text>
      </View>
    </View>
  );
};

export default WasteTypeCard;
