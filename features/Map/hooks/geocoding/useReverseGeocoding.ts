import { useQuery } from '@tanstack/react-query';
import { LatLng } from '../../types/toilet';
import { reverseGeocoding } from '../../services/geocoding';

export function useReverseGeocoding(options: LatLng | undefined) {
  return useQuery<string | null>({
    queryKey: ['reverseGeocoding', options],
    staleTime: 1000 * 60 * 60,
    queryFn: async () => {
      if (!options) {
        return null;
      }
      const response = await reverseGeocoding(options);
      return response;
    },
    enabled: !!options,
  });
}
