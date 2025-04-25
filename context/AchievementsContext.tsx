import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
    getFirestore,
    doc,
    collection,
    getDocs,
} from "@react-native-firebase/firestore";
import { getAuth } from "@react-native-firebase/auth";

interface Achievement {
    id: number;
    name: string;
    description: string;
    reward: string;
    actionAmount: number;
    progress: number;
}

interface AchievementsContextType {
    achievements: Achievement[];
    loading: boolean;
    error: string | null;
    refreshAchievements: () => Promise<void>;
}

const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined);

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
                    return {
                        id: data.id,
                        name: data.name,
                        description: data.description,
                        reward: data.reward,
                        actionAmount: data.actionAmount,
                        progress: data.progress,
                    };
                }
            );

            setAchievements(achievementsData);
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