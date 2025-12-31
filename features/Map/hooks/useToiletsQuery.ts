import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  buildToiletsQuery,
  fetchToilets,
  normalizeOverpassToToilets,
  type ToiletsQueryFilters,
} from '../services/overpass';
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
  const effectiveRadius = roundTo(radiusMeters, 250);
  const filters: Required<ToiletsQueryFilters> = {
    access: options.filters?.access ?? true,
    fee: options.filters?.fee ?? true,
    wheelchair: options.filters?.wheelchair ?? true,
  };

  const coordsKey = location
    ? [roundTo(location.latitude, 0.0001), roundTo(location.longitude, 0.0001)]
    : null;
  const enabled = Boolean(location) && (options.enabled ?? true);

  const query = useQuery<Toilet[]>({
    queryKey: ['toilets', coordsKey, effectiveRadius, filters],
    staleTime: 1000 * 60 * 60,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchToilets(
        buildToiletsQuery(location!.latitude, location!.longitude, effectiveRadius, filters)
      );
      return normalizeOverpassToToilets(response);
    },
    enabled,
  });
  return query;
}

function roundTo(value: number, step: number) {
  return Math.round(value / step) * step;
}
