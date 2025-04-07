import BackButton from "@/components/Reusables/BackButton";
import { collection, query, orderBy, getDocs, getFirestore } from '@react-native-firebase/firestore';
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState, useRef } from "react";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { Image, ScrollView, Text, View, TouchableOpacity } from "react-native";
import { currentUserUid } from "../_layout";
import { getStorage, ref, getDownloadURL } from '@react-native-firebase/storage';

interface LeaderboardUser {
  pfp: string;
  rank: number;
  points: number;
  username: string;
}
const trophy = require('../../assets/images/trophy.png');
const Leaderboard = () => {
  const router = useRouter();
  const [allLeaderboardData, setAllLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [weeklyLeaderboardData, setWeeklyLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [friendLeaderboardData, setFriendLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [userScore, setUserScore] = useState<number>(0);
  const [userRank, setUserRank] = useState<number>(0);
  const [username, setUsername] = useState<string>("");
  const [activeTab, setActiveTab] = useState('all-rankings');
  const [friendList, setFriendList] = useState<string[]>([]);
  const getProfilePicUrl = async (uid: string) => {
    try {
      const storage = getStorage();
      const imageRef = ref(storage, `zotzero-user-profile-pics/${uid}`);
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      return "https://placehold.co/250";
    }
  };

  /**
   * @description Gets descending order of scores and searches to find the current user's score.
   * Adds profile pictures, rank, usernames, and scores to the leaderboard. Leaderboard only displays 
   * top 10 users unless friends are being displayed. 
   */
  const dataLoaded = useRef(false);
  useEffect(() => {
    if (dataLoaded.current) return;
    const fetchLeaderboard = async () => {
      try {
        const db = getFirestore();

        const leaderboardQuery = query(
          collection(db, "users"),
          orderBy("totalPoints", "desc")
        );

        const querySnapshot = await getDocs(leaderboardQuery);
        const leaderboard: LeaderboardUser[] = [];

        for (let doc of querySnapshot.docs) {
          if (doc.data().uid == currentUserUid) {
            setUsername(doc.data().username);
            setUserScore(doc.data().totalPoints);
            setUserRank(leaderboard.length + 1);
            setFriendList(doc.data().friendsList || []);
          }
          const pfpUrl = await getProfilePicUrl(doc.data().uid);
          leaderboard.push({
            pfp: pfpUrl,
            rank: leaderboard.length + 1,
            username: doc.data().username,
            points: doc.data().totalPoints,
          });
        }
        setAllLeaderboardData(leaderboard.slice(0, 10));
        setWeeklyLeaderboardData(leaderboard.slice(0, 10));
        dataLoaded.current = true;
      } catch (error) {
        console.error("Error fetching leaderboard data: ", error);
      }
    };

    fetchLeaderboard();
  }, []);

  const renderLeaderboard = () => {
    switch (activeTab) {
      case 'weekly':
        return weeklyLeaderboardData.map((user, index) => renderLeaderboardRow(user, index));
      case 'friends':
        return friendLeaderboardData.map((user, index) => renderLeaderboardRow(user, index));
      case 'all-rankings':
      default:
        return allLeaderboardData.map((user, index) => renderLeaderboardRow(user, index));
    }
  };


  /**
   * @description Takes the entire leaderboard and filters for friends.
   */
  useEffect(() => {
    if (friendList.length > 0 && dataLoaded) {
      const filteredLeaderboard = allLeaderboardData.filter((user) =>
        friendList.includes(user.username) || (user.username === username)
      );

      const rankedLeaderboard = filteredLeaderboard.map((user, index) => ({
        ...user,
        rank: index + 1,
      }));

      setFriendLeaderboardData(rankedLeaderboard);
    }
  }, [friendList, dataLoaded, allLeaderboardData]);

  // Helper function to render leaderboard rows
  const renderLeaderboardRow = (user: LeaderboardUser, index: number) => (
    <React.Fragment key={user.rank}>
      <View className="flex flex-row items-center mb-2 w-full px-4">
        <Text className="text-xl text-black w-1/4 pl-4">{user.rank}</Text>
        <View className="w-1/2 flex flex-row items-center justify-start">
          <Image
            source={{ uri: user.pfp }}
            className={`w-10 h-10 rounded-full mr-4 ${user.username === username ? 'border-2 border-tintColor' : 'border-2 border-gray-200'}`}
          />
          <Text className={`w-full text-xl ${user.username === username ? 'text-tintColor' : 'text-black'}`}>
            {user.username === username ? 'You' : user.username}
          </Text>
        </View>
        <Text className="text-xl w-1/4 text-center text-black">{user.points}</Text>
      </View>
        <View className="w-full mb-4 w-full px-4 border-b border-gray-300 py-2" />
    </React.Fragment>
  );

  return (
    <SafeAreaProvider >
      <SafeAreaView className="bg-white flex-1">
      <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-white"
      automaticallyAdjustsScrollIndicatorInsets={true}
    >
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerBackVisible: false,
          headerTransparent: true,
          headerLeft: () => <BackButton />,
          headerTitle: "",
        }}
      />
      <View className="flex flex-col items-center px-8">
      <Image
        source={trophy}
        style={{
          width: 100,
          height: 100,
        }}
      />
      <Text className="text-4xl text-black font-semibold my-2">Leaderboard</Text>

        <View className="flex flex-row mb-6 mt-2">
          <TouchableOpacity 
            onPress={() => setActiveTab('all-rankings')}
            className={`flex-1 mx-2 rounded ${activeTab === 'all-rankings' ? 'border-b-4 border-tintColor' : 'text-black border-b-4 border-gray-200'}`}
          >
            <Text className={`text-xl text-center ${activeTab === 'all-rankings' ? 'font-semibold text-darkTintColor' : 'text-black'}`}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('weekly')}
            className={`flex-1 mx-2 rounded ${activeTab === 'weekly' ? 'border-b-4 border-tintColor' : 'text-black border-b-4 border-gray-200'}`}
          >
            <Text className={`text-xl text-center ${activeTab === 'weekly' ? 'text-darkTintColor font-semibold' : 'text-black'}`}>Weekly</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('friends')}
            className={`flex-1 mx-2 rounded ${activeTab === 'friends' ? 'border-b-4 border-tintColor' : 'text-black border-b-4 border-gray-200'}`}
          >
            <Text className={`text-xl text-center ${activeTab === 'friends' ? 'font-semibold text-darkTintColor' : 'text-black'}`}>Friends</Text>
          </TouchableOpacity>
        </View>

        <View className="flex flex-row items-center mb-4 w-full px-4 border-b border-gray-300 py-2">
          <Text className="text-xl text-black font-semibold w-1/4 text-left">Rank</Text>
          <Text className="text-xl text-black font-semibold w-1/2 text-left pl-14">User</Text>
          <Text className="text-xl text-black font-semibold w-1/4 text-right pr-3">Points</Text>
        </View>

        {renderLeaderboard()}
      </View>
    </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Leaderboard;