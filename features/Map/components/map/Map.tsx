import React from 'react';
import {
  Camera,
  CircleLayer,
  Images,
  MapView,
  ShapeSource,
  SymbolLayer,
  type MapViewRef,
  type RegionPayload,
  type OnPressEvent,
  type SymbolLayerStyle,
} from '@maplibre/maplibre-react-native';
import type { Feature, FeatureCollection, Point } from 'geojson';
import { useColorScheme } from 'nativewind';
import { THEME } from '@/lib/theme';
import type { LatLng, Toilet } from '../../types/toilet';

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
  userLocation: LatLng | null;
  mapRef: React.RefObject<MapViewRef | null>;
  cameraDefaultLocation?: LatLng | null;
  cameraKeySeed?: number;
  onRegionDidChange?: (feature: Feature<Point, RegionPayload>) => void;
  onWillStartLoadingMap: () => void;
  onDidFinishLoadingMap: () => void;
  onDidFailLoadingMap: () => void;
  onDidFinishLoadingStyle: () => void;
  onDidFinishRenderingMapFully?: () => void;
  toilets?: Toilet[];
  onToiletPress?: (toilet: Toilet) => void;
}

function Map({
  userLocation,
  mapRef,
  cameraDefaultLocation = null,
  cameraKeySeed = 0,
  onRegionDidChange,
  onWillStartLoadingMap,
  onDidFinishLoadingMap,
  onDidFailLoadingMap,
  onDidFinishLoadingStyle,
  onDidFinishRenderingMapFully,
  toilets = [],
  onToiletPress,
}: MapProps) {
  const { colorScheme } = useColorScheme();
  const key = process.env.EXPO_PUBLIC_MAPTILER_KEY;
  const cameraDefaults = React.useMemo(() => {
    if (!cameraDefaultLocation) {
      return undefined;
    }
    return {
      centerCoordinate: [
        cameraDefaultLocation.longitude,
        cameraDefaultLocation.latitude,
      ] as [number, number],
      zoomLevel: 14,
    };
  }, [cameraDefaultLocation]);
  const cameraKey = `${cameraKeySeed}-${cameraDefaultLocation ? 'user' : 'default'}`;

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
            coordinates: [userLocation.longitude, userLocation.latitude],
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
        colorScheme === 'dark' ? THEME.dark.primaryForeground : THEME.light.primaryForeground,
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

  const handleRegionDidChange = React.useCallback(
    (feature: Feature<Point, RegionPayload>) => {
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
      onWillStartLoadingMap={onWillStartLoadingMap}
      onDidFinishLoadingMap={onDidFinishLoadingMap}
      onDidFailLoadingMap={onDidFailLoadingMap}
      onDidFinishLoadingStyle={onDidFinishLoadingStyle}
      onDidFinishRenderingMapFully={onDidFinishRenderingMapFully}
      onRegionDidChange={handleRegionDidChange}>
      <Camera
        key={cameraKey}
        minZoomLevel={14}
        maxZoomLevel={20}
        defaultSettings={cameraDefaults}
        followUserLocation={false}
      />
      <Images id="toilets-images" images={TOILET_IMAGES} />
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
