import { View } from 'react-native';
import React, { useEffect } from 'react';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { useColorScheme } from 'nativewind';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

type ErrorTagProps = {
  message?: string;
  hint?: string;
};

export default function ErrorTag({
  message = 'The map is not avaliable.',
  hint = 'We are having some issues, comeback later',
}: ErrorTagProps) {
  const { colorScheme } = useColorScheme();
  const opacity = useSharedValue(1);
  const glow = useSharedValue(0);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.6, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    glow.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    const intensity = 0.2 + glow.value * 0.6;
    return {
      shadowOpacity: intensity,
      shadowRadius: 10 + glow.value * 8,
      elevation: 2 + glow.value * 6,
    };
  });

  const destructive = THEME[colorScheme ?? 'light'].destructive;

  return (
    <View className="flex-1 items-center justify-center">
      <View className="flex flex-row items-center rounded-md border border-border bg-secondary px-4 py-2 shadow-popover">
        <Animated.View
          style={[
            {
              width: 12,
              height: 12,
              marginRight: 10,
              borderRadius: 9999,
              backgroundColor: destructive,
              shadowColor: destructive,
              shadowOffset: { width: 0, height: 0 },
            },
            animatedStyle,
            glowStyle,
          ]}
        />
        <View>
          <Text className="font-medium text-foreground">{message}</Text>
          <Text className="text-xs text-muted-foreground">{hint}</Text>
        </View>
      </View>
    </View>
  );
}
