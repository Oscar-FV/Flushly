import React from 'react';
import { View } from 'react-native';
import GridOverlay from './grid-overlay';
import { LoaderPin } from './loader-pin';
import LoaderTag from './loader-tag';

export const MapLoader = () => {
  return (
    <View className="relative flex-1 bg-background">
      <GridOverlay />
      <LoaderTag />
      <LoaderPin top={150} left={90} color="#e11d48" />
      <LoaderPin top={300} right={50} size={32} color="#10b981" />
      <LoaderPin bottom={350} right={190} size={54} color="#3b82f6" />
      <LoaderPin bottom={100} left={50} size={32} color="#f59e0b" />
    </View>
  );
};
