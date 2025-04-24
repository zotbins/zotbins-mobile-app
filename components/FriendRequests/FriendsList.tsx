import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, Pressable, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { getFirestore, doc, getDoc, getDocs, where, query, collection, updateDoc, arrayRemove } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import { getDownloadURL, getStorage, ref } from '@react-native-firebase/storage';
import LinearGradient from 'react-native-linear-gradient';
import StreakIcon from '@/components/Profile/streakIcon.svg';
import CloseButton from '@/components/Reusables/close-button.svg';

interface Friend {
    username: string;
    level: number;
    streak: number;
    spiritTrash: string;
    uid: string;
    profilePic?: string;
}

const FriendsList = () => {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState<string>("");
    useEffect(() => {
        const fetchFriendsData = async () => {
            const user = getAuth().currentUser;
            if (user) {
                const db = getFirestore();
                const userRef = doc(db, "users", user?.uid || "");
                const userSnapshot = await getDoc(userRef);
                setUsername(userSnapshot.data()?.username);
                const friendList = userSnapshot.data()?.friendsList || [];
                if (friendList.length === 0) {
                    setFriends([]);
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
                setFriends(friendsWithPfps);
            }
        }
        fetchFriendsData();
        setLoading(false);
    }, [loading]);

    const onRemoveFriend = async (friendUsername: string, friendUid: string) => {
        const user = getAuth().currentUser;
        if (user) {
            const db = getFirestore();
            const userRef = doc(db, "users", user?.uid || "");
            const friendRef = doc(db, "users", friendUid);
            await updateDoc(userRef, {
                friendsList: arrayRemove(friendUsername)
            });
            await updateDoc(friendRef, {
                friendsList: arrayRemove(username)
            });
            Alert.alert("Friend Deleted", `You removed ${friendUsername} as a friend.`);
            setLoading(true);
        }    
    }

    return (
        <ScrollView>
            <View className="mx-6 mt-6">
                <View className="flex-col items-left mb-20 gap-4">
                    <Text className="text-darkGreen text-3xl font-semibold mt-3">Friends List</Text>
                    {friends.length > 0 ? (friends.map((friend, index) => (
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
                                <Pressable
                                        onPress={() => onRemoveFriend(friend.username, friend.uid || "")}
                                        className="absolute top-4 right-4 flex flex-row items-center justify-center"
                                    >
                                       <CloseButton/>
                                    </Pressable>
                            </LinearGradient>
                        </View>
                    ))) :<Text className="text-gray-600 text-md">No friends right now.</Text>}
                </View>
            </View>
        </ScrollView>
    )
}

export default FriendsList;