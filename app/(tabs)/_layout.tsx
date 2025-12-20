import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { NAV_THEME } from '@/lib/theme';
import { Tabs } from 'expo-router';
import { HomeIcon, MoonStarIcon, SunIcon, TelescopeIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const theme = NAV_THEME[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        headerRight: () => <ThemeToggle />,
        tabBarActiveTintColor: theme.colors.primary,
        headerTitleAlign: 'center',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon as={HomeIcon} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <TabBarIcon as={TelescopeIcon} color={color} />,
        }}
      />
    </Tabs>
  );
}

type TabBarIconProps = {
  as: React.ComponentProps<typeof Icon>['as'];
  color: string;
};

function TabBarIcon({ as, color }: TabBarIconProps) {
  return <Icon as={as} color={color} size={20} />;
}

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Button
      onPressIn={toggleColorScheme}
      size="icon"
      variant="ghost"
      className="ios:size-9 rounded-full web:mx-4">
      <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-5" />
    </Button>
  );
}
