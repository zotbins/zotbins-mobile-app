import React from "react";
import { View, Text } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import CalendarIcon from "@/assets/icons/calendar.svg";
import { Timestamp } from "@react-native-firebase/firestore";
import ProgressBar from "./ProgressBar";

// green icons
import ArrowIcon from "@/assets/icons/arrow-cursor.svg";
import CheckIcon from "@/assets/icons/check-icon.svg";
import RibbonIcon from "@/assets/icons/ribbon.svg";
import ScannerIcon from "@/assets/icons/scanner-icon.svg";
import StarIcon from "@/assets/icons/star-icon.svg";

// gray icons
import ArrowIconGray from "@/assets/icons/arrow-cursor-gray.svg";
import CheckIconGray from "@/assets/icons/check-icon-gray.svg";
import RibbonIconGray from "@/assets/icons/ribbon-gray.svg";
import ScannerIconGray from "@/assets/icons/scanner-icon-gray.svg";
import StarIconGray from "@/assets/icons/star-icon-gray.svg";

interface AchievementProps {
    achievement: {
        id: number;
        name: string;
        description: string;
        reward: string;
        actionAmount: number;
        progress: number;
        userStatus?: boolean;
        dateAchieved?: Timestamp | null;
    };
}

const Achievement = ({ achievement }: AchievementProps) => {
    const { progress, actionAmount, name, dateAchieved, userStatus, description } = achievement;
    const isCompleted = userStatus;

    const fraction = `(${progress}/${actionAmount})`;

    const greenColor = "#008229";
    const grayColor = "#878787";

    // Format date as MM/DD/YY
    const getFormattedDate = (): string => {
        if (!dateAchieved) return "00/00/00"; // default date (shouldnt happen)

        try {
            const date = dateAchieved.toDate();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const year = String(date.getFullYear()).slice(-2);
            return `${month}/${day}/${year}`;
        } catch (error) {
            return "00/00/00";
        }
    };

    const formattedDateString = getFormattedDate();

    // display random icon for now since i'm not sure how we are going to specify which achievement gets which icon
    const getRandomIcon = () => {
        const icons = isCompleted ? [
            <ArrowIcon width={60} height={60} />,
            <CheckIcon width={40} height={40} />,
            <RibbonIcon width={40} height={40} />,
            <ScannerIcon width={40} height={40} />,
            <StarIcon width={40} height={40} />
        ] : [
            <ArrowIconGray width={60} height={60} />,
            <CheckIconGray width={40} height={40} />,
            <RibbonIconGray width={40} height={40} />,
            <ScannerIconGray width={40} height={40} />,
            <StarIconGray width={40} height={40} />
        ];

        return icons[Math.floor(Math.random() * icons.length)];
    };

    return (
        <View className="mb-3 shadow-sm">
            {/* Gradient Border Container */}
            <LinearGradient
                colors={
                    isCompleted
                        ? [greenColor, "#DFFFE3", "#B4FABD", "#004C18"]
                        : [grayColor, "#D0D0D0", "#B4B4B4", "#333333"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                locations={[0.1, 0.5, 0.8, 1]}
                style={{
                    padding: 1.3,
                    borderRadius: 35,
                }}
                className="mb-4 shadow-lg"
            >
                {/* Achievement Content */}
                <View className={`${isCompleted ? "bg-lightBackground" : "bg-[#e5ebe6]"} p-4 rounded-[33] flex flex-row items-center`}>
                    <View className="w-24 h-24 flex items-center justify-center">
                        {getRandomIcon()}
                    </View>
                    <View className="ml-4 flex-1 mr-2">
                        <Text className={`text-2xl font-bold ${isCompleted ? "text-darkestGreen" : "text-mainTextGray"}`}>
                            {name} {!isCompleted && fraction}
                        </Text>
                        <Text className={`mt-1 ${isCompleted ? "text-darkGreen" : "text-textGray"}`}>
                            {description || "Description example"}
                        </Text>

                        {/* Show progress bar for uncompleted achievements */}
                        {!isCompleted ? (
                            <ProgressBar progress={progress} actionAmount={actionAmount} />
                        ) : (
                            // Show date achieved for completed achievements
                            <View className="mt-1 flex flex-row items-center">
                                <CalendarIcon width={16} height={16} />
                                <Text className="ml-3 text-gray">
                                    {formattedDateString}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
};

export default Achievement;