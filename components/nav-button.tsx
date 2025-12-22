import { LucideProps } from 'lucide-react-native';
import React, { ForwardRefExoticComponent } from 'react';
import { Platform, Pressable, PressableProps } from 'react-native';
import { Icon } from './ui/icon';
import { Text } from './ui/text';

export interface NavButtonProps extends PressableProps {
  icon: ForwardRefExoticComponent<LucideProps>;
  buttonText?: string;
  isFocused?: boolean;
  className?: string;
}

export default function NavButton({
  icon,
  buttonText,
  className = '',
  isFocused,
  ...props
}: NavButtonProps) {

  const containerIdleStyle = Platform.OS === 'android' ? style.containerAndroidIdle : style.containerIdle;
  const containerFoucusedStyle = Platform.OS === 'android' ? style.containerAndroidFocused : style.containerFocused;

  return (

    <Pressable
      {...props}
      accessibilityRole="button"
      className={[
        style.container,
        isFocused ? containerFoucusedStyle : containerIdleStyle,
        className,
      ].join(' ')}
    >
      <Icon
        as={icon}
        className={[
          style.icon,
          isFocused ? style.iconFocused : style.iconIdle,
        ].join(' ')}
      />

      {buttonText && (
        <Text
          className={[
            style.text,
            isFocused ? style.textFocused : style.textIdle,
          ].join(' ')}
        >
          {buttonText}
        </Text>
      )}
    </Pressable>
  );
}

const style = {
  // Base
  container:
    'group shrink-0 flex-row items-center !justify-center gap-4 rounded-full p-3',
  icon: 'w-5 h-5',
  text: 'text-sm font-medium',

  // States
  containerFocused: 'bg-primary  shadow-md shadow-primary/70',
  containerIdle: 'bg-background shadow-sm shadow-black/20 dark:shadow-white/20',
  containerAndroidFocused: 'bg-primary',
  containerAndroidIdle: 'bg-secondary',

  iconFocused: 'text-primary-foreground',
  iconIdle: 'text-muted-foreground',

  textFocused: 'text-primary-foreground',
  textIdle: 'text-muted-foreground',
};
