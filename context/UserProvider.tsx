import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { FirebaseAuthTypes, getAuth } from "@react-native-firebase/auth";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { getStorage, getDownloadURL, ref } from "@react-native-firebase/storage";
import { 
  getFirestore, 
  doc, 
  onSnapshot, 
  collection, 
  query, 
  where, 
  getDocs, 
  writeBatch, 
  getDoc, 
  updateDoc, 
  increment 
} from "@react-native-firebase/firestore";
import { updateAchievementProgress } from "@/functions/src/updateProgress";
  
interface UserContextType {
  user: FirebaseAuthTypes.User | null;
  userDoc: FirebaseFirestoreTypes.DocumentData | null;
  initializing: boolean;
}

//default to nulls
const UserContext = createContext<UserContextType>({
  user: null,
  userDoc: null,
  initializing: true,
});

export const useUserContext = (): UserContextType => useContext(UserContext);

async function populateMissions(uid: string) {
  const db = getFirestore();
  const missionsRef = collection(db, "missions");
  const userMissionsRef = collection(db, "users", uid, "missions");
  const q = query(missionsRef);
  const missionsSnapshot = await getDocs(q);

  const batch = writeBatch(db);
  const now = new Date();
  missionsSnapshot.forEach((document) => {
    const userMissionRef = doc(userMissionsRef, document.id);
    batch.set(userMissionRef, {
      ...document.data(),
      id: document.id,
      progress: 0,
      assignedAt: now.getTime(),
    });
  });

  await batch.commit();
}

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [userDoc, setUserDoc] = useState<FirebaseFirestoreTypes.DocumentData | null>(null);
  const [initializing, setInitializing] = useState(true);

  const initUser = async (uid: string) => {
    setInitializing(true);
    if (!uid) return;

    const db = getFirestore();
    const userRef = doc(db, "users", uid);
    const userSnapshot = await getDoc(userRef);
    if (!userSnapshot.exists) return;
    const userData = userSnapshot.data();

    const lastLoginUpdate = userData?.lastLoginUpdate || Date.now();
    const xp = userData?.xp || 0;
    const userLevel = userData?.level || 1;

    const now = new Date();
    const lastLoginUpdateDate = new Date(lastLoginUpdate);

    const timeDiff = now.getTime() - lastLoginUpdateDate.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);

    // Base update payload for all scenarios
    const baseUpdatePayload = {
      dailyQuestions: 0,
      dailyScans: 0,
      prevResults: [],
      prevQuestions: userData?.prevQuestions || [],
      lastLoginUpdate: now.getTime(),
      xp: increment(5),
    };

    if (hoursDiff >= 24 && hoursDiff < 48) {
      // Update data including new missions
      await populateMissions(uid);
      await updateDoc(userRef, baseUpdatePayload);
      console.log("Data updated for new day");
    } else if (hoursDiff >= 48) {
      // adds new missions
      await populateMissions(uid);
      // reset dailystreak
      await updateDoc(userRef, {
        ...baseUpdatePayload,
        dailyStreak: 0
      });
      console.log("Reset streak and updated data");
    }

    const requiredXPforNextLevel = 50 * (userLevel);
    if (xp >= requiredXPforNextLevel) {
      const newXP = xp - requiredXPforNextLevel;
      await updateDoc(userRef, {
        level: increment(1),
        xp: newXP,
      });
      updateAchievementProgress("level", 1);
    }
    setInitializing(false);
    console.log("User initialized");
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = auth.onAuthStateChanged((authUser) => {
      setUser(authUser); //update our state
      
      if (authUser?.uid) {
        initUser(authUser.uid);
      }
      else{
        setUserDoc(null); //reset user doc if no user
        setInitializing(false); //set initializing to false if no user
      }
    });

    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    if (user?.uid) {
      const db = getFirestore();
      const storage = getStorage();
      const userRef = doc(db, "users", user.uid);

      //listen for realtime updates

      const unsubscribeFirestore = onSnapshot(userRef, async (docSnapshot) => {
        if (!docSnapshot.exists) {
          setUserDoc(null);
          return;
        }
  
        const userData = docSnapshot.data();
        let profilePicURL: string | null = null;
  
        try {
          const profilePicRef = ref(storage, `zotzero-user-profile-pics/${user.uid}`);
          profilePicURL = await getDownloadURL(profilePicRef);
        } catch (error: any) {
          if (error.code !== "storage/object-not-found") {
            console.error("Error fetching profile picture from snapshot:", error);
          }
        }
  
        setUserDoc({ ...userData, photoURL: profilePicURL });
      });

      return unsubscribeFirestore;
    }
  }, [user?.uid]);

  return (
    <UserContext.Provider value={{ user, userDoc, initializing }}>
      {children}
    </UserContext.Provider>
  );
};
