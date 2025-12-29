import React from 'react';
import type { MapViewRef } from '@maplibre/maplibre-react-native';
import { useDebouncedCallback } from '@tanstack/react-pacer';

type UseViewportRadiusOptions = {
  onViewportRadiusChange?: (radiusMeters: number) => void;
  debounceMs?: number;
};

export function useViewportRadius({
  onViewportRadiusChange,
  debounceMs = 400,
}: UseViewportRadiusOptions) {
  const mapRef = React.useRef<MapViewRef>(null);
  const [viewportRadius, setViewportRadius] = React.useState<number | null>(null);

  // Approximate viewport radius using center-to-corner distance.
  const updateViewportRadius = React.useCallback(async () => {
    if (!mapRef.current) {
      return;
    }

    try {
      const bounds = await mapRef.current.getVisibleBounds();
      if (!bounds || bounds.length < 2) {
        return;
      }

      // Bounds are [[west, south], [east, north]].
      const [sw, ne] = bounds;
      const centerLat = (sw[1] + ne[1]) / 2;
      const centerLon = (sw[0] + ne[0]) / 2;

      // Haversine returns meters on the Earth's surface.
      const radiusMeters = haversineMeters(centerLat, centerLon, ne[1], ne[0]);
      setViewportRadius(radiusMeters);
      onViewportRadiusChange?.(radiusMeters);
    } catch {
      return;
    }
  }, [onViewportRadiusChange]);

  // Debounce viewport updates to avoid spamming queries while panning/zooming.
  const onRegionDidChange = useDebouncedCallback(() => {
    updateViewportRadius();
  }, { wait: debounceMs });

  return { mapRef, onRegionDidChange, viewportRadius };
}

// Great-circle distance in meters between two lat/lon points.
function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadius = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
}
