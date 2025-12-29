import React from 'react';
import { Camera, CircleLayer, MapView, ShapeSource } from '@maplibre/maplibre-react-native';
import type { FeatureCollection, Point } from 'geojson';
import { useColorScheme } from 'nativewind';
import { THEME } from '@/lib/theme';

interface MapProps {
  userLocation: [number, number] | null;
  onWillStartLoadingMap: () => void;
  onDidFinishLoadingMap: () => void;
  onDidFailLoadingMap: () => void;
  onDidFinishLoadingStyle: () => void;
}

export default function Map({
  userLocation,
  onWillStartLoadingMap,
  onDidFinishLoadingMap,
  onDidFailLoadingMap,
  onDidFinishLoadingStyle,
}: MapProps) {
  const { colorScheme } = useColorScheme();
  const key = process.env.EXPO_PUBLIC_MAPTILER_KEY;

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

  const userLocationColors = {
    locationColor: colorScheme === 'dark' ? THEME.dark.primary : THEME.light.primary,
    locationStrockeColor: colorScheme === 'dark' ? THEME.dark.primaryForeground : THEME.light.primaryForeground,
  };

  return (
    <MapView
      style={{ flex: 1 }}
      mapStyle={styleURL}
      logoEnabled={false}
      attributionPosition={{ bottom: 8, right: 8 }}
      zoomEnabled
      scrollEnabled
      rotateEnabled={false}
      pitchEnabled={false}
      onWillStartLoadingMap={onWillStartLoadingMap}
      onDidFinishLoadingMap={onDidFinishLoadingMap}
      onDidFailLoadingMap={onDidFailLoadingMap}
      onDidFinishLoadingStyle={onDidFinishLoadingStyle}>
      <Camera
        zoomLevel={14}
        minZoomLevel={14}
        maxZoomLevel={20}
        centerCoordinate={userLocation ?? [-99.1332, 19.4326]}
        animationMode="moveTo"
      />
      {userLocationFeature && (
        <ShapeSource id="user-location" shape={userLocationFeature}>
          <CircleLayer
            id="user-location-dot"
            style={{
              circleRadius: 7,
              circleColor: userLocationColors.locationColor,
              circleStrokeColor: userLocationColors.locationStrockeColor,
              circleStrokeWidth: 2,
            }}
          />
        </ShapeSource>
      )}
    </MapView>
  );
}
