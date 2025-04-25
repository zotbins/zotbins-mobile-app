import React from "react";
import { View } from "react-native";

interface ProgressBarProps {
    progress: number;
    actionAmount: number;
}

const ProgressBar = ({ progress, actionAmount }: ProgressBarProps) => {
    const progressPercent = (progress / actionAmount) * 100;

    return (
        <View className="mt-3">
            <View
                className="relative w-full h-3 rounded-full"
                style={{
                    backgroundColor: "#00000080" // 50% opacity black for uncompleted
                }}
            >
                <View
                    className="absolute left-0 top-0 h-3 rounded-full bg-darkGray"
                    style={{
                        width: `${progressPercent}%`,
                    }}
                />
            </View>
        </View>
    );
};

export default ProgressBar;