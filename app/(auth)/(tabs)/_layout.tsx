import React from "react";
import { Tabs, router } from "expo-router";
import { View, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";

import HomeIcon from "@/assets/icons/home-icon.svg";
import MapIcon from "@/assets/icons/location-icon.svg";
import ScanIcon from "@/assets/icons/camera-icon.svg";
import TrophyIcon from "@/assets/icons/trophy-icon.svg";
import ProfileIcon from "@/assets/icons/profile-icon.svg";

const ICON_SIZE = 28;
const ACTIVE_ICON = "#48BB78"; //fill color for active icons
const TAB_BG = "#48BB78"; // entire tab bar background

const TabIcon = ({
  Icon,
  focused,
}: {
  Icon: React.FC<React.ComponentProps<typeof HomeIcon>>;
  focused: boolean;
}) => (
  <View
    className={`rounded-2xl items-center justify-center ${focused ? "bg-[#C6F6D5] border border-[#009838] px-[14px] py-2" : "px-[10px] py-2"
      }`}
  >
    <Icon width={ICON_SIZE} height={ICON_SIZE} color={focused ? ACTIVE_ICON : "white"} />
  </View>
);

export default function Layout() {
  const windowHeight = Dimensions.get('window').height; 
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: TAB_BG,
            position: "absolute",
            bottom: 0,
            height: windowHeight * 0.1,
            borderRadius: 0,
            elevation: 10,
            paddingHorizontal: 10,
          },
          tabBarItemStyle: {
            marginHorizontal: -2,
          },
          tabBarShowLabel: false,
          headerShown: false,
        }}
      >

        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon Icon={HomeIcon} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon Icon={MapIcon} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="scan"
          options={{
            tabBarIcon: () => (
              <View className="absolute -top-10 w-[72px] h-[72px] rounded-full bg-[#C6F6D5] items-center justify-center">
                <ScanIcon width={70} height={70} color={ACTIVE_ICON} />
              </View>
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault(); // Prevent default navigation
              router.push("/(auth)/camera"); // Navigate to the camera screen
            },
          }}
        />
        <Tabs.Screen
          name="leaderboard"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon Icon={TrophyIcon} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon Icon={ProfileIcon} focused={focused} />
            ),
          }}
        />

      </Tabs>
    </>
  );
}
