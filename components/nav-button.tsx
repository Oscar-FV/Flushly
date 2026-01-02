import React from 'react';
import { Pressable, PressableProps, Platform, StyleSheet } from 'react-native';
import { ForwardRefExoticComponent } from 'react';
import { LucideProps } from 'lucide-react-native';
import { Icon } from './ui/icon';
import { NAV_BUTTON_SIZES } from '@/constants/nav-constants';

export interface NavButtonProps extends PressableProps {
  icon: ForwardRefExoticComponent<LucideProps>;
  isFocused?: boolean;
  className?: string;
}

export function NavButton({
  icon,
  isFocused = false,
  className = '',
  style,
  ...props
}: NavButtonProps) {
  const containerIdle =
    Platform.OS === 'android' ? stylesNW.containerAndroidIdle : stylesNW.containerIdle;

  const containerFocused =
    Platform.OS === 'android'
      ? stylesNW.containerAndroidFocused
      : stylesNW.containerFocused;

  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      className={[stylesNW.base, isFocused ? containerFocused : containerIdle, className].join(' ')}
      style={[styles.centerBox]}
    >
      <Icon
        as={icon}
        className={[
          stylesNW.icon,
          isFocused ? stylesNW.iconFocused : stylesNW.iconIdle,
        ].join(' ')}
        style={styles.centerSelf}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  centerBox: {
    width: NAV_BUTTON_SIZES.navIconWidth,
    height: NAV_BUTTON_SIZES.navIconWidth,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerSelf: {
    alignSelf: 'center',
  },
});

const stylesNW = {
  base: 'rounded-full', 
  icon: 'w-5 h-5',
  containerFocused: 'bg-primary shadow-md shadow-primary/70',
  containerIdle: 'bg-background shadow-sm shadow-black/20 dark:shadow-white/20',
  containerAndroidFocused: 'bg-primary',
  containerAndroidIdle: 'bg-secondary',
  iconFocused: 'text-primary-foreground',
  iconIdle: 'text-muted-foreground',
};
