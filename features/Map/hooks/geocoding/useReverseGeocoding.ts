import { useQuery } from '@tanstack/react-query';
import { LatLng } from '../../types/toilet';
import { reverseGeocoding } from '../../services/geocoding';

export function useReverseGeocoding(options: LatLng | null | undefined) {
  const latitude = options?.latitude;
  const longitude = options?.longitude;
  const isValid =
    typeof latitude === 'number' && typeof longitude === 'number';

  return useQuery<string | null>({
    queryKey: ['reverseGeocoding', latitude, longitude],
    staleTime: 1000 * 60 * 60,
    queryFn: async () => {
      if (!isValid || !options) {
        return null;
      }
      const response = await reverseGeocoding(options);
      return response;
    },
    enabled: isValid,
  });
}
