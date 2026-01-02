import { FlatList, Keyboard, Platform, View } from 'react-native';
import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/text';
import RecentSearchCard from '@/features/Explore/components/recent-search-card';
import { Separator } from '@/components/ui/separator';
import { useTabBarHeight } from '@/context/tab-bar-height';
import { NAV_BUTTON_SIZES } from '@/constants/nav-constants';
import InputWithButton from '@/components/ui/input-with-button';

export default function ExploreScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const router = useRouter();
  const { height: tabBarHeight } = useTabBarHeight();
  const effectiveTabBarHeight = tabBarHeight || bottom + 112;
  const recentSearches = [
    {
      id: 'mx-cdmx-centro',
      title: 'Centro Historico',
      subtitle: 'Mexico City, CDMX',
    },
    {
      id: 'mx-polanco',
      title: 'Polanco',
      subtitle: 'Av. Presidente Masaryk',
    },
    {
      id: 'mx-bellas-artes',
      title: 'Palacio de Bellas Artes',
      subtitle: 'Av. Juarez, CDMX',
    },
    {
      id: 'mx-cdmx-centro',
      title: 'Centro Historico',
      subtitle: 'Mexico City, CDMX',
    },
    {
      id: 'mx-polanco',
      title: 'Polanco',
      subtitle: 'Av. Presidente Masaryk',
    },
    {
      id: 'mx-bellas-artes',
      title: 'Palacio de Bellas Artes',
      subtitle: 'Av. Juarez, CDMX',
    },
    {
      id: 'mx-cdmx-centro',
      title: 'Centro Historico',
      subtitle: 'Mexico City, CDMX',
    },
    {
      id: 'mx-polanco',
      title: 'Polanco',
      subtitle: 'Av. Presidente Masaryk',
    },
    {
      id: 'mx-bellas-artes',
      title: 'Palacio de Bellas Artes',
      subtitle: 'Av. Juarez, CDMX',
    },
    {
      id: 'mx-cdmx-centro',
      title: 'Centro Historico',
      subtitle: 'Mexico City, CDMX',
    },
    {
      id: 'mx-polanco',
      title: 'Polanco',
      subtitle: 'Av. Presidente Masaryk',
    },
    {
      id: 'mx-bellas-artes',
      title: 'Palacio de Bellas Artes',
      subtitle: 'Av. Juarez, CDMX',
    },
    {
      id: 'mx-cdmx-centro',
      title: 'Centro Historico',
      subtitle: 'Mexico City, CDMX',
    },
    {
      id: 'mx-polanco',
      title: 'Polanco',
      subtitle: 'Av. Presidente Masaryk',
    },
    {
      id: 'mx-bellas-artes',
      title: 'Palacio de Bellas Artes',
      subtitle: 'Av. Juarez, CDMX',
    },
    {
      id: 'mx-cdmx-centro',
      title: 'Centro Historico',
      subtitle: 'Mexico City, CDMX',
    },
    {
      id: 'mx-polanco',
      title: 'Polanco',
      subtitle: 'Av. Presidente Masaryk',
    },
    {
      id: 'mx-bellas-artes',
      title: 'Palacio de Bellas Artes',
      subtitle: 'Av. Juarez, CDMX',
    },
    {
      id: 'mx-cdmx-centro',
      title: 'Centro Historico',
      subtitle: 'Mexico City, CDMX',
    },
    {
      id: 'mx-polanco',
      title: 'Polanco',
      subtitle: 'Av. Presidente Masaryk',
    },
    {
      id: 'mx-bellas-artes',
      title: 'Palacio de Bellas Artes',
      subtitle: 'Av. Juarez, CDMX',
    },
    {
      id: 'mx-cdmx-centro',
      title: 'Centro Historico',
      subtitle: 'Mexico City, CDMX',
    },
    {
      id: 'mx-polanco',
      title: 'Polanco',
      subtitle: 'Av. Presidente Masaryk',
    },
    {
      id: 'mx-bellas-artes',
      title: 'Palacio de Bellas Artes',
      subtitle: 'Av. Juarez, CDMX',
    },
    {
      id: 'mx-cdmx-centro',
      title: 'Centro Historico',
      subtitle: 'Mexico City, CDMX',
    },
    {
      id: 'mx-polanco',
      title: 'Polanco',
      subtitle: 'Av. Presidente Masaryk',
    },
    {
      id: 'mx-bellas-artes',
      title: 'Palacio de Bellas Artes',
      subtitle: 'Av. Juarez, CDMX',
    },

    {
      id: 'mx-cdmx-centro',
      title: 'Centro Historico',
      subtitle: 'Mexico City, CDMX',
    },
    {
      id: 'mx-polanco',
      title: 'Polanco',
      subtitle: 'Av. Presidente Masaryk',
    },
    {
      id: 'mx-bellas-artes',
      title: 'Palacio de Bellas Artes',
      subtitle: 'Av. Juarez, CDMX',
    },
  ];

  const [showDescription, setShowDescription] = useState<boolean>(true);

  return (
    <View className="flex-1 gap-y-4" style={{ paddingTop: top }}>
      <View className="mt-2 px-4">
        <InputWithButton
          autoFocus
          returnKeyType={'search'}
          className="h-14 py-4"
          placeholder={
            showDescription ? 'Search by area, street, or landmark' : 'Where do you need a toilet?'
          }
          icon={ArrowLeft}
          iconProps={{ size: 18 }}
          iconOnPress={() => router.navigate('/(tabs)')}
          onFocus={() => setShowDescription(true)}
          onBlur={() => setShowDescription(false)}
        />
      </View>

      <View>
        <Text className="px-4 pb-2 text-base font-semibold text-foreground">Recent places</Text>

        <FlatList
          data={recentSearches}
          keyExtractor={(item, i) => item.id + i}
          renderItem={({ item }) => (
            <RecentSearchCard title={item.title} subtitle={item.subtitle} />
          )}
          ItemSeparatorComponent={() => <Separator />}
          ListFooterComponent={<View style={{ height: effectiveTabBarHeight + 120 }} />}
          onScrollBeginDrag={Keyboard.dismiss}
        />
      </View>
    </View>
  );
}
