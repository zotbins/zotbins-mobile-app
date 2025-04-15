import BackButton from "@/components/Reusables/BackButton";
import {
  collection,
  query,
  orderBy,
  getDocs,
  getFirestore,
} from "@react-native-firebase/firestore";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState, useRef } from "react";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Image, ScrollView, Text, View, TouchableOpacity } from "react-native";
import { currentUserUid } from "../../_layout";
import {
  getStorage,
  ref,
  getDownloadURL,
} from "@react-native-firebase/storage";
import LinearGradient from "react-native-linear-gradient";
import LeaderboardIcon from "../../../assets/images/leaderboardIcon.png";

interface LeaderboardUser {
  pfp: string;
  rank: number;
  points: number;
  username: string;
}
const trophy = require("@/assets/images/trophy.png");
const Leaderboard = () => {
  const router = useRouter();
  const [allLeaderboardData, setAllLeaderboardData] = useState<
    LeaderboardUser[]
  >([]);
  const [weeklyLeaderboardData, setWeeklyLeaderboardData] = useState<
    LeaderboardUser[]
  >([]);
  const [friendLeaderboardData, setFriendLeaderboardData] = useState<
    LeaderboardUser[]
  >([]);
  const [userScore, setUserScore] = useState<number>(0);
  const [userRank, setUserRank] = useState<number>(0);
  const [username, setUsername] = useState<string>("");
  type TabType = "weekly" | "allRankings" | "friends";
  const [activeTab, setActiveTab] = useState<TabType>("allRankings");
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
      case "weekly":
        return weeklyLeaderboardData.map((user, index) =>
          renderLeaderboardRow(user, index)
        );
      case "friends":
        return friendLeaderboardData.map((user, index) =>
          renderLeaderboardRow(user, index)
        );
      case "allRankings":
      default:
        return allLeaderboardData.map((user, index) =>
          renderLeaderboardRow(user, index)
        );
    }
  };

  const tabTitles: Record<TabType, string> = {
    weekly: "Weekly Standings",
    allRankings: "All-time Standings",
    friends: "Friends Standings",
  };

  /**
   * @description Takes the entire leaderboard and filters for friends.
   */
  useEffect(() => {
    if (friendList.length > 0 && dataLoaded) {
      const filteredLeaderboard = allLeaderboardData.filter(
        (user) =>
          friendList.includes(user.username) || user.username === username
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
      <View
        className={
          index == 0
            ? "flex flex-row items-center mb-3 w-full px-4 py-3 bg-brightGreen2 rounded-3xl shadow-sm gap-x-6"
            : "flex flex-row items-center mb-3 w-full px-4 py-3 bg-lightBackground rounded-3xl shadow-sm gap-x-6"
        }
      >
        <View
          className={
            index == 0
              ? "bg-green-400 rounded-xl px-4 py-3"
              : "rounded-xl px-4 py-3 bg-highlightGreen"
          }
        >
          <Text>{user.rank}</Text>
        </View>

        <View className="w-1/2 flex flex-row items-center">
          <Image
            source={{ uri: user.pfp }}
            className={`w-10 h-10 rounded-full mr-4 ${
              user.username === username
                ? "border-2 border-tintColor"
                : "border-2 border-gray-200"
            }`}
          />
          <Text
            className={`w-full text-xl ${
              user.username === username ? "text-tintColor" : "text-black"
            }`}
          >
            {user.username === username ? "You" : user.username}
          </Text>
        </View>
        <Text className="text-xl w-1/4 text-center text-black">
          {user.points} Pts
        </Text>
      </View>
    </React.Fragment>
  );

  return (
    <SafeAreaProvider>
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
          <LinearGradient colors={["#F5FFF5", "#DBFFD8"]} style={{ flex: 1 }}>
            <View className="flex flex-col items-center px-8 my-4">
              <View className="flex items-center flex-row mb-6 mt-2 bg-green-100 rounded-xl border border-green-200">
                <TouchableOpacity
                  onPress={() => setActiveTab("weekly")}
                  className={`flex-1 mx-2 rounded-lg my-1 ${
                    activeTab === "weekly" ? "bg-brightGreen2 " : ""
                  }`}
                >
                  <Text
                    className={`text-xl text-center -1 ${
                      activeTab === "weekly"
                        ? "text-brightGreen font-bold"
                        : "text-brightGreen"
                    }`}
                  >
                    Weekly
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setActiveTab("allRankings")}
                  className={`flex-1 mx-2 rounded-lg my-1 ${
                    activeTab === "allRankings" ? "bg-brightGreen2" : ""
                  }`}
                >
                  <Text
                    className={`text-xl text-center ${
                      activeTab === "allRankings"
                        ? "text-brightGreen font-bold"
                        : "text-brightGreen"
                    }`}
                  >
                    All
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setActiveTab("friends")}
                  className={`flex-1 mx-2 rounded-lg my-1 ${
                    activeTab === "friends" ? "bg-brightGreen2" : ""
                  }`}
                >
                  <Text
                    className={`text-xl text-center ${
                      activeTab === "friends"
                        ? "text-brightGreen font-bold"
                        : "text-brightGreen"
                    }`}
                  >
                    Friends
                  </Text>
                </TouchableOpacity>
              </View>

              <Text className="text-4xl font-semibold text-darkGreen mt-4">
                {tabTitles[activeTab] || ""}
              </Text>

              <Image
                className="my-8"
                source={LeaderboardIcon}
                style={{
                  width: 120,
                  height: 120,
                }}
              />

              {renderLeaderboard()}
            </View>
          </LinearGradient>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Leaderboard;
