import { Platform, useWindowDimensions } from "react-native";

import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { MotiView } from "moti";

import { useAlert } from "@showtime-xyz/universal.alert";
import { Haptics } from "@showtime-xyz/universal.haptics";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { colors } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { useMyInfo } from "app/hooks/api-hooks";
import { useUser } from "app/hooks/use-user";
import { BlurView } from "app/lib/blurview";

import { useNavigationElements } from "./use-navigation-elements";

export const BottomTabbar = ({
  navigation,
  state,
  descriptors,
}: BottomTabBarProps) => {
  const { width } = useWindowDimensions();
  const { isTabBarHidden } = useNavigationElements();
  const { isAuthenticated, user } = useUser();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();
  const { data: userProfile } = useMyInfo();
  const Alert = useAlert();
  const isDark = useIsDarkMode();
  const router = useRouter();
  const color = isDark ? colors.gray[100] : colors.gray[900];

  return (
    <View
      tw="absolute w-full flex-row pt-2"
      style={[
        {
          height: 64 + safeAreaBottom,
        },
        {
          bottom: !isAuthenticated || isTabBarHidden ? -100 : 0,
        },
      ]}
    >
      <BlurView />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          Haptics.impactAsync();

          if (route.name === "createTab") {
            if (userProfile?.data.can_create_drop === false) {
              const timeRemaining = 24 - new Date().getUTCHours();
              Alert.alert(
                "Wow, you love drops!",
                `Only one drop per day is allowed.\n\nCome back in ${timeRemaining} hours!`
              );
              return;
            }

            router.push(
              Platform.select({
                native: "/drop",
                web: {
                  pathname: router.pathname,
                  query: {
                    ...router.query,
                    dropModal: true,
                  },
                } as any,
              }),
              Platform.select({
                native: "/drop",
                web: router.asPath,
              })
            );
            return;
          }

          if (!focused && !event.defaultPrevented) {
            navigation.navigate({
              name: route.name,
              merge: true,
              params: route.params,
            });
          }
        };
        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };
        return (
          <View key={route.key} tw="flex flex-1 items-center justify-center">
            <Pressable tw="flex-1" onLongPress={onLongPress} onPress={onPress}>
              {options.tabBarIcon?.({ focused, color, size: 24 })}
            </Pressable>
          </View>
        );
      })}

      <MotiView
        style={{
          position: "absolute",
          top: 0,
          height: 2,
          backgroundColor: color,
          width: width / state.routes.length,
        }}
        animate={{
          translateX: (width / state.routes.length) * state.index,
        }}
        transition={{ type: "timing", duration: 250 }}
      />
    </View>
  );
};
