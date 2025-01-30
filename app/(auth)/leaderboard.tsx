import BackButton from "@/components/Reusables/BackButton";
import firestore from "@react-native-firebase/firestore";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState, useRef } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { currentUserUid } from "../_layout";
import auth from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage";

interface LeaderboardUser {
  pfp: string;
  rank: number;
  points: number;
  username: string;
}

const Leaderboard = () => {
  const router = useRouter();

  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [userScore, setUserScore] = useState<number>(0);
  const [userRank, setUserRank] = useState<number>(0);

  const getProfilePicUrl = async (uid: string) => {
    try {
      const imageRef = storage().ref(`zotzero-user-profile-pics/${uid}`);
      const url = await imageRef.getDownloadURL();
      return url;
    } catch (error) {
      return "https://placehold.co/250";
    }
  };

  /**
   * @description Gets descending order of scores and searches to find the current user's score.
   * Adds rank, usernames, and scores to the leaderboard. Leaderboard only displays top 10 users.
   */
  const dataLoaded = useRef(false);
  useEffect(() => {
    if (dataLoaded.current) return;
    const fetchLeaderboard = async () => {
      try {
        const leaderboardQuery = firestore()
          .collection("users")
          .orderBy("totalPoints", "desc");

        const querySnapshot = await leaderboardQuery.get();
        const leaderboard: LeaderboardUser[] = [];
        for (let doc of querySnapshot.docs) {
          let name = doc.data().username;
          if (doc.data().uid == currentUserUid) {
            setUserScore(doc.data().totalPoints);
            setUserRank(leaderboard.length + 1);
          }
          
          const pfpUrl = await getProfilePicUrl(doc.data().uid);
          leaderboard.push({
            pfp: pfpUrl,
            rank: leaderboard.length + 1,
            username: name,
            points: doc.data().totalPoints,
          });
        }
        dataLoaded.current = true;
        setLeaderboardData(leaderboard.slice(0, 10));
      } catch (error) {
        console.error("Error fetching leaderboard data: ", error);
      }
    };

    fetchLeaderboard();
  }, []);

  const currentUser = { rank: userRank, username: "You", points: userScore };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="pt-24 bg-white"
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
        {/* <Text className="text-xl text-black font-semibold py-4 mb-6 w-full text-center">
          Your Rank: {currentUser.rank} with {currentUser.points} Points
        </Text> */}
        
        <Text className="text-3xl font-medium text-black mb-6">All Rankings</Text>
        {/* Renders top 10 on leaderboard, if user is in top 10 then bolds user */}
        <View className="flex flex-row items-center mb-4 w-full px-4 border-b border-gray-300 py-2">
          <Text className="text-xl text-black font-semibold w-1/4 text-left">Rank</Text>
          <Text className="text-xl text-black font-semibold w-1/2 text-left pl-14">User</Text>
          <Text className="text-xl text-black font-semibold w-1/4 text-right pr-3">Points</Text>
        </View>
        {leaderboardData.map((user, index) =>
          <React.Fragment key={user.rank}>
          <View className="flex flex-row items-center mb-2 w-full px-4">
            <Text className="text-xl text-black font-semibold w-1/4 pl-4">
              {user.rank}
            </Text>
      
            <View className="w-1/2 flex flex-row items-center justify-start">
              <Image
                source={{ uri: user.pfp }}
                className={`w-10 h-10 rounded-full mr-4 ${
                  user.rank === userRank ? 'border-2 border-tintColor' : 'border-2 border-gray-200'
                }`}
              />
              <Text
                className={`text-xl ${
                  user.rank === userRank ? 'text-tintColor' : 'text-black'
                }`}
              >
                {user.rank === userRank ? 'You' : user.username}
              </Text>
            </View>
      
            <Text
              className="text-xl w-1/4 text-center text-black">
              {user.points}
            </Text>
          </View>
      
          {index < leaderboardData.length - 1 && (
            <View className="w-full mb-4 w-full px-4 border-b border-gray-300 py-2" />
          )}
        </React.Fragment>
        )}
      </View>
    </ScrollView>
  );  
};

export default Leaderboard;
