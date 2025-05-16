import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  getFirestore,
  doc,
  collection,
  getDocs,
  writeBatch,
  onSnapshot,
  Timestamp,
} from "@react-native-firebase/firestore";
import { getAuth } from "@react-native-firebase/auth";

interface Achievement {
  id?: string;
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
  const db = getFirestore();

  // helper function to populate the user's sub-collection with the
  // achievements (we can use this when add new achievements, 
  // it will add any missing achievements to the user's sub collection)
  const fetchAchievements = async () => {
    if (!user) {
      console.error("User is not logged in");
      throw new Error("User is not logged in");
    }

    const globalRef = collection(db, "achievements");
    const userRef = collection(db, "users", user.uid, "achievements");

    const [globalSnap, userSnap] = await Promise.all([
      getDocs(globalRef),
      getDocs(userRef),
    ]);

    const existingIds = new Set(userSnap.docs.map(d => d.id));
    const batch = writeBatch(db);

    for (const gDoc of globalSnap.docs) {
      if (!existingIds.has(gDoc.id)) {
        const data = gDoc.data()
        const userDocRef = doc(db, "users", user.uid, "achievements", gDoc.id);
        batch.set(userDocRef, {
          ...data,
          progress: 0,
          userStatus: false,
          dateAchieved: null,
        });
      }
    }

    await batch.commit();
  };

  useEffect(() => {
    if (!user) {
      console.error("User is not logged in");
      setError("User is not logged in");
      setLoading(false);
      return;
    }

    let unsubscribe: () => void;

    (async () => {
      try {
        setLoading(true);
        // new accounts get all achievements populated
        await fetchAchievements();

        // real-time listener on the user's achievements sub-collection
        const userAchievements = collection(db, "users", user.uid, "achievements");
        unsubscribe = onSnapshot(
          userAchievements,
          snapshot => {
            const list = snapshot.docs.map(docSnap => {
              const d = docSnap.data() as Achievement;
              return {
                id: docSnap.id,
                ...d,
                // If the achievement is completed but no dateAchieved, use current timestamp as default
                dateAchieved: d.dateAchieved || Timestamp.now(),
              };
            });
            // Sort the achievements before setting state
            setAchievements(sortAchievements(list));
            setError(null);
            setLoading(false);
          },
          listenError => {
            console.error("Error fetching achievements:", listenError);
            setError("Failed to load achievements");
            setLoading(false);
          }
        );
      } catch (initError) {
        console.error("Error initializing achievements:", initError);
        setError("Failed to initialize achievements");
        setLoading(false);
      }
    })();

    return () => unsubscribe && unsubscribe();
  }, [user]);

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