import { useQuery } from '@tanstack/react-query';
import { buildToiletsQuery, fetchToilets, type ToiletsQueryFilters } from '../services/overpass';

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

  const coordsKey = location ? [location.latitude, location.longitude] : null;

  return useQuery({
    queryKey: ['toilets', coordsKey, radiusMeters, filters],
    queryFn: () => fetchToilets(buildToiletsQuery(location!.latitude, location!.longitude, radiusMeters, filters)),
    enabled: Boolean(location) && (options.enabled ?? true),
  });
}
