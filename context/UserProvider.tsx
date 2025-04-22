import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { getAuth } from "@react-native-firebase/auth";
import { getFirestore, doc, onSnapshot } from "@react-native-firebase/firestore";
  
interface UserContextType {
  user: FirebaseAuthTypes.User | null;
  userDoc: FirebaseFirestoreTypes.DocumentData | null;
}

//default to nulls
const UserContext = createContext<UserContextType>({
  user: null,
  userDoc: null,
});

export const useUserContext = (): UserContextType => useContext(UserContext);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [userDoc, setUserDoc] = useState<FirebaseFirestoreTypes.DocumentData | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = auth.onAuthStateChanged((authUser) => {
      setUser(authUser); //update our state
    });

    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    if (user?.uid) {
      const db = getFirestore();
      const userRef = doc(db, "users", user.uid);

      //listen for realtime updates
      const unsubscribeFirestore = onSnapshot(userRef, (docSnapshot) => {
        if (docSnapshot.exists) {
          setUserDoc(docSnapshot.data());
        }
      });

      return unsubscribeFirestore;
    }
  }, [user?.uid]);

  return (
    <UserContext.Provider value={{ user, userDoc }}>
      {children}
    </UserContext.Provider>
  );
};
  