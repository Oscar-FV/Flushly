import { FlatList, Keyboard, View } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/text';
import RecentSearchCard from '@/features/Explore/components/recent-search-card';
import { Separator } from '@/components/ui/separator';
import { useTabBarHeight } from '@/context/tab-bar-height';
import InputWithButton from '@/components/ui/input-with-button';
import { Controller } from 'react-hook-form';
import { useSearch } from '../hooks/useSearch';
import { useSearchResults } from '../hooks/useSearchResults';

export default function ExploreScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const router = useRouter();
  const { height: tabBarHeight } = useTabBarHeight();
  const effectiveTabBarHeight = tabBarHeight || bottom + 112;

  const {
    control,
    placeholder,
    handleFocus,
    handleBlur,
    handleSubmitEditing,
    handleChangeText,
  } = useSearch();

  return (
    <View className="flex-1 gap-y-4" style={{ paddingTop: top }}>
      <ExploreSearchInput
        control={control}
        placeholder={placeholder}
        onBackPress={() => router.navigate('/(tabs)')}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onSubmitEditing={handleSubmitEditing}
        onChangeText={handleChangeText}
      />

      <ExploreResultsList
        control={control}
        effectiveTabBarHeight={effectiveTabBarHeight}
      />
    </View>
  );
}

const ExploreResultsList = React.memo(function ExploreResultsList({
  control,
  effectiveTabBarHeight,
}: {
  control: ReturnType<typeof useSearch>['control'];
  effectiveTabBarHeight: number;
}) {
  const { hasSearchValue, listItems } = useSearchResults({ control });

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
        ListFooterComponent={<View style={{ height: effectiveTabBarHeight + 120 }} />}
        onScrollBeginDrag={Keyboard.dismiss}
      />
    </View>
  );
});

const ExploreSearchInput = React.memo(function ExploreSearchInput({
  control,
  placeholder,
  onBackPress,
  onFocus,
  onBlur,
  onSubmitEditing,
  onChangeText,
}: {
  control: ReturnType<typeof useSearch>['control'];
  placeholder: string;
  onBackPress: () => void;
  onFocus: () => void;
  onBlur: (fieldOnBlur: () => void) => () => void;
  onSubmitEditing: () => void;
  onChangeText: (fieldOnChange: (value: string) => void) => (text: string) => void;
}) {
  return (
    <View className="mt-2 px-4">
      <Controller
        control={control}
        render={({ field: { onChange, onBlur: fieldOnBlur, value } }) => (
          <InputWithButton
            autoFocus
            returnKeyType={'search'}
            className="h-14 py-4"
            placeholder={placeholder}
            icon={ArrowLeft}
            iconProps={{ size: 18 }}
            iconOnPress={onBackPress}
            onFocus={onFocus}
            onBlur={onBlur(fieldOnBlur)}
            onSubmitEditing={onSubmitEditing}
            onChangeText={onChangeText(onChange)}
            value={value}
          />
        )}
        name="search"
      />
    </View>
  );
});
