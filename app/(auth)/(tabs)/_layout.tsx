import React from "react";
import { Tabs } from "expo-router";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";

// SVG icon imports (with fill="currentColor" in each SVG file)
import HomeIcon from "@/assets/icons/home-icon.svg";
import TreeIcon from "@/assets/icons/location-icon.svg";
import ScanIcon from "@/assets/icons/camera-icon.svg";
import TrophyIcon from "@/assets/icons/trophy-icon.svg";
import ProfileIcon from "@/assets/icons/profile-icon.svg";

// Styling constants
const ICON_SIZE = 28;
const ACTIVE_BG = "#C6F6D5";      // light green background for active tab
const ACTIVE_BORDER = "#009838";  // border around active tab
const ACTIVE_ICON = "#48BB78";    // fill color for active icons
const TAB_BG = "#48BB78";         // entire tab bar background

// Reusable icon component (except for scan)
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
      backgroundColor: focused ? "#C6F6D5" : "transparent",
      borderRadius: 16,
      borderWidth: focused ? 1 : 0,
      borderColor: focused ? "#009838" : "transparent",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {/* ⬇️ Pass color, NOT fill */}
    <Icon width={28} height={28} color={focused ? "#48BB78" : "white"} />
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
          name="tree"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon Icon={TreeIcon} focused={focused} />
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
                <ScanIcon width={70} height={70} fill="#4A9E5B" />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="trophy"
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
