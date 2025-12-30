import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Map from '../components/map/Map';
import { MapError } from '../components/map-loader.tsx/map-error';
import { MapLoader } from '../components/map-loader.tsx/map-loader';
import { useMapLoadState } from '../hooks/useMapLoadState';
import { useUserLocation } from '../hooks/useUserLocation';
import { useViewportRadius } from '../hooks/useViewportRadius';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LocateFixed } from 'lucide-react-native';
import { useToiletsQuery } from '../hooks/useToiletsQuery';
import { useDebouncedValue } from '@tanstack/react-pacer';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { useColorScheme } from 'nativewind';
import { Badge } from '@/components/ui/badge';
import { LoadingIcon } from '@/components/ui/loading-icon';

export default function MapScreen() {
  const { bottom, top } = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const mapState = useMapLoadState();
  // Fetch and track user location for map + queries.
  const { isLocating, userLocation } = useUserLocation({ onError: mapState.setError });
  // Tracks visible radius for queries driven by map viewport.
  const { mapRef, onRegionDidChange, viewportCenter, viewportRadius } = useViewportRadius({});
  // When true, the camera follows the user; user pan/zoom disables it.
  const [isFollowingUser, setIsFollowingUser] = React.useState(true);
  // Increment to trigger a one-off recenter animation.
  const [recenterToken, setRecenterToken] = React.useState(0);
  // Tracks a brief "rendering" state after new data arrives.
  const [isRenderingPins, setIsRenderingPins] = React.useState(false);

  const coordinates =
    viewportCenter ??
    (userLocation ? { latitude: userLocation[1], longitude: userLocation[0] } : null);

  const [debouncedCenter] = useDebouncedValue(coordinates, { wait: 800 });
  const [debouncedRadius] = useDebouncedValue(viewportRadius, { wait: 800 });

  const toiletsQuery = useToiletsQuery({
    coordinates: debouncedCenter,
    radiusMeters: debouncedRadius ?? 800,
    enabled: Boolean(
      mapState.isMapReady && mapState.hasStyle && debouncedCenter && debouncedRadius
    ),
  });

  React.useEffect(() => {
    if (!toiletsQuery.dataUpdatedAt) {
      return;
    }

    setIsRenderingPins(true);
    const timer = setTimeout(() => {
      setIsRenderingPins(false);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [toiletsQuery.dataUpdatedAt]);

  const showLoader =
    (!mapState.hasStyle && !mapState.isMapReady && !mapState.error) ||
    (isLocating && !mapState.error);

  // User manually moved the map; stop following until they tap the button.
  const handleUserInteraction = React.useCallback(() => {
    setIsFollowingUser(false);
  }, []);

  // Re-enable following and trigger a recenter.
  const handleRecenter = React.useCallback(() => {
    setIsFollowingUser(true);
    setRecenterToken((value) => value + 1);
  }, []);

  return (
    <View className="flex-1">
      <Map
        userLocation={userLocation}
        isFollowingUser={isFollowingUser}
        mapRef={mapRef}
        onRegionDidChange={onRegionDidChange}
        onWillStartLoadingMap={mapState.onWillStartLoadingMap}
        onDidFinishLoadingMap={mapState.onDidFinishLoadingMap}
        onDidFailLoadingMap={mapState.onDidFailLoadingMap}
        onDidFinishLoadingStyle={mapState.onDidFinishLoadingStyle}
        onUserInteraction={handleUserInteraction}
        recenterToken={recenterToken}
        toilets={toiletsQuery.data ?? []}
      />

      {showLoader && (
        <Animated.View pointerEvents="auto" style={[styles.loader]}>
          <MapLoader />
        </Animated.View>
      )}

      {!!mapState.error && (
        <View pointerEvents="auto" style={styles.loader}>
          <MapError message={mapState.error} />
        </View>
      )}

      {(toiletsQuery.isFetching || isRenderingPins) && (
        <Badge
          style={[styles.pending, { top: top + 12 }]}
          variant="secondary"
          className="gap-4 px-3 py-2">
          <LoadingIcon />
          <Text className="text-sm font-medium">Searching toilets...</Text>
        </Badge>
      )}

      {/* Floating recenter button shown when not following the user. */}
      {userLocation && !isFollowingUser && (
        <View pointerEvents="auto" style={[styles.recenter, { bottom: bottom + 96 }]}>
          <Button
            size="icon"
            variant="secondary"
            onPress={handleRecenter}
            accessibilityLabel="Center map"
            className="rounded-full">
            <Icon as={LocateFixed} size={24} />
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    ...StyleSheet.absoluteFillObject,
  },
  recenter: {
    position: 'absolute',
    right: 16,
  },
  pending: {
    position: 'absolute',
    alignSelf: 'center',
  },
});
