import React from 'react';
import { View } from 'react-native';
import GridOverlay from './grid-overlay';
import { LoaderPin } from './loader-pin';
import ErrorTag from './error-tag';

type MapErrorProps = {
  message?: string;
  hint?: string;
};

export const MapError = ({ message, hint }: MapErrorProps) => {
  return (
    <View className="relative flex-1 bg-background">
      <GridOverlay />
      <ErrorTag message={message} hint={hint} />
      <LoaderPin top={150} left={90} color="#ef4444" />
      <LoaderPin top={300} right={50} size={32} color="#f97316" />
      <LoaderPin bottom={350} right={190} size={54} color="#f59e0b" />
      <LoaderPin bottom={100} left={50} size={32} color="#ef4444" />
    </View>
  );
};
