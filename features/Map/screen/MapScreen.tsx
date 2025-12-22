import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Map from '../components/map/Map';
import { MapError } from '../components/map-loader.tsx/map-error';
import { MapLoader } from '../components/map-loader.tsx/map-loader';

export default function MapScreen() {
  const [isMapReady, setIsMapReady] = React.useState(false);
  const [hasStyle, setHasStyle] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const showLoader = !hasStyle && !isMapReady && !error;

  return (
    <View className="flex-1">
      <Map setError={setError} setHasStyle={setHasStyle} setIsMapReady={setIsMapReady} />

      {showLoader && (
        <Animated.View pointerEvents="auto" style={[styles.loader]}>
          <MapLoader />
        </Animated.View>
      )}

      {!!error && (
        <View pointerEvents="auto" style={styles.loader}>
          <MapError message={error} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    ...StyleSheet.absoluteFillObject,
  },
});
