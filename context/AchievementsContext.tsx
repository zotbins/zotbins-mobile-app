import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
    getFirestore,
    doc,
    collection,
    getDocs,
    Timestamp,
} from "@react-native-firebase/firestore";
import { getAuth } from "@react-native-firebase/auth";

interface Achievement {
    id: number;
    name: string;
    description: string;
    reward: string;
    rewardAmount: number;
    rewardType: string;
    actionAmount: number;
    actionType: string;
    progress: number;
    userStatus: boolean; // true = completed, false = in-progress
    dateAchieved: Timestamp | null;
}

interface AchievementsContextType {
    achievements: Achievement[];
    loading: boolean;
    error: string | null;
    refreshAchievements: () => Promise<void>;
}

const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined);

// helper function to sort achievements 
const sortAchievements = (achievements: Achievement[]): Achievement[] => {
    // split achievements into completed and in-progress
    const completed = achievements.filter(a => a.userStatus === true);
    const inProgress = achievements.filter(a => a.userStatus === false);
    
    // sort completed achievements by dateAchieved (most recent first)
    const sortedCompleted = completed.sort((a, b) => {
        // if timestamps exist, sort by them (most recent first)
        if (a.dateAchieved && b.dateAchieved) {
            return b.dateAchieved.toMillis() - a.dateAchieved.toMillis();
        }
        // edge case: if one has timestamp and other doesn't, prioritize the one with timestamp
        if (a.dateAchieved) return -1;
        if (b.dateAchieved) return 1;
        // edge case: if neither have a timestamp, sort by progress 
        return (b.progress / b.actionAmount) - (a.progress / a.actionAmount);
    });
    
    // sort in-progress achievements by progress percentage (highest first)
    const sortedInProgress = inProgress.sort((a, b) => {
        return (b.progress / b.actionAmount) - (a.progress / a.actionAmount);
    });
    
    // combine completed first, then in-progress
    return [...sortedCompleted, ...sortedInProgress];
};

export const AchievementsProvider = ({ children }: { children: ReactNode }) => {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const user = getAuth().currentUser;

    const fetchAchievements = async () => {
        if (!user) {
            console.error("User is not logged in");
            setError("User is not logged in");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const db = getFirestore();
            const userRef = doc(db, "users", user.uid);
            const achievementsRef = collection(userRef, "achievements");
            const querySnapshot = await getDocs(achievementsRef);
            
            const achievementsData: Achievement[] = querySnapshot.docs.map(
                (document) => {
                    const data = document.data();
                    const isCompleted = data.userStatus === true
                    
                    return {
                        id: data.id,
                        name: data.name,
                        description: data.description,
                        reward: data.reward,
                        rewardAmount: data.rewardAmount,
                        rewardType: data.rewardType,
                        actionAmount: data.actionAmount,
                        actionType: data.actionType,
                        progress: data.progress,
                        userStatus: isCompleted,
                        // If the achievement is completed but no dateAchieved, use current timestamp as default
                        dateAchieved: data.dateAchieved || (isCompleted ? Timestamp.now() : null),
                    };
                }
            );
            
            // Sort the achievements before setting state
            const sortedAchievements = sortAchievements(achievementsData);
            
            setAchievements(sortedAchievements);
            setError(null);
        } catch (error) {
            console.error("Error fetching achievements:", error);
            setError("Failed to load achievements");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAchievements();
    }, []);

    return (
        <AchievementsContext.Provider
            value={{
                achievements,
                loading,
                error,
                refreshAchievements: fetchAchievements
            }}
        >
            {children}
        </AchievementsContext.Provider>
    );
};

export const useAchievements = () => {
    const context = useContext(AchievementsContext);
    if (context === undefined) {
        throw new Error("make sure to wrap component in AchievementsProvider");
    }
    return context;
};