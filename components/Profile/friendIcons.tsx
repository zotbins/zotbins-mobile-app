import { getAuth } from "@react-native-firebase/auth";
import { getFirestore, doc, getDoc, collection, getDocs, query, where } from "@react-native-firebase/firestore";
import { getStorage, ref, getDownloadURL } from "@react-native-firebase/storage";
import React, { useEffect, useState } from "react";
import { View, Text, Image, ImageSourcePropType, Pressable } from "react-native";
import { useRouter } from "expo-router";

const FriendIcons = () => {
  const router = useRouter();
  const user = getAuth().currentUser;
  const uid = user?.uid || "";
  const db = getFirestore();
  const userDocRef = doc(db, "users", uid);

  const [userDoc, setUserDoc] = useState<any>(null);
  const [friendListSize, setFriendListSize] = useState(0);
  const [friendProfileImages, setFriendProfileImages] = useState<FriendProfile[]>([]);

  useEffect(() => {
    const fetchUserDoc = async () => {
      try {
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists) {
          setUserDoc(userDocSnap.data());
          setFriendListSize(userDocSnap.data()?.friendsList?.length || 0);
        }
      } catch (error) {
        console.error("Error fetching user document: ", error);
      }
    };

    fetchUserDoc();
  }, []);

  const getImageSource = (source: string | ImageSourcePropType) => {
    if (typeof source === "string") {
      return { uri: source };
    }
    return source;
  };

  type FriendProfile = {
    username: string;
    profilePic: string | ImageSourcePropType;
  };

  const fetchFriendProfiles = async (): Promise<FriendProfile[]> => {
    try {
      const friendList = (userDoc?.friendsList || []).slice(0, 3);
      const friendProfiles = await Promise.all(
        friendList.map(async (friendName: string) => {
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("username", "==", friendName));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const friendData = querySnapshot.docs[0].data();
            const friendId = friendData.uid;
            const storage = getStorage();

            try {
              const profilePic = await getDownloadURL(
                ref(storage, `zotzero-user-profile-pics/${friendId}`)
              );
              return { username: friendName, profilePic };
            } catch {
              return {
                username: friendName,
                profilePic: require("@/assets/images/default_profile_picture.png"),
              };
            }
          }
          return null;
        })
      );
      return friendProfiles.filter(Boolean) as FriendProfile[];
    } catch (error) {
      console.error("Error fetching friend profiles: ", error);
      return [];
    }
  };

  useEffect(() => {
    const loadFriendProfiles = async () => {
      if (userDoc) {
        const data = await fetchFriendProfiles();
        setFriendProfileImages(data);
      }
    };
    loadFriendProfiles();
  }, [userDoc]);

  if (friendListSize === 0) {
    return null;
  }

  return (
    <Pressable
      onPress={() => router.push("/friendrequests")}
      className="absolute right-6 bottom-1"
      style={{ width: 110, height: 32 }}
    >
      <View className="flex relative">
        <View style={{ position: 'absolute', right: 64, zIndex: 3 }}>
          {friendProfileImages.length > 0 && (
            <Image
              source={getImageSource(friendProfileImages[0].profilePic)}
              className="w-8 h-8 rounded-full border border-white"
            />
          )}
        </View>

        <View style={{ position: 'absolute', right: 52, zIndex: 2 }}>
          {friendProfileImages.length > 1 && (
            <Image
              source={getImageSource(friendProfileImages[1].profilePic)}
              className="w-8 h-8 rounded-full border border-white"
            />
          )}
        </View>

        <View style={{ position: 'absolute', right: 40, zIndex: 1 }}>
          {friendProfileImages.length > 2 && (
            <Image
              source={getImageSource(friendProfileImages[2].profilePic)}
              className="w-8 h-8 rounded-full border border-white"
            />
          )}
        </View>

        {friendListSize > 3 && (
          <View
            className="bg-primaryGreen rounded-full w-6 h-6 flex items-center justify-center"
            style={{ position: 'absolute', right: 16, top: 4 }}
          >
            <Text className="text-brightGreen font-bold text-center">
              +3
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default FriendIcons;