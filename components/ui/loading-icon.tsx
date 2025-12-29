import React from 'react';
import { Animated, Easing, View, type ViewStyle } from 'react-native';
import { Loader2 } from 'lucide-react-native';
import { Icon } from './icon';
import { cn } from '@/lib/utils';

type LoadingIconProps = {
  size?: number;
  color?: string;
  className?: string;
  style?: ViewStyle;
  durationMs?: number;
};

export function LoadingIcon({
  size = 20,
  color,
  className,
  style,
  durationMs = 900,
}: LoadingIconProps) {
  const spin = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: durationMs,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [durationMs, spin]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[{ transform: [{ rotate }] }, style]}>
      <Icon
        as={Loader2}
        size={size}
        color={color}
        className={cn('text-primary', className)}
      />
    </Animated.View>
  );
}
