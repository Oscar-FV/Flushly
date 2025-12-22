import React from 'react';
import { Camera, MapView } from '@maplibre/maplibre-react-native';
import { useColorScheme } from 'nativewind';

interface MapProps {
  setIsMapReady: React.Dispatch<boolean>;
  setHasStyle: React.Dispatch<boolean>;
  setError: React.Dispatch<string | null>;
}

export default function Map({ setError, setHasStyle, setIsMapReady }: MapProps) {
  const { colorScheme } = useColorScheme();
  const key = process.env.EXPO_PUBLIC_MAPTILER_KEY;

  const styleURL = React.useMemo(() => {
    return `https://api.maptiler.com/maps/basic-v2-${colorScheme}/style.json?key=${key}`;
  }, [colorScheme, key]);

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
      onWillStartLoadingMap={() => {
        setError(null);
        setIsMapReady(false);
        setHasStyle(false);
      }}
      onDidFinishLoadingMap={() => {
        setIsMapReady(true);
      }}
      onDidFailLoadingMap={() => {
        setError('Falló al cargar el mapa.');
        setIsMapReady(false);
      }}
      onDidFinishLoadingStyle={() => {
        setHasStyle(true);
      }}>
      <Camera zoomLevel={14} centerCoordinate={[-99.1332, 19.4326]} animationMode="moveTo" />
    </MapView>
  );
}
