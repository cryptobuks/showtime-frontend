import { useEffect } from "react";
import { useWindowDimensions, Platform, StyleSheet, Alert } from "react-native";

import { BlurView } from "expo-blur";
import * as Updates from "expo-updates";
import dynamic from "next/dynamic";

import { useIsForeground } from "app/hooks/use-is-foreground";
import { useUser } from "app/hooks/use-user";
import { useSafeAreaInsets } from "app/lib/safe-area";

import { View } from "design-system";
import { tw } from "design-system/tailwind";

import {
  HomeTabBarIcon,
  TrendingTabBarIcon,
  CameraTabBarIcon,
  NotificationsTabBarIcon,
  ProfileTabBarIcon,
} from "./tab-bar-icons";
import { NextNavigationProps } from "./types";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNextTabNavigator } from "./universal-navigator/bottom-tab";
import { useNavigationElements } from "./use-navigation-elements";

const HomeNavigator = dynamic(() => import("../pages/home"));
const TrendingNavigator = dynamic(() => import("../pages/trending"));
const CameraNavigator = dynamic(() => import("../pages/camera"));
const NotificationsNavigator = dynamic(() => import("../pages/notifications"));
const ProfileNavigator = dynamic(() => import("../pages/profile"));

// const BottomTab = createBottomTabNavigator();
const BottomTab = createNextTabNavigator();

export function NextTabNavigator({
  pageProps,
  Component,
}: NextNavigationProps) {
  const { width } = useWindowDimensions();
  const { isTabBarHidden } = useNavigationElements();
  const { top: safeAreaTop, bottom: safeAreaBottom } = useSafeAreaInsets();
  const { isAuthenticated } = useUser();
  const isForeground = useIsForeground();

  const color = tw.style("bg-black dark:bg-white")?.backgroundColor as string;
  const tint = color === "#000" ? "light" : "dark";

  useEffect(() => {
    const checkUpdate = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();

          Alert.alert(
            "New update available 🎉",
            "Press 'Reload' to update the app.",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Reload",
                style: "default",
                onPress: () => Updates.reloadAsync(),
              },
            ]
          );
        }
      } catch (e) {
        console.error(e);
      }
    };

    if (Platform.OS !== "web" && !isForeground) {
      checkUpdate();
    }
  }, [isForeground]);

  return (
    <BottomTab.Navigator
      initialRouteName="home"
      screenOptions={{
        lazy: Platform.OS === "android" ? false : true,
        headerShown: false,
        tabBarActiveTintColor: color,
        tabBarInactiveTintColor: color,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [
          {
            height: 64 + safeAreaBottom,
            backgroundColor: "transparent",
            borderTopColor: "transparent",
            position: "absolute",
          },
          width >= 768 && {
            backgroundColor: "transparent",
            borderTopColor: "transparent",
            top: 0,
            left: width / 2 - 100,
            maxWidth: 200,
          },
          // (!isAuthenticated || isTabBarHidden) && {
          //   bottom: -100,
          //   display: Platform.OS === "web" ? "none" : "flex",
          // },
        ],
        tabBarBackground: () =>
          width >= 768 ? null : (
            // <BlurredBackground isDark={isDark} width={width} height={50} />
            <>
              {Platform.OS === "android" ? (
                <View
                  tw="bg-white dark:bg-black opacity-95"
                  style={StyleSheet.absoluteFill}
                />
              ) : (
                <BlurView
                  tint={tint}
                  intensity={95}
                  style={StyleSheet.absoluteFill}
                />
              )}
            </>
          ),
      }}
      Component={Component}
      pageProps={pageProps}
    >
      <BottomTab.Screen
        name="home"
        component={HomeNavigator}
        options={{
          tabBarIcon: HomeTabBarIcon,
        }}
      />
      <BottomTab.Screen
        name="trending"
        component={TrendingNavigator}
        options={{
          tabBarIcon: TrendingTabBarIcon,
        }}
      />
      {width < 768 && (
        <BottomTab.Screen
          name="camera"
          component={CameraNavigator}
          options={{
            tabBarIcon: CameraTabBarIcon,
            headerShown: false,
          }}
        />
      )}
      {width < 768 && (
        <BottomTab.Screen
          name="notifications"
          component={NotificationsNavigator}
          options={{
            tabBarIcon: NotificationsTabBarIcon,
          }}
        />
      )}
      {width < 768 && (
        <BottomTab.Screen
          name="profile"
          component={ProfileNavigator}
          options={{
            tabBarIcon: ProfileTabBarIcon,
          }}
        />
      )}
    </BottomTab.Navigator>
  );
}
