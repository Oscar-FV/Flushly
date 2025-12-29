import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Map from '../components/map/Map';
import { MapError } from '../components/map-loader.tsx/map-error';
import { MapLoader } from '../components/map-loader.tsx/map-loader';
import { useMapLoadState } from '../hooks/useMapLoadState';
import { useUserLocation } from '../hooks/useUserLocation';

export default function MapScreen() {
  const mapState = useMapLoadState();
  const { isLocating, userLocation } = useUserLocation({ onError: mapState.setError });

  const showLoader =
    (!mapState.hasStyle && !mapState.isMapReady && !mapState.error) ||
    (isLocating && !mapState.error);

  return (
    <View className="flex-1">
      <Map
        userLocation={userLocation}
        onWillStartLoadingMap={mapState.onWillStartLoadingMap}
        onDidFinishLoadingMap={mapState.onDidFinishLoadingMap}
        onDidFailLoadingMap={mapState.onDidFailLoadingMap}
        onDidFinishLoadingStyle={mapState.onDidFinishLoadingStyle}
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
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    ...StyleSheet.absoluteFillObject,
  },
});
