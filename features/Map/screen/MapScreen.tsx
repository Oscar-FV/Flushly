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

export default function MapScreen() {
  const mapState = useMapLoadState();
  // Fetch and track user location for map + queries.
  const { isLocating, userLocation } = useUserLocation({ onError: mapState.setError });
  const { bottom } = useSafeAreaInsets();
  // Tracks visible radius for queries driven by map viewport.
  const { mapRef, onRegionDidChange, viewportRadius } = useViewportRadius({});
  // When true, the camera follows the user; user pan/zoom disables it.
  const [isFollowingUser, setIsFollowingUser] = React.useState(true);
  // Increment to trigger a one-off recenter animation.
  const [recenterToken, setRecenterToken] = React.useState(0);
  // Placeholder for viewport radius (wired to map; can feed queries later).
  void viewportRadius;

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
});
