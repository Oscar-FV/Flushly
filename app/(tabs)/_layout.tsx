import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { StyleSheet } from 'react-native';
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import * as React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '@/lib/theme';
import { useColorScheme } from 'nativewind';
import { House, Search, User } from 'lucide-react-native';
import NavButton from '@/components/nav-button';

export default function TabLayout() {
  const { bottom } = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();

  return (
    <Tabs className="relative">
      <TabSlot />
      <LinearGradient
        colors={[
          THEME[colorScheme ?? 'light'].backgroundTransparent,
          THEME[colorScheme ?? 'light'].backgroundTransparent2,
          THEME[colorScheme ?? 'light'].background,
        ]}
        locations={[0, 0.3, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.background}
        pointerEvents="none"
      />
      <TabList
        style={[
          styles.tabList,
          {
            gap: 16,
            paddingBottom: bottom,
            paddingHorizontal: 42,
          },
        ]}>
        <TabTrigger name="index" href="/(tabs)" asChild>
          <NavButton icon={House} />
        </TabTrigger>

        <TabTrigger name="explore" href="/explore" asChild>
          <NavButton buttonText="Search" icon={Search} className="grow" />
        </TabTrigger>

        <TabTrigger name="profile" href="/profile" asChild>
          <NavButton icon={User} />
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabList: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
  },
  tabTriggerItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
