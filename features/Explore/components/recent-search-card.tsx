import * as React from 'react';
import { Pressable, View } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';

type RecentSearchCardProps = {
  title: string;
  subtitle?: string;
  onPress?: () => void;
};

export default function RecentSearchCard({
  title,
  subtitle,
  onPress,
}: RecentSearchCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-2xl px-4 py-3">
      <View className="h-10 w-10 items-center justify-center rounded-full bg-muted">
        <Icon as={MapPin} size={18} className="text-muted-foreground" />
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-foreground">{title}</Text>
        {!!subtitle && (
          <Text className="text-sm text-muted-foreground">{subtitle}</Text>
        )}
      </View>
    </Pressable>
  );
}
