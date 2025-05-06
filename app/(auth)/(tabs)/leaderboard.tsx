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
import {
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { currentUserUid } from "../../_layout";
import {
  getStorage,
  ref,
  getDownloadURL,
} from "@react-native-firebase/storage";
import LinearGradient from "react-native-linear-gradient";
import LeaderboardIcon from "../../../assets/images/leaderboardIcon.png";

interface LeaderboardUser {
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
  const [totalLeaderboardData, setTotalLeaderboardData] = useState<
    LeaderboardUser[]
  >([]);

  const [userTotalScore, setUserTotalScore] = useState<number>(0);
  const [userWeeklyScore, setUserWeeklyScore] = useState<number>(0);
  const [userRank, setUserRank] = useState<number>(0);
  const [userWeeklyRank, setUserWeeklyRank] = useState<number>(0);
  const [username, setUsername] = useState<string>("");
  type TabType = "weekly" | "allRankings" | "friends";
  const [activeTab, setActiveTab] = useState<TabType>("allRankings");
  const [friendList, setFriendList] = useState<string[]>([]);

  const [currentUserData, setCurrentUserData] =
    useState<LeaderboardUser | null>(null);

  const [currentUserWeeklyData, setCurrentUserWeeklyData] =
    useState<LeaderboardUser | null>(null);

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

        // Fetch all-time leaderboard
        const allTimeLeaderboardQuery = query(
          collection(db, "users"),
          orderBy("totalPoints", "desc")
        );

        const allTimeQuerySnapshot = await getDocs(allTimeLeaderboardQuery);
        const allTimeLeaderboard: LeaderboardUser[] = [];
        let currentUserPosition: LeaderboardUser | null = null;

        for (let doc of allTimeQuerySnapshot.docs) {
          const userData = {
            rank: allTimeLeaderboard.length + 1,
            username: doc.data().username,
            points: doc.data().totalPoints,
          };
          if (doc.data().uid == currentUserUid) {
            setUsername(doc.data().username);
            setUserTotalScore(doc.data().totalPoints);
            setUserRank(allTimeLeaderboard.length + 1);
            setFriendList(doc.data().friendsList || []);
            currentUserPosition = userData;
          }

          allTimeLeaderboard.push(userData);
        }
        setTotalLeaderboardData(allTimeLeaderboard);
        setCurrentUserData(currentUserPosition);
        setAllLeaderboardData(allTimeLeaderboard.slice(0, 10));
        // Fetch weekly leaderboard
        const weeklyLeaderboardQuery = query(
          collection(db, "users"),
          orderBy("weeklyPoints", "desc")
        );

        const weeklyQuerySnapshot = await getDocs(weeklyLeaderboardQuery);
        const weeklyLeaderboard: LeaderboardUser[] = [];
        let currentUserWeeklyPosition: LeaderboardUser | null = null;

        for (let doc of weeklyQuerySnapshot.docs) {
          const userData = {
            rank: weeklyLeaderboard.length + 1,
            username: doc.data().username,
            points: doc.data().weeklyPoints || 0, // Default to 0 if weeklyPoints doesn't exist
          };
          if (doc.data().uid == currentUserUid) {
            setUserWeeklyScore(doc.data().weeklyPoints || 0);
            setUserWeeklyRank(weeklyLeaderboard.length + 1);
            currentUserWeeklyPosition = userData;
          }

          weeklyLeaderboard.push(userData);
        }

        setCurrentUserWeeklyData(currentUserWeeklyPosition);
        setWeeklyLeaderboardData(weeklyLeaderboard.slice(0, 10));
        dataLoaded.current = true;
      } catch (error) {
        console.error("Error fetching leaderboard data: ", error);
      }
    };

    fetchLeaderboard();
  }, []);

  const renderLeaderboard = () => {
    let leaderboardData;
    let currentUserSpecificData;

    switch (activeTab) {
      case "weekly":
        leaderboardData = weeklyLeaderboardData;
        currentUserSpecificData = currentUserWeeklyData;
        break;
      case "friends":
        leaderboardData = friendLeaderboardData;
        currentUserSpecificData = currentUserData;
        break;
      case "allRankings":
      default:
        leaderboardData = allLeaderboardData;
        currentUserSpecificData = currentUserData;
        break;
    }

    // Render the top users
    const leaderboardRows = leaderboardData.map((user, index) =>
      renderLeaderboardRow(user, index)
    );

    // If current user isn't in the displayed leaderboard, show them at the bottom
    if (
      currentUserSpecificData &&
      !leaderboardData.some((user) => user.username === username) &&
      activeTab !== "friends" // Don't add to friends tab since user is always included there
    ) {
      leaderboardRows.push(
        <React.Fragment key="current-user-separator">
          <View className="h-8 flex items-center justify-center">
            <Text className="text-gray-500">. . .</Text>
          </View>
        </React.Fragment>
      );

      leaderboardRows.push(
        renderLeaderboardRow(currentUserSpecificData, -1) // Using -1 to indicate special styling if needed
      );
    }

    return leaderboardRows;
  };

  const tabTitles: Record<TabType, string> = {
    weekly: "Weekly Standings",
    allRankings: "All-time Standings",
    friends: "Friends Standings",
  };

  /**
   * @description Takes the entire leaderboard and filters for friends.
   * Updates to support both weekly and all-time points depending on the active tab.
   */
  useEffect(() => {
    if (friendList.length >= 0 && dataLoaded) {
      // The source data will depend on which tab is active
      const sourceData =
        activeTab === "weekly" ? weeklyLeaderboardData : totalLeaderboardData; // total contains all leaderbord data to ensure all friends appear

      const filteredLeaderboard = sourceData.filter(
        (user) =>
          friendList.includes(user.username) || user.username === username
      );

      const rankedLeaderboard = filteredLeaderboard.map((user, index) => ({
        ...user,
        rank: index + 1,
      }));
      setFriendLeaderboardData(rankedLeaderboard);
    }
  }, [
    friendList,
    dataLoaded,
    allLeaderboardData,
    weeklyLeaderboardData,
    activeTab,
  ]);

  const renderLeaderboardRow = (user: LeaderboardUser, index: number) => (
    <React.Fragment
      key={index === -1 ? `user-${user.rank}` : `rank-${user.rank}`}
    >
      <View
        className={
          index === 0
            ? "flex flex-row items-center mb-3 w-[370px] px-4 py-3 bg-highlightGreen2 rounded-3xl shadow-sm gap-x-6"
            : "flex flex-row items-center mb-3 w-[370px] px-4 py-3 bg-lightBackground rounded-3xl shadow-sm gap-x-6"
        }
      >
        <View
          className={
            index === 0
              ? "bg-green-400 rounded-xl px-4 py-3"
              : "rounded-xl px-4 py-3 bg-highlightGreen"
          }
        >
          <Text className="font-bold">{user.rank}</Text>
        </View>

        <View className="w-1/2 flex flex-row items-center">
          <Text
            className={`w-full text-xl ${
              user.username === username
                ? "text-black font-semibold"
                : index === 0
                ? "text-mediumGreen"
                : "text-black"
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
    <LinearGradient colors={["#F5FFF5", "#DBFFD8"]} style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView className="">
          <View className="flex items-center flex-row  mt-2 bg-green-100 rounded-xl border border-green-200 mx-8">
            <TouchableOpacity
              onPress={() => setActiveTab("weekly")}
              className={`flex-1 mx-2 rounded-xl my-1 ${
                activeTab === "weekly" ? "bg-brightGreen2 " : ""
              }`}
            >
              <Text
                className={`text-xl text-center -1 ${
                  activeTab === "weekly"
                    ? "text-brightGreen3 font-bold"
                    : "text-brightGreen3"
                }`}
              >
                Weekly
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab("allRankings")}
              className={`flex-1 mx-2 rounded-xl my-1 ${
                activeTab === "allRankings" ? "bg-brightGreen2" : ""
              }`}
            >
              <Text
                className={`text-xl text-center ${
                  activeTab === "allRankings"
                    ? "text-brightGreen3 font-bold"
                    : "text-brightGreen3"
                }`}
              >
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab("friends")}
              className={`flex-1 mx-2 rounded-xl my-1 ${
                activeTab === "friends" ? "bg-brightGreen2" : ""
              }`}
            >
              <Text
                className={`text-xl text-center ${
                  activeTab === "friends"
                    ? "text-brightGreen3 font-bold"
                    : "text-brightGreen3"
                }`}
              >
                Friends
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            className=""
            showsVerticalScrollIndicator={false}
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

            <View className="flex flex-col items-center px-8 my-4">
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

              <View className="py-16"></View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    </LinearGradient>
  );
};

export default Leaderboard;
