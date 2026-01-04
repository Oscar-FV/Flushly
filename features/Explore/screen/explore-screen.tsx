import { View } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTabBarHeight } from '@/context/tab-bar-height';
import { useSearch } from '../hooks/useSearch';
import { ExploreResultsList } from '../components/explore-result-list';
import { ExploreSearchInput } from '../components/explore-search-input';

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

