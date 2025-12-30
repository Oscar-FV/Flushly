import React from 'react';
import {
  Camera,
  CircleLayer,
  Images,
  MapView,
  ShapeSource,
  SymbolLayer,
  type CameraRef,
  type MapViewRef,
  type RegionPayload,
  type OnPressEvent,
  type SymbolLayerStyle,
} from '@maplibre/maplibre-react-native';
import type { Feature, FeatureCollection, Point } from 'geojson';
import { useColorScheme } from 'nativewind';
import { THEME } from '@/lib/theme';
import type { Toilet } from '../../types/toilet';

const MAP_VIEW_STYLE = { flex: 1 };
const ATTRIBUTION_POSITION = { bottom: 8, right: 8 };
const TOILET_IMAGES = {
  'toilet-pin': require('@/assets/pins/toilet-pin.png'),
};
const TOILETS_ICON_SIZE = [
  'interpolate',
  ['linear'],
  ['zoom'],
  14,
  0.12,
  18,
  0.22,
] as unknown as SymbolLayerStyle['iconSize'];

const TOILETS_SYMBOL_STYLE: SymbolLayerStyle = {
  iconImage: 'toilet-pin',
  iconSize: TOILETS_ICON_SIZE,
  iconAnchor: 'bottom',
  iconAllowOverlap: true,
  iconIgnorePlacement: true,
};

interface MapProps {
  userLocation: [number, number] | null;
  isFollowingUser: boolean;
  mapRef: React.RefObject<MapViewRef | null>;
  onRegionDidChange?: (feature: Feature<Point, RegionPayload>) => void;
  onWillStartLoadingMap: () => void;
  onDidFinishLoadingMap: () => void;
  onDidFailLoadingMap: () => void;
  onDidFinishLoadingStyle: () => void;
  onDidFinishRenderingMapFully?: () => void;
  onUserInteraction?: () => void;
  recenterToken?: number;
  toilets?: Toilet[];
  onToiletPress?: (toilet: Toilet) => void;
}

