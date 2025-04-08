import React from "react";
import { Tabs } from "expo-router";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";

import HomeIcon from "@/assets/icons/home-icon.svg";
import MapIcon from "@/assets/icons/location-icon.svg";
import ScanIcon from "@/assets/icons/camera-icon.svg";
import TrophyIcon from "@/assets/icons/trophy-icon.svg";
import ProfileIcon from "@/assets/icons/profile-icon.svg";

const ICON_SIZE = 28;
const ACTIVE_BG = "#C6F6D5";      // light green background for active tab
const ACTIVE_BORDER = "#009838";  // border around active tab
const ACTIVE_ICON = "#48BB78";    // fill color for active icons
const TAB_BG = "#48BB78";         // entire tab bar background

const TabIcon = ({
  Icon,
  focused,
}: {
  Icon: React.FC<React.ComponentProps<typeof HomeIcon>>;
  focused: boolean;
}) => (
  <View
    style={{
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: focused ? ACTIVE_BG : "transparent",
      borderRadius: 16,
      borderWidth: focused ? 1 : 0,
      borderColor: focused ? ACTIVE_BORDER : "transparent",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Icon width={ICON_SIZE} height={ICON_SIZE} color={focused ? ACTIVE_ICON : "white"} />
  </View>
);

export default function Layout() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: TAB_BG,
            position: "absolute",
            bottom: 0,
            height: 90,
            borderRadius: 0,
            elevation: 10,
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
              <View
                style={{
                  position: "absolute",
                  top: -40,
                  width: 72,
                  height: 72,
                  borderRadius: 36,
                  backgroundColor: ACTIVE_BG,
                  elevation: 6,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ScanIcon width={70} height={70} color={ACTIVE_ICON} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="achievements"
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
      <StatusBar style="light" />
    </>
  );
}
