import BackButton from "@/components/Reusables/BackButton";
import { Stack } from "expo-router";
import { getFirestore, doc, getDoc, getDocs, query, collection, where, arrayUnion, updateDoc, arrayRemove } from "@react-native-firebase/firestore";
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, Alert, Image } from "react-native";
import { getAuth } from "@react-native-firebase/auth";
import { getDownloadURL, getStorage, ref } from "@react-native-firebase/storage";
import LinearGradient from "react-native-linear-gradient";
import StreakIcon from "@/components/Profile/streakIcon.svg";
import CloseButton from '@/components/Reusables/close-button.svg';

interface Friend {
  username: string;
  level: number;
  streak: number;
  spiritTrash: string;
  uid: string;
  profilePic?: string;
}

const SentRequests = () => {
  const [usernameInput, setUsernameInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUsername, setCurrentUsername] = useState<any>();
  const [friendRequestsSent, setFriendRequestsSent] = useState<Friend[]>([]);

  const user = getAuth().currentUser;

  // get username of current user
  useEffect(() => {
    const findCurrentUser = async () => {
      const db = getFirestore();
      const userRef = doc(db, "users", user?.uid || "");
      const userDocSnap = await getDoc(userRef);
      if (!userDocSnap.exists) {
        console.error("Error fetching user document: User does not exist");
        Alert.alert("Error", "Failed to fetch user document");
        setLoading(false);
        return;
      }
      setCurrentUsername(userDocSnap.data()?.username);
      const friendList = userDocSnap.data()?.friendRequestsSent || [];
      if (friendList.length === 0) {
        setFriendRequestsSent([]);
        return;
      }
      const allUsersRef = collection(db, "users");
      const q = query(allUsersRef, where("username", "in", friendList));
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
        const storageRef = ref(storage, `profilePics/${friend.uid}`);
        try {
          const url = await getDownloadURL(storageRef);
          return { ...friend, profilePic: url };
        } catch (error) {
          return { ...friend, profilePic: "" };
        }
      }));
      setFriendRequestsSent(friendsWithPfps);
    }
    findCurrentUser();
    setLoading(false);
  }, [loading]);

  // finds and returns a (receiving) user if it exists
  async function findReceivingUser(username: string) {
    const db = getFirestore();
    const userRef = collection(db, "users");
    const q = query(userRef, where("username", "==", username.toLowerCase()));
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

  const handleAddFriend = async () => {
    // validation and request handling
    const receivingUser = await findReceivingUser(usernameInput.trim());
    if (receivingUser == null || receivingUser == undefined) {
      Alert.alert(
        "Error",
        `Unable to send friend request: user "${usernameInput.trim()}" unavailable!`
      );
      return;
    }
    // cannot send request to blocked user
    else if (
      receivingUser.blockedUsers.length > 0 &&
      receivingUser.blockedUsers.includes(currentUsername)
    ) {
      Alert.alert("Error", "You cannot send a request to this user.");
      return;
    } else if (friendRequestsSent.some(request => request.username === usernameInput.trim())) {
      Alert.alert(
        "Error",
        "You have already sent a friend request to this user!"
      );
      return;
    }
    // add receiving user to current user's sentFriendRequests
    const db = getFirestore();
    const userRef = doc(db, "users", user?.uid || "");
    const userDocSnap = await getDoc(userRef);
    if (!userDocSnap.exists) {
      console.error("Error fetching user document: User does not exist");
      return;
    }

    // update current user's friendRequestsSent
    await updateDoc(userRef, {
      friendRequestsSent: arrayUnion(
        receivingUser.username)
    });

    // add current user to receiving user's receivedFriendRequests
    const receivingRef = doc(db, "users", receivingUser.uid);
    const receivingDocSnap = await getDoc(receivingRef);
    if (!userDocSnap.exists) {
      console.error("Error fetching user document: User does not exist");
      return;
    }
    await updateDoc(receivingRef, {
      friendRequestsReceived:
        arrayUnion(currentUsername)
    })
    Alert.alert("Success!", `Friend request sent to ${usernameInput}`);
    setUsernameInput("");
    setLoading(true);
  };

  const onRemoveRequest = async (friendUsername: string, friendUid: string) => {
    const user = getAuth().currentUser;
    if (user) {
      const db = getFirestore();
      const userRef = doc(db, "users", user?.uid || "");
      const userDoc = await getDoc(userRef);
      const friendRef = doc(db, "users", friendUid);
      await updateDoc(userRef, {
        friendRequestsSent: arrayRemove(friendUsername)
      });
      await updateDoc(friendRef, {
        friendRequestsReceived: arrayRemove(currentUsername)
      });
      Alert.alert("Removed", `You removed ${friendUsername} from your sent requests.`);
      setLoading(true);
    }
  }

  if (loading) {
    return (
      <View>
        <Text className="text-xl">Loading</Text>
      </View>
    );
  } else {
    return (
      <View>
        <View className="flex-col mb-5 gap-4 mt-6">
          <Text className="text-darkGreen text-3xl font-semibold mt-3">Add Friends</Text>
          {/* search username in search box and add friend */}
          <TextInput
            className="border border-gray-400 rounded-full bg-white px-3 h-12"
            placeholder="Enter username"
            value={usernameInput}
            onChangeText={setUsernameInput}
            autoCapitalize="none"
          />
          <View className="flex items-end">
            <Pressable
              className="bg-primaryGreen border border-darkGreen py-3 rounded-full w-1/3 items-center"
              onPress={handleAddFriend}
            >
              <Text className="text-white font-bold">Add Friend</Text>
            </Pressable>
          </View>
        </View>

        {/* view list of sent requests */}
        <Text className="text-darkGreen text-3xl font-semibold mt-4 mb-4">Sent Requests</Text>
        <View className="gap-4">
          {friendRequestsSent.length > 0 ? (
            friendRequestsSent.map((friend: Friend, index: number) => (
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
                  <View style={{ borderRadius: 28 }} className="flex-row items-center p-2 pl-4 bg-lightBackground gap-4">
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
                    <View className="flex-col items-left">
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
                </LinearGradient>
                <Pressable
                  onPress={() => onRemoveRequest(friend.username, friend.uid || "")}
                  className="absolute top-4 right-4 flex flex-row items-center justify-center z-10"
                >
                  <CloseButton />
                </Pressable>
              </View>
            ))
          ) : (
            <Text className="text-gray-500">No sent requests.</Text>
          )}
        </View>
      </View>
    );
  }
};

export default SentRequests;
