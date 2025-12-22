import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react-native';
import React, { useEffect } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

type LoaderPinProps = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export const LoaderPin = ({
  top,
  right,
  bottom,
  left,
  size = 42,
  color = '#7B32FF',
}: LoaderPinProps) => {

    const opacity = useSharedValue(1);

    useEffect(() => {
        opacity.value = withRepeat(
            withTiming(0.5, {duration: 1000, easing: Easing.inOut(Easing.ease)}),
            -1,
            true
        )
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value
        }
    });

  return (
    <Animated.View
      className={cn('absolute')}
      style={[
        {
          position: 'absolute',
          top,
          right,
          bottom,
          left,
        },
        animatedStyle
      ]}
    >
      <MapPin size={size} color={color} fill={color} />
    </Animated.View>
  );
};
