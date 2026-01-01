import React from 'react';
import { View } from 'react-native';
import { Sparkles, DoorOpen, ShieldCheck, Wrench, Accessibility } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import StarRating from '@/components/star-rating';
import { cn } from '@/lib/utils';

const CATEGORY_CONFIG = {
  cleanliness: {
    label: 'Cleanliness',
    icon: Sparkles,
    container: 'border-rating-cleanliness/20 bg-rating-cleanliness/5',
    iconWrap: 'bg-rating-cleanliness/10',
    iconTint: 'text-rating-cleanliness',
  },
  availability: {
    label: 'Availability',
    icon: DoorOpen,
    container: 'border-rating-availability/20 bg-rating-availability/5',
    iconWrap: 'bg-rating-availability/10',
    iconTint: 'text-rating-availability',
  },
  privacy: {
    label: 'Privacy',
    icon: ShieldCheck,
    container: 'border-rating-privacy/20 bg-rating-privacy/5 dark:bg-rating-privacy/10',
    iconWrap: 'bg-rating-privacy/10',
    iconTint: 'text-rating-privacy',
  },
  maintenance: {
    label: 'Maintenance',
    icon: Wrench,
    container: 'border-rating-maintenance/20 bg-rating-maintenance/5',
    iconWrap: 'bg-rating-maintenance/10',
    iconTint: 'text-rating-maintenance',
  },
  accessibility: {
    label: 'Accessibility',
    icon: Accessibility,
    container: 'border-rating-accessibility/20 bg-rating-accessibility/5',
    iconWrap: 'bg-rating-accessibility/10',
    iconTint: 'text-rating-accessibility',
  },
} as const;

export type ReviewCategory = keyof typeof CATEGORY_CONFIG;

type ReviewCategoryRatingProps = {
  variant: ReviewCategory;
  rating: number;
  className?: string;
};

export function ReviewCategoryRating({ variant, rating, className }: ReviewCategoryRatingProps) {
  const config = CATEGORY_CONFIG[variant];

  return (
    <View
      className={cn(
        'flex-row items-center justify-between rounded-lg border px-4 py-3',
        config.container,
        className
      )}>
      <View className="flex-row items-center gap-3">
        <View className={cn('h-10 w-10 items-center justify-center rounded-full', config.iconWrap)}>
          <Icon as={config.icon} size={18} className={config.iconTint} />
        </View>
        <Text className="text-base font-semibold">{config.label}</Text>
      </View>
      <View className="flex-row items-center gap-2">
        <StarRating rating={rating} size={16} />
      </View>
    </View>
  );
}
