import React from 'react';
import { View } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Star, StarHalfIcon } from 'lucide-react-native';
import { THEME } from '@/lib/theme';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

type StarRatingProps = {
  rating?: number;
  size?: number;
  totalReviews?: number;
  className?: string;
};

export default function StarRating({
  rating = 4.5,
  totalReviews,
  size = 20,
  className,
}: StarRatingProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];

  return (
    <View className={`flex-col items-center gap-1 ${className ?? ''}`}>
      <View className="flex-row items-center gap-2">
        {[...Array(5)].map((_, i) => {
          const fraction = Math.max(0, Math.min(1, rating - i));
          const fillWidth = size * fraction;

          return (
            <View key={i} className="relative" style={{ width: size, height: size }}>
              <Icon
                as={Star}
                size={size}
                color={"#c4c8ce"}
                fill={"#c4c8ce"}
              />
              <View className="absolute overflow-hidden" style={{ width: fillWidth }}>
                <Icon
                  as={Star}
                  size={size}
                  className="text-chart-3"
                  color={theme.chart3}
                  fill={theme.chart3}
                />
              </View>
            </View>
          );
        })}
        {!totalReviews && <Text className="font-semibold">{rating}</Text>}
      </View>
      {totalReviews && (
        <View className="flex-row items-center gap-2">
          <Text className="font-semibold">{rating}</Text>
          <Text className="text-sm text-muted-foreground">({totalReviews} reviews)</Text>
        </View>
      )}
    </View>
  );
}
