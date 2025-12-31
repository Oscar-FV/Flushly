import React from 'react';
import { Text } from '@/components/ui/text';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { Shield, DollarSign, Lock, Accessibility } from 'lucide-react-native';
import { cn } from '@/lib/utils';

interface ToiletBadgeProps {
  variant: keyof typeof BADGE_CONFIG;
}

const BADGE_CONFIG = {
  public: {
    label: 'Public',
    icon: Shield,
    category: 'good',
  },
  free: {
    label: 'Free',
    icon: DollarSign,
    category: 'good',
  },
  paid: {
    label: 'Paid',
    icon: DollarSign,
    category: 'warning',
  },
  private: {
    label: 'Private',
    icon: Lock,
    category: 'warning',
  },
  wheelchair: {
    label: 'Wheelchair Accessible',
    icon: Accessibility,
    category: 'accessibility',
  },
} as const;

const CATEGORY_STYLES = {
  good: {
    badge: 'border-primary/30 bg-primary/10',
    text: 'text-primary',
    icon: 'text-primary',
  },
  warning: {
    badge: 'border-yellow-500/30 bg-yellow-500/10',
    text: 'text-yellow-600',
    icon: 'text-yellow-600',
  },
  accessibility: {
    badge: 'border-blue-500/30 bg-blue-500/10',
    text: 'text-blue-600',
    icon: 'text-blue-600',
  },
};

export function ToiletBadge({ variant }: ToiletBadgeProps) {
  const config = BADGE_CONFIG[variant];
  const styles = CATEGORY_STYLES[config.category];


  return (
    <Badge className={cn('px-4 py-2', styles.badge)}>
      <Icon as={config.icon} size={16} className={styles.icon} />
      <Text className={`text-sm font-medium ${styles.text}`}>{config.label}</Text>
    </Badge>
  );
}
