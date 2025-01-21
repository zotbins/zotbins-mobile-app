import BackButton from "@/components/BackButton";
import firestore from "@react-native-firebase/firestore";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { currentUserUid } from "../_layout";

interface LeaderboardUser {
  rank: number;
  points: number;
  username: string;
}

const Leaderboard = () => {
  const router = useRouter();

  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [userScore, setUserScore] = useState<number>(0);
  const [userRank, setUserRank] = useState<number>(0);
  
 /**
 * @description Gets descending order of scores and searches to find the current user's score. 
 * Adds rank, usernames, and scores to the leaderboard. Leaderboard only displays top 10 users.
 */

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const leaderboardQuery = firestore()
          .collection("scores")
          .orderBy("score", "desc");

        const querySnapshot = await leaderboardQuery.get();
        const leaderboard: LeaderboardUser[] = [];

        querySnapshot.forEach((doc) => {
          let name = doc.data().username;
          if (doc.data().uid == currentUserUid) {
            setUserScore(doc.data().score);
            setUserRank(leaderboard.length + 1);
          }
          leaderboard.push({
            rank: leaderboard.length + 1,
            username: name,
            points: doc.data().score,
          });
        });

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
      <View className="flex flex-col items-center p-4">
        <Text className="text-xl bg-white p-2 mb-4">
          Rank {currentUser.rank} - {currentUser.username} -{" "}
          {currentUser.points} Points
        </Text>
        <Text className="text-2xl font-semibold mb-2">All Rankings</Text>

        {/* Renders top 10 on leaderboard, if user is in top 10 then highlights user */}
        {leaderboardData.map((user) =>
          user.rank == userRank ? (
            <Text className="text-lg text-center mb-2 bg-tintColor"
              key={user.rank}>
              Rank {userRank} - {"You"} - {userScore} Points
            </Text>
          ) : (
            <Text
              className="text-lg text-center mb-2 text-black" key={user.rank}>
              Rank {user.rank} - {user.username} - {user.points} Points
            </Text>
          )
        )}
      </View>
    </ScrollView>
  );
};

export default Leaderboard;