function Map({
  userLocation,
  isFollowingUser,
  mapRef,
  onRegionDidChange,
  onWillStartLoadingMap,
  onDidFinishLoadingMap,
  onDidFailLoadingMap,
  onDidFinishLoadingStyle,
  onDidFinishRenderingMapFully,
  onUserInteraction,
  recenterToken = 0,
  toilets = [],
  onToiletPress,
}: MapProps) {
  const { colorScheme } = useColorScheme();
  const key = process.env.EXPO_PUBLIC_MAPTILER_KEY;
  // Imperative camera control for initial center and recenter actions.
  const cameraRef = React.useRef<CameraRef>(null);
  // Only auto-center once when the user location first arrives.
  const hasCenteredOnUserRef = React.useRef(false);
  const hasNotifiedInteractionRef = React.useRef(false);

  const styleURL = React.useMemo(() => {
    return `https://api.maptiler.com/maps/basic-v2-${colorScheme}/style.json?key=${key}`;
  }, [colorScheme, key]);

  const userLocationFeature = React.useMemo<FeatureCollection<Point> | null>(() => {
    if (!userLocation) {
      return null;
    }

    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: userLocation,
          },
          properties: {},
        },
      ],
    };
  }, [userLocation]);

  const userLocationColors = React.useMemo(() => {
    return {
      locationColor: colorScheme === 'dark' ? THEME.dark.primary : THEME.light.primary,
      locationStrockeColor:
        colorScheme === 'dark'
          ? THEME.dark.primaryForeground
          : THEME.light.primaryForeground,
    };
  }, [colorScheme]);

  const userLocationStyle = React.useMemo(
    () => ({
      circleRadius: 7,
      circleColor: userLocationColors.locationColor,
      circleStrokeColor: userLocationColors.locationStrockeColor,
      circleStrokeWidth: 2,
    }),
    [userLocationColors]
  );

  const toiletsFeature = React.useMemo<FeatureCollection<Point> | null>(() => {
    if (!toilets.length) {
      return null;
    }

    return {
      type: 'FeatureCollection',
      features: toilets.map((toilet) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [toilet.location.longitude, toilet.location.latitude],
        },
        properties: {
          id: toilet.id,
          kind: toilet.kind,
        },
      })),
    };
  }, [toilets]);

  // Initial camera snap to the user location (only once).
  React.useEffect(() => {
    if (!userLocation || hasCenteredOnUserRef.current) {
      return;
    }

    cameraRef.current?.setCamera({
      centerCoordinate: userLocation,
      zoomLevel: 14,
      animationMode: 'moveTo',
      animationDuration: 0,
    });
    hasCenteredOnUserRef.current = true;
  }, [userLocation]);

  // Triggered by the floating button to recenter on demand.
  React.useEffect(() => {
    if (!userLocation || !recenterToken) {
      return;
    }

    cameraRef.current?.setCamera({
      centerCoordinate: userLocation,
      animationMode: 'flyTo',
      animationDuration: 500,
    });
  }, [recenterToken, userLocation]);

  // If the user starts panning/zooming, notify parent to disable follow mode.
  const handleRegionChange = React.useCallback(
    (feature: Feature<Point, RegionPayload>) => {
      if (feature?.properties?.isUserInteraction && !hasNotifiedInteractionRef.current) {
        hasNotifiedInteractionRef.current = true;
        onUserInteraction?.();
      }
    },
    [onUserInteraction]
  );

  const handleRegionDidChange = React.useCallback(
    (feature: Feature<Point, RegionPayload>) => {
      hasNotifiedInteractionRef.current = false;
      onRegionDidChange?.(feature);
    },
    [onRegionDidChange]
  );

  const handleToiletPress = React.useCallback(
    (event: OnPressEvent) => {
      const feature = event.features?.[0];
      const toiletId = feature?.properties?.id;
      if (typeof toiletId !== 'string') {
        return;
      }

      const selected = toilets.find((toilet) => toilet.id === toiletId);
      if (selected) {
        onToiletPress?.(selected);
      }
    },
    [onToiletPress, toilets]
  );

  return (
    <MapView
      ref={mapRef}
      style={MAP_VIEW_STYLE}
      mapStyle={styleURL}
      logoEnabled={false}
      attributionPosition={ATTRIBUTION_POSITION}
      zoomEnabled
      scrollEnabled
      rotateEnabled={false}
      pitchEnabled={false}
      regionDidChangeDebounceTime={800}
      onRegionWillChange={handleRegionChange}
      onRegionIsChanging={handleRegionChange}
      onWillStartLoadingMap={onWillStartLoadingMap}
      onDidFinishLoadingMap={onDidFinishLoadingMap}
      onDidFailLoadingMap={onDidFailLoadingMap}
      onDidFinishLoadingStyle={onDidFinishLoadingStyle}
      onDidFinishRenderingMapFully={onDidFinishRenderingMapFully}
      onRegionDidChange={handleRegionDidChange}>
      <Camera
        ref={cameraRef}
        minZoomLevel={14}
        maxZoomLevel={20}
        defaultSettings={{
          centerCoordinate: [-99.1332, 19.4326],
          zoomLevel: 14,
        }}
        // Follow the user only when enabled (disabled on manual map interaction).
        followUserLocation={isFollowingUser && !!userLocation}
      />
      <Images
        id="toilets-images"
        images={TOILET_IMAGES}
      />
      {userLocationFeature && (
        <ShapeSource id="user-location" shape={userLocationFeature}>
          <CircleLayer id="user-location-dot" style={userLocationStyle} />
        </ShapeSource>
      )}
      {toiletsFeature && (
        <ShapeSource id="toilets" shape={toiletsFeature} onPress={handleToiletPress}>
          <SymbolLayer id="toilets-symbol" style={TOILETS_SYMBOL_STYLE} />
        </ShapeSource>
      )}
    </MapView>
  );
}

export default React.memo(Map);
