import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { buildToiletsQuery, fetchToilets, normalizeOverpassToToilets, type ToiletsQueryFilters } from '../services/overpass';
import type { Toilet } from '../types/toilet';

export type ToiletsQueryOptions = {
  radiusMeters?: number;
  filters?: ToiletsQueryFilters;
  enabled?: boolean;
  coordinates?: { latitude: number; longitude: number } | null;
};

export function useToiletsQuery(options: ToiletsQueryOptions = {}) {
  const location = options.coordinates ?? null;

  const radiusMeters = options.radiusMeters ?? 800;
  const filters: Required<ToiletsQueryFilters> = {
    access: options.filters?.access ?? true,
    fee: options.filters?.fee ?? true,
    wheelchair: options.filters?.wheelchair ?? true,
  };

  const coordsKey = location
    ? [roundTo(location.latitude, 5), roundTo(location.longitude, 5), roundTo(radiusMeters, 25)]
    : null;

  return useQuery<Toilet[]>({
    queryKey: ['toilets', coordsKey, radiusMeters, filters],
    staleTime: 1000 * 60 * 60,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchToilets(
        buildToiletsQuery(location!.latitude, location!.longitude, radiusMeters, filters)
      );
      return normalizeOverpassToToilets(response);
    },
    enabled: Boolean(location) && (options.enabled ?? true),
  });
}

function roundTo(value: number, step: number) {
  return Math.round(value / step) * step;
}
