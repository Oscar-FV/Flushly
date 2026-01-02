import * as React from 'react';
import { cn } from '@/lib/utils';
import { Platform, Pressable, TextInput, View, type TextInputProps } from 'react-native';
import type { LucideIcon, LucideProps } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { Input } from './input';

type InputWithButtonProps = TextInputProps &
  React.RefAttributes<TextInput> & {
    icon: LucideIcon;
    iconProps?: Omit<LucideProps, 'ref'>;
    iconPosition?: 'left' | 'right';
    iconOnPress?: () => void;
    containerClassName?: string;
    iconContainerClassName?: string;
  };

export default function InputWithButton({
  className,
  icon,
  iconProps,
  iconPosition = 'left',
  iconOnPress,
  containerClassName,
  iconContainerClassName,
  ...props
}: InputWithButtonProps) {
  const inputRef = React.useRef<TextInput>(null);

  const handleContainerPress = () => {
    inputRef.current?.focus();
  };

  return (
    <View className={cn('relative w-full', containerClassName)}>
      <Pressable
        onPress={handleContainerPress}
        className={cn(
          'flex h-10 w-full min-w-0 flex-row items-center rounded-full border border-input bg-background shadow-sm shadow-foreground/5 dark:bg-input/30 sm:h-9',
          iconPosition === 'left' && 'pl-14 pr-6',
          iconPosition === 'right' && 'pl-6 pr-14',
          props.editable === false && 'opacity-50',
          className
        )}>
        <Input
          ref={inputRef}
          className="flex-1 h-10 !bg-transparent !border-transparent rounded-none !px-0"
          {...props}
        />
      </Pressable>

      <Pressable
        onPress={iconOnPress}
        disabled={!iconOnPress}
        className={cn(
          'absolute top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full',
          iconPosition === 'left' ? 'left-2' : 'right-3',
          iconOnPress && 'active:bg-primary/10 dark:active:bg-primary/20',
          iconContainerClassName
        )}>
        <Icon 
          as={icon} 
          className={cn(iconOnPress ? 'opacity-100' : 'opacity-80')} 
          {...iconProps} 
        />
      </Pressable>
    </View>
  );
}
