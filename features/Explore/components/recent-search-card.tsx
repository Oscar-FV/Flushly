import * as React from 'react';
import { Pressable, View } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { SearchItem } from '../types/search-item';

type RecentSearchCardProps = {
  item: SearchItem
  onPress?: () => void;
};

export default function RecentSearchCard({
  item,
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
        <Text className="text-base font-semibold text-foreground">{item.tittle}</Text>
        {!!item.details && (
          <Text className="text-sm text-muted-foreground">{item.details}</Text>
        )}
      </View>
    </Pressable>
  );
}
