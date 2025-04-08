import React from "react";
import { Tabs } from "expo-router";
import { Image, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import HomeIcon from "@/assets/icons/home-icon.png";
import TreeIcon from "@/assets/icons/location-icon.png";
import ScanIcon from "@/assets/icons/camera-icon.png";
import TrophyIcon from "@/assets/icons/trophy-icon.png";
import ProfileIcon from "@/assets/icons/profile-icon.png";

const ICON_SIZE = 28;
const ACTIVE_BG = "#C6F6D5";
const ACTIVE_BORDER = "#009838";
const ACTIVE_ICON = "#48BB78";
const TAB_BG = "#48BB78";

const TabIcon = ({
  source,
  focused,
}: {
  source: any;
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
    <Image
      source={source}
      style={{
        width: ICON_SIZE,
        height: ICON_SIZE,
        tintColor: focused ? ACTIVE_ICON : "white",
      }}
      resizeMode="contain"
    />
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
              <TabIcon source={HomeIcon} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="tree"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon source={TreeIcon} focused={focused} />
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
                  backgroundColor: "#C6F6D5",
                  elevation: 6,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={ScanIcon}
                  style={{
                    width: 70, // 80% of 72
                    height: 70,
                    tintColor: "#4A9E5B",
                    resizeMode: "contain",
                  }}
                />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="trophy"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon source={TrophyIcon} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon source={ProfileIcon} focused={focused} />
            ),
          }}
        />
      </Tabs>
      <StatusBar style="light" />
    </>
  );
}
