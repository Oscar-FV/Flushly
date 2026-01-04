import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { geocodeSearch } from '../../services/geocoding';
import type { SearchItem } from '../../types/search-item';
import * as Localization from 'expo-localization';
import { useLocationStore } from '@/context/location-store/useLocationStore';

type UseGeocodeQueryOptions = {
  limit?: number;
  autocomplete?: boolean;
  language?: string;
  proximity?: { latitude: number; longitude: number };
};

export function useGeocodeQuery(query: string, options: UseGeocodeQueryOptions = {}) {
  const trimmed = query.trim();
  const isValid = trimmed.length > 0;
  const locale = Localization.getLocales()[0];
  const userLocation = useLocationStore((state) => state.userLocation);
  const resolvedOptions: UseGeocodeQueryOptions = {
    language: locale?.languageCode ?? undefined,
    ...options,
    proximity: options.proximity ?? userLocation ?? undefined,
  };

  return useQuery<SearchItem[]>({
    queryKey: [
      'geocoding',
      trimmed,
      resolvedOptions.limit ?? 5,
      resolvedOptions.autocomplete ?? false,
      resolvedOptions.language ?? '',
      resolvedOptions.proximity?.latitude ?? '',
      resolvedOptions.proximity?.longitude ?? '',
    ],
    queryFn: async () => {
      if (!isValid) {
        return [];
      }
      return geocodeSearch(trimmed, resolvedOptions);
    },
    enabled: isValid,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
}
