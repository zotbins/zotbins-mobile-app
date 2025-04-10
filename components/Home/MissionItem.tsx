import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text } from "react-native";

interface Mission {
    id?: string;
    description: string;
    reward: string;
    status: boolean;
    progress: number;
    name: string;
    type: string;
    userStatus: boolean;
    actionAmount?: number;
}

const MissionItem: React.FC<{ mission: Mission }> = ({ mission }) => {
    return (
        <View className="flex-row items-center pt-1">
            <Ionicons name={mission.userStatus ? "checkmark-circle" : "ellipse-outline"} size={24} color={"green"} />
            <Text className=" ml-2 text-darkGreen text-lg">{mission.name}</Text>

            <Text className="ml-2 text-darkGreen text-lg">{'('}{mission.progress || 0}/{mission.actionAmount || 0}{')'}</Text>
        </View>
    );
};

export default MissionItem;
