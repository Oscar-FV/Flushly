import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { Tabs, TabList, TabTrigger, TabSlot, defaultTabsSlotRender } from 'expo-router/ui';
import * as React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '@/lib/theme';
import { useColorScheme } from 'nativewind';
import { House, Search, User } from 'lucide-react-native';
import { TabBarHeightProvider, useTabBarHeight } from '@/context/tab-bar-height';
import { NavSearchButton } from '@/components/nav-search-button';
import { NavButton } from '@/components/nav-button';
import { NAV_BUTTON_SIZES } from '../../constants/nav-constants';

function TabLayoutContent() {
  const { bottom } = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const { setHeight } = useTabBarHeight();
  const lastHeightRef = React.useRef(0);

  const renderTabScreen = React.useCallback((...args: Parameters<typeof defaultTabsSlotRender>) => {
    const [descriptor, state] = args;
    const shouldKeepAlive = descriptor.route.name === 'index';
    const options = shouldKeepAlive
      ? { ...descriptor.options, unmountOnBlur: false }
      : { ...descriptor.options, unmountOnBlur: true };
    return defaultTabsSlotRender({ ...descriptor, options }, state);
  }, []);

  const handleTabListLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      const nextHeight = event.nativeEvent.layout.height;
      if (nextHeight !== lastHeightRef.current) {
        lastHeightRef.current = nextHeight;
        setHeight(nextHeight);
      }
    },
    [setHeight]
  );

  const theme = THEME[colorScheme ?? 'light'];

  return (
    <Tabs className="relative">
      <TabSlot renderFn={renderTabScreen} />

      <LinearGradient
        colors={[theme.backgroundTransparent, theme.backgroundTransparent2, theme.background]}
        locations={[0, 0.3, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.background, { height: 72 + bottom }]}
        pointerEvents="none"
      />

      <TabList
        onLayout={handleTabListLayout}
        style={[
          styles.tabList,
          {
            paddingBottom: bottom,
            paddingHorizontal: NAV_BUTTON_SIZES.navHorizontalPadding,
          },
        ]}>
        <TabTrigger name="index" href="/(tabs)" asChild>
          <NavButton icon={House} />
        </TabTrigger>

        <TabTrigger name="explore" href="/explore" asChild>
          <NavSearchButton icon={Search} text="Search" collapseWhenSelected />
        </TabTrigger>

        <TabTrigger name="profile" href="/profile" asChild>
          <NavButton icon={User} />
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

export default function TabLayout() {
  return (
    <TabBarHeightProvider>
      <TabLayoutContent />
    </TabBarHeightProvider>
  );
}

const styles = StyleSheet.create({
  tabList: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: NAV_BUTTON_SIZES.navGap
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
