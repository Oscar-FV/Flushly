import React from 'react';

export function useMapLoadState() {
  const [isMapReady, setIsMapReady] = React.useState(false);
  const [hasStyle, setHasStyle] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onWillStartLoadingMap = React.useCallback(() => {
    setError(null);
    setIsMapReady(false);
    setHasStyle(false);
  }, []);

  const onDidFinishLoadingMap = React.useCallback(() => {
    setIsMapReady(true);
  }, []);

  const onDidFailLoadingMap = React.useCallback(() => {
    setError('Fallo al cargar el mapa.');
    setIsMapReady(false);
  }, []);

  const onDidFinishLoadingStyle = React.useCallback(() => {
    setHasStyle(true);
  }, []);

  return {
    error,
    hasStyle,
    isMapReady,
    onDidFailLoadingMap,
    onDidFinishLoadingMap,
    onDidFinishLoadingStyle,
    onWillStartLoadingMap,
    setError,
  };
}
