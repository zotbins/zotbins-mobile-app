import BackButton from "@/components/Reusables/BackButton";
import { Stack } from "expo-router";
import { getFirestore, doc, getDoc, getDocs, where, query, collection, arrayRemove, arrayUnion, updateDoc } from "@react-native-firebase/firestore";
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Alert, ScrollView, Image } from "react-native";
import { getAuth } from "@react-native-firebase/auth";
import { getDownloadURL, getStorage, ref } from "@react-native-firebase/storage";
import LinearGradient from "react-native-linear-gradient";
import StreakIcon from "@/components/Profile/streakIcon.svg";

// If a request was sent successfully, the sender's username should be appended
// to the recipient's friendRequestsReceived array, and the recipient's username
// should be appended to the sender's friendRequestsSent array

interface Friend {
  username: string;
  level: number;
  streak: number;
  spiritTrash: string;
  uid: string;
  profilePic?: string;
}

const FriendRequests = () => {
  const [loading, setLoading] = useState(true);
  const [currentUsername, setCurrentUsername] = useState<any>();
  const [friendRequestsReceived, setFriendRequestsReceived] = useState<
    Friend[]
  >([]);
  const user = getAuth().currentUser;

  // get username of current user
  useEffect(() => {
    const findCurrentUser = async () => {
      const db = getFirestore();
      const userRef = doc(db, "users", user?.uid || "");
      const userSnapshot = await getDoc(userRef);
      setCurrentUsername(userSnapshot.data()?.username);
      const friendRequestsReceived = userSnapshot.data()?.friendRequestsReceived || [];
      if (friendRequestsReceived.length === 0) {
        setFriendRequestsReceived([]);
        return;
      }

      const allUsersRef = collection(db, "users");
      const q = query(allUsersRef, where("username", "in", friendRequestsReceived));
      const querySnapshot = await getDocs(q);
      const friendsData: Friend[] = querySnapshot.docs.map((document) => {
        const data = document.data();
        return {
          username: data.username,
          level: data.level,
          streak: data.dailyStreak,
          spiritTrash: data.spiritTrash,
          uid: data.uid
        };
      });
      const storage = getStorage();
      const friendsWithPfps = await Promise.all(friendsData.map(async (friend) => {
        const storageRef = ref(storage, `zotzero-user-profile-pics/${friend.uid}`);
        try {
          const url = await getDownloadURL(storageRef);
          return { ...friend, profilePic: url };
        } catch (error) {
          return { ...friend, profilePic: "" };
        }
      }));
      setFriendRequestsReceived(friendsWithPfps);
    }
    findCurrentUser();
    setLoading(false);
  }, [loading]);

  // finds and returns a (receiving) user if it exists
  async function findReceivingUser(username: string) {
    const db = getFirestore();
    const receivingUserRef = collection(db, "users");
    const q = query(receivingUserRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    // check if username exists and is not the user's own
    if (
      !querySnapshot.empty &&
      querySnapshot.docs[0].data().email !== user?.email
    ) {
      return querySnapshot.docs[0].data();
    }
    return null;
  }

  // TODO: update typescript later
  // clears a friend request for both sender and recipient
  const clearFriendRequest = async (requestedUser: Friend) => {
    // remove requested user from current user's friendRequestsReceived
    const db = getFirestore();
    const userRef = doc(db, "users", user?.uid || "");
    await updateDoc(userRef, {
      friendRequestsReceived: arrayRemove(
        requestedUser.username
      ),
    });

    // remove current user from requested user's friendRequestsSent
    const requestedUserRef = doc(db, "users", requestedUser.uid || "");
    await updateDoc(requestedUserRef, {
      friendRequestsSent: arrayRemove(currentUsername),
    }
    );
    setLoading(true);
  };

  const handleAccept = async (requestedUser: Friend) => {
    Alert.alert("Accepted", `You accepted ${requestedUser.username}'s friend request.`);
    // add requested user to current user's friends list
    const db = getFirestore();
    const userRef = doc(db, "users", user?.uid || "");
    await updateDoc(userRef, {
      friendsList: arrayUnion(
        requestedUser?.username
      ),
    });

    // add current user to requested user's friends list
    const requestedUserRef = doc(db, "users", requestedUser?.uid || "");
    await updateDoc(requestedUserRef, {
      friendsList: arrayUnion(currentUsername),
    }
    );
    clearFriendRequest(requestedUser);
    setFriendRequestsReceived((prev) =>
      prev.filter((friend) => friend.username !== requestedUser.username)
    );


  };

  const handleDecline = async (requestedUser: Friend) => {
    Alert.alert("Declined", `You declined ${requestedUser.username}'s friend request.`);
    clearFriendRequest(requestedUser);
    setFriendRequestsReceived((prev) =>
      prev.filter((friend) => friend.username !== requestedUser.username)
    );
  };

  const handleBlock = async (requestedUser: Friend) => {
    Alert.alert("Blocked", `You blocked ${requestedUser.username}.`);

    // add requested user to current user's blocked list
    const db = getFirestore();
    const userRef = doc(db, "users", user?.uid || "");
    await updateDoc(userRef, {
      blockedUsers: arrayUnion(
        requestedUser?.username
      ),
    });

    clearFriendRequest(requestedUser);
  };

  if (loading) {
    return (
      <View>
        <Text className="text-xl">Loading</Text>
      </View>
    );
  } else {
    return (
      <View>
        <View className="flex-col mb-20">
          <Text className="text-darkGreen text-3xl font-semibold mt-6 mb-4">
            Received Requests
          </Text>
          <View className="gap-4">
            {friendRequestsReceived!.length > 0 ? (
              friendRequestsReceived!.map((friend, index) => (
                <View key={index} className="shadow-sm">
                  <LinearGradient
                    colors={['#004c18', '#DFFFE3', '#DFFFE3', '#004c18']}
                    style={{
                      padding: 1,
                      borderRadius: 28,
                    }}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    locations={[0, 0.07, 0.93, 1]}
                  >
                    <View style={{ borderRadius: 28 }} className="flex-row items-center p-2 pl-4 bg-lightBackground justify-between gap-4">
                      <View className="flex-row items-center">
                        {friend.profilePic ? (
                          <Image
                            source={{ uri: friend.profilePic }}
                            className="w-16 h-16 rounded-full"
                          />
                        ) : (
                          <Image
                            source={require('../../assets/images/default_profile_picture.png')}
                            className="w-16 h-16 rounded-full"
                          />
                        )}
                        <View className="flex-col ml-4">
                          <Text className="text-darkestGreen text-lg font-semibold">{friend.username}</Text>
                          <Text className="text-mediumGreen ml-2">level: {friend.level}</Text>
                          <View className="flex flex-row items-left gap-x-1">
                            <Text className="text-mediumGreen ml-2">
                              {friend.streak}
                            </Text>
                            <StreakIcon />
                          </View>
                          <Text className="text-gray-500  text-sm ml-2">{friend.spiritTrash}</Text>
                        </View>
                      </View>
                      <View className="flex-col gap-2 mr-4">
                        <Pressable
                          className="bg-primaryGreen border border-darkGreen px-3 py-1 rounded-full items-center"
                          onPress={() => handleAccept(friend)}
                        >
                          <Text className="text-white text-sm font-semibold">Confirm</Text>
                        </Pressable>
                        <Pressable
                          className="bg-gray-400 border border-gray-500 px-3 py-1 rounded-full items-center"
                          onPress={() => handleDecline(friend)}
                        >
                          <Text className="text-white text-sm font-semibold">Delete</Text>
                        </Pressable>
                      </View>
                    </View>
                  </LinearGradient>
                </View>
              ))
            ) : (
              <Text className="text-gray-500">No received requests.</Text>
            )}
          </View>
        </View>
      </View>

    );
  }
};

export default FriendRequests;
