import { FlatList, Keyboard, View } from 'react-native';
import React from 'react';
import { Text } from '@/components/ui/text';
import RecentSearchCard from '@/features/Explore/components/recent-search-card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { SearchItem } from '../types/search-item';
import { useSearch } from '../hooks/useSearch';
import { useSearchResults } from '../hooks/useSearchResults';

export const ExploreResultsList = React.memo(function ExploreResultsList({
  control,
  effectiveTabBarHeight,
}: {
  control: ReturnType<typeof useSearch>['control'];
  effectiveTabBarHeight: number;
}) {
  const { hasSearchValue, listItems, isFetching } = useSearchResults({ control });

  return (
    <View>
      {!hasSearchValue && (
        <Text className="px-4 pb-2 text-base font-semibold text-foreground">Recent places</Text>
      )}
      <FlatList
        data={listItems}
        keyExtractor={(item, i) => item.id + i}
        renderItem={({ item }) => <RecentSearchCard item={item} />}
        ItemSeparatorComponent={() => <Separator />}
        ListFooterComponent={
          hasSearchValue && isFetching ? (
            <View className="px-4 pb-8">
              {Array.from({ length: 5 }).map((_, index) => (
                <View key={`skeleton-${index}`} className="flex-row items-center gap-3 py-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <View className="flex-1 gap-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={{ height: effectiveTabBarHeight + 120 }} />
          )
        }
        onScrollBeginDrag={Keyboard.dismiss}
      />
    </View>
  );
});
