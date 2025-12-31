import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Map from '../components/map/Map';
import { MapError } from '../components/map-loader.tsx/map-error';
import { MapLoader } from '../components/map-loader.tsx/map-loader';
import { useMapLoadState } from '../hooks/useMapLoadState';
import { useViewportRadius } from '../hooks/useViewportRadius';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LocateFixed } from 'lucide-react-native';
import { useToiletsQuery } from '../hooks/useToiletsQuery';
import { Text } from '@/components/ui/text';
import { Badge } from '@/components/ui/badge';
import { LoadingIcon } from '@/components/ui/loading-icon';
import ToiletBottomSheet from '../bottom-sheets/ToiletBottomSheet';
import { useToiletBottomSheet } from '../hooks/useToiletBottomSheet';
import type { LatLng } from '../types/toilet';
import { useLocationStore } from '@/context/location-store/useLocationStore';

export default function MapScreen() {
  const { bottom, top } = useSafeAreaInsets();
  const mapState = useMapLoadState();
  const isLocating = useLocationStore((state) => state.isLocating);
  const userLocation = useLocationStore((state) => state.userLocation);
  const locationError = useLocationStore((state) => state.error);
  const initialUserLocationRef = React.useRef<LatLng | null>(
    useLocationStore.getState().userLocation
  );
  if (!initialUserLocationRef.current && userLocation) {
    initialUserLocationRef.current = userLocation;
  }
  const [cameraKeySeed, setCameraKeySeed] = React.useState(0);
  const [recenterLocation, setRecenterLocation] = React.useState<LatLng | null>(null);
  const cameraDefaultLocation = recenterLocation ?? initialUserLocationRef.current;
  // Tracks visible radius for queries driven by map viewport.
  const { mapRef, onRegionDidChange, refreshViewport, viewportCenter, viewportRadius } =
    useViewportRadius({});
  const { selectedToilet, handleToiletPress } = useToiletBottomSheet();

  const queryCenter = viewportCenter ?? userLocation;
  const toiletsQuery = useToiletsQuery({
    coordinates: queryCenter,
    radiusMeters: viewportRadius ?? 800,
    enabled: Boolean(mapState.isMapReady && mapState.hasStyle && queryCenter),
  });
  const toilets = React.useMemo(() => toiletsQuery.data ?? [], [toiletsQuery.data]);

  const showLoader =
    (!mapState.hasStyle && !mapState.isMapReady && !mapState.error) ||
    (isLocating && !mapState.error);
  const errorToShow = mapState.error ?? locationError;
  
  const handleRecenter = React.useCallback(() => {
    if (!userLocation) {
      return;
    }

    setRecenterLocation(userLocation);
    setCameraKeySeed((value) => value + 1);
  }, [userLocation]);

  React.useEffect(() => {
    const { startTracking, stopTracking } = useLocationStore.getState();
    startTracking();
    return () => {
      stopTracking();
    };
  }, []);

  return (
    <View className="flex-1">
      <Map
        userLocation={userLocation}
        mapRef={mapRef}
        cameraDefaultLocation={cameraDefaultLocation}
        cameraKeySeed={cameraKeySeed}
        onRegionDidChange={onRegionDidChange}
        onWillStartLoadingMap={mapState.onWillStartLoadingMap}
        onDidFinishLoadingMap={mapState.onDidFinishLoadingMap}
        onDidFailLoadingMap={mapState.onDidFailLoadingMap}
        onDidFinishLoadingStyle={mapState.onDidFinishLoadingStyle}
        onDidFinishRenderingMapFully={refreshViewport}
        toilets={toilets}
        onToiletPress={handleToiletPress}
      />

      {showLoader && (
        <Animated.View pointerEvents="auto" style={[styles.loader]}>
          <MapLoader />
        </Animated.View>
      )}

      {!!errorToShow && (
        <View pointerEvents="auto" style={styles.loader}>
          <MapError message={errorToShow} />
        </View>
      )}

      {toiletsQuery.isFetching && !showLoader && (
        <Badge
          style={[styles.pending, { top: top + 12 }]}
          variant="secondary"
          className="gap-4 px-3 py-2">
          <LoadingIcon />
          <Text className="text-sm font-medium">Searching toilets...</Text>
        </Badge>
      )}

      <RecenterButton
        visible={!showLoader}
        bottomOffset={bottom + 96}
        onPress={handleRecenter}
      />

      <ToiletBottomSheet selectedToilet={selectedToilet} />
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

type RecenterButtonProps = {
  visible: boolean;
  bottomOffset: number;
  onPress: () => void;
};

const RecenterButton = React.memo(function RecenterButton({
  visible,
  bottomOffset,
  onPress,
}: RecenterButtonProps) {
  if (!visible) {
    return null;
  }

  return (
    <View pointerEvents="auto" style={[styles.recenter, { bottom: bottomOffset }]}>
      <Button
        size="icon"
        variant="secondary"
        onPress={onPress}
        accessibilityLabel="Center map"
        className="rounded-full">
        <Icon as={LocateFixed} size={24} />
      </Button>
    </View>
  );
});
