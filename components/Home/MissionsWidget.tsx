import { ScrollView, Text, View, Dimensions } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { getFirestore, collection, getDocs } from "@react-native-firebase/firestore";
import { getAuth, FirebaseAuthTypes } from "@react-native-firebase/auth";
import { LinearGradient } from "expo-linear-gradient";
import MissionItem from "./MissionItem";

const screenWidth = Dimensions.get("window").width;

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

const MissionsWidget = () => {
    const [dailyMissions, setDailyMissions] = useState<Mission[]>([]);
    const [weeklyMissions, setWeeklyMissions] = useState<Mission[]>([]);
    const [widgetWidth, setWidgetWidth] = useState<number>(0); // Track widget width
    const [currentIndex, setCurrentIndex] = useState(0); // Track current screen index
    const scrollViewRef = useRef<ScrollView>(null);
    const user = getAuth().currentUser;

    const getMissions = async (user: FirebaseAuthTypes.User) => {
        try {
            const db = getFirestore();
            const missionsCollectionRef = collection(db, "users", user.uid, "missions");
            const querySnapshot = await getDocs(missionsCollectionRef);

            const allMissions: Mission[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                allMissions.push({
                    id: doc.id,
                    description: data.description,
                    reward: data.reward,
                    status: data.status,
                    progress: data.progress,
                    name: data.name,
                    type: data.type,
                    userStatus: data.userStatus,
                    actionAmount: data.actionAmount,
                });
            });

            const allDailyMissions = allMissions.filter((mission) => mission.type === "daily");
            const allWeeklyMissions = allMissions.filter((mission) => mission.type === "weekly");

            const randomDailyMissions = allDailyMissions.sort(() => Math.random() - 0.5).slice(0, 3);
            const randomWeeklyMissions = allWeeklyMissions.sort(() => Math.random() - 0.5).slice(0, 3);

            setDailyMissions(randomDailyMissions);
            setWeeklyMissions(randomWeeklyMissions);
        } catch (error) {
            console.error("Error fetching missions: ", error);
        }
    };

    const handleScroll = (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / widgetWidth);
        setCurrentIndex(index);
    };

    useEffect(() => {
        if (user) getMissions(user);
        else console.error("User is not logged in");
    }, []);

    return (
        <LinearGradient
            colors={["#004c18", "#DFFFE3", "#DFFFE3", "#004c18"]}
            style={{
                padding: 1,
                borderRadius: 35,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.4,
                shadowRadius: 3.84,
            }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="mb-4 shadow-lg"
            locations={[0, 0.1, 0.9, 1]}
        >
            <View
                style={{ borderRadius: 35 }}
                className="bg-lightBackground w-full py-5"
                onLayout={(event) => setWidgetWidth(event.nativeEvent.layout.width)} // Capture widget width
            >
                <Text className="text-darkGreen text-2xl font-semibold px-5">Missions</Text>

                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    snapToAlignment="center"
                    snapToInterval={widgetWidth} // Use dynamic widget width
                    decelerationRate="fast"
                    className="pl-5"
                    onScroll={handleScroll} // Track scroll position
                    scrollEventThrottle={16}
                >
                    
                    <View style={{ width: widgetWidth }} className="">
                        <Text className="text-2xl font-base text-darkGreen mb-2">Daily</Text>
                        {dailyMissions.map((mission) => (
                            <MissionItem key={mission.id} mission={mission} />
                        ))}
                    </View>

                
                    <View style={{ width: widgetWidth }} className="">
                        <Text className="text-2xl font-base text-darkGreen mb-2">Weekly</Text>
                        {weeklyMissions.map((mission) => (
                            <MissionItem key={mission.id} mission={mission} />
                        ))}
                    </View>
                </ScrollView>

                {/* navigation dots */}
                <View className="flex-row justify-center mt-3">
                    {[0, 1].map((index) => (
                        <View
                            key={index}

                            className={"w-3 h-3 rounded-full mx-1 " + (currentIndex === index ? "bg-primaryGreen" : "bg-grey")}
                        />
                    ))}
                </View>
            </View>
        </LinearGradient>
    );
};

export default MissionsWidget;