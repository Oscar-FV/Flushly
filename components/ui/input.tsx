import * as React from 'react';
import { cn } from '@/lib/utils';
import { Platform, TextInput, View, type TextInputProps } from 'react-native';
import type { LucideIcon, LucideProps } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { Button } from './button';

type InputProps = TextInputProps &
  React.RefAttributes<TextInput> & {
    icon?: LucideIcon;
    iconProps?: Omit<LucideProps, 'ref'>;
    iconPosition?: 'left' | 'right';
    containerClassName?: string;
    iconContainerClassName?: string;
  };

function Input({
  className,
  icon,
  iconProps,
  iconPosition = 'left',
  containerClassName,
  iconContainerClassName,
  ...props
}: InputProps) {
  const input = (
    <TextInput
      className={cn(
        'flex h-10 w-full min-w-0 flex-row items-center rounded-full border border-input bg-background px-6 py-1 text-base leading-5 text-foreground shadow-sm shadow-foreground/5 dark:bg-input/30 sm:h-9',
        icon && iconPosition === 'left' && 'pl-12',
        icon && iconPosition === 'right' && 'pr-12',
        props.editable === false && 'opacity-50',
        Platform.select({
          native: 'placeholder:text-muted-foreground/50',
        }),
        className
      )}
      {...props}
    />
  );

  if (!icon) {
    return input;
  }

  return (
    <View className={cn('relative w-full', containerClassName)} pointerEvents='box-none'>
      {input}
      <Button
        size={"icon"}
        variant="ghost"
        pointerEvents='box-only'
        className={cn(
          'absolute top-1/2 -translate-y-1/2 z-10 rounded-full py-auto active:bg-primary dark:active:bg-primary/50',
          iconPosition === 'left' ? 'left-2' : 'right-2',
          iconContainerClassName
        )}>
        {icon && <Icon as={icon} {...iconProps} />}
      </Button>
    </View>
  );
}

export { Input };