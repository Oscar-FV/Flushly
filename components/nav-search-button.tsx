import React, { useEffect, useState } from 'react';
import {
  LayoutChangeEvent,
  Pressable,
  PressableProps,
  Platform,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  Easing,
  createAnimatedComponent,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ForwardRefExoticComponent } from 'react';
import { LucideProps } from 'lucide-react-native';
import { Icon } from './ui/icon';
import { Text } from './ui/text';
import { NAV_BUTTON_SIZES } from '@/constants/nav-constants';

export interface NavSearchButtonProps extends PressableProps {
  icon: ForwardRefExoticComponent<LucideProps>;
  text?: string;
  className?: string;
  collapseWhenSelected?: boolean;
  isFocused?: boolean;
}

export function NavSearchButton({
  icon,
  text = 'Search',
  className = '',
  collapseWhenSelected = true,
  style,
  isFocused,
  ...props
}: NavSearchButtonProps) {
  const { width } = useWindowDimensions();
  const [measuredTextWidth, setMeasuredTextWidth] = useState(0);

  const buttonWidth =
    width -
    NAV_BUTTON_SIZES.navHorizontalPadding * 2 -
    NAV_BUTTON_SIZES.navIconWidth * NAV_BUTTON_SIZES.navTotalFixedIcons -
    NAV_BUTTON_SIZES.navGap * NAV_BUTTON_SIZES.navTotalFixedIcons;

  const containerIdleStyle = Platform.OS === 'android' ? s.containerAndroidIdle : s.containerIdle;
  const containerSelectedStyle =
    Platform.OS === 'android' ? s.containerAndroidSelected : s.containerSelected;

  const targetButtonWidth =
    collapseWhenSelected && isFocused
      ? NAV_BUTTON_SIZES.navIconWidth
      : Math.max(0, buttonWidth);
  const targetTextWidth = collapseWhenSelected && isFocused ? 0 : measuredTextWidth;
  const targetTextMargin = collapseWhenSelected && isFocused ? 0 : NAV_BUTTON_SIZES.navGap;

  const animatedButtonWidth = useSharedValue(targetButtonWidth);
  const animatedTextWidth = useSharedValue(targetTextWidth);
  const animatedTextMargin = useSharedValue(targetTextMargin);

  useEffect(() => {
    animatedButtonWidth.value = withTiming(targetButtonWidth, {
      duration: 220,
      easing: Easing.out(Easing.cubic),
    });
    animatedTextWidth.value = withTiming(targetTextWidth, {
      duration: 200,
      easing: Easing.out(Easing.cubic),
    });
    animatedTextMargin.value = withTiming(targetTextMargin, {
      duration: 200,
      easing: Easing.out(Easing.cubic),
    });
  }, [animatedButtonWidth, animatedTextMargin, animatedTextWidth, targetButtonWidth, targetTextMargin, targetTextWidth]);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    width: animatedButtonWidth.value,
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    width: animatedTextWidth.value,
    marginLeft: animatedTextMargin.value,
  }));

  const AnimatedPressable = createAnimatedComponent(Pressable);
  const handleTextLayout = (event: LayoutChangeEvent) => {
    const nextWidth = Math.ceil(event.nativeEvent.layout.width);
    if (nextWidth > 0 && nextWidth !== measuredTextWidth) {
      setMeasuredTextWidth(nextWidth);
    }
  };

  return (
    <AnimatedPressable
      {...props}
      accessibilityRole="button"
      className={[s.base, isFocused ? containerSelectedStyle : containerIdleStyle, className].join(
        ' '
      )}
      style={[styles.fixedHeight, animatedButtonStyle]}>
      <View style={styles.rowCenter}>
        <Icon
          as={icon}
          className={[s.icon, isFocused ? s.iconSelected : s.iconIdle].join(' ')}
          style={styles.iconCenter}
        />

        <Animated.View style={[styles.textWrap, animatedTextStyle]}>
          <Text
            numberOfLines={1}
            className={[s.text, isFocused ? s.textSelected : s.textIdle].join(' ')}>
            {text}
          </Text>
        </Animated.View>
      </View>
      <Text
        numberOfLines={1}
        className={s.text}
        style={styles.measureText}
        onLayout={handleTextLayout}>
        {text}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  fixedHeight: {
    height: NAV_BUTTON_SIZES.navIconWidth,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
  },
  iconCenter: {
    alignSelf: 'center',
  },
  textWrap: {
    overflow: 'hidden',
  },
  measureText: {
    position: 'absolute',
    opacity: 0,
  },
});

const s = {
  base: 'rounded-full',
  icon: 'w-5 h-5',
  text: 'font-medium',
  containerSelected: 'bg-primary shadow-md shadow-primary/70',
  containerIdle: 'bg-background shadow-sm shadow-black/20 dark:shadow-white/20',
  containerAndroidSelected: 'bg-primary',
  containerAndroidIdle: 'bg-secondary',
  iconSelected: 'text-primary-foreground',
  iconIdle: 'text-muted-foreground',
  textSelected: 'text-primary-foreground',
  textIdle: 'text-muted-foreground',
};
