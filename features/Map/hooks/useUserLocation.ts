import React from 'react';
import * as Location from 'expo-location';

interface UseUserLocationOptions {
  onError?: (message: string) => void;
}

export function useUserLocation({ onError }: UseUserLocationOptions = {}) {
  const [userLocation, setUserLocation] = React.useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    let subscription: Location.LocationSubscription | null = null;

    const loadUserLocation = async () => {
      try {
        setIsLocating(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          onError?.('Permiso de ubicacion denegado.');
          return;
        }

        const servicesEnabled = await Location.hasServicesEnabledAsync();
        if (!servicesEnabled) {
          onError?.('Activa los servicios de ubicacion para continuar.');
          return;
        }

        const current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        if (isMounted) {
          setUserLocation([current.coords.longitude, current.coords.latitude]);
        }

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: 5,
          },
          (position) => {
            if (isMounted) {
              setUserLocation([position.coords.longitude, position.coords.latitude]);
            }
          }
        );
      } catch {
        onError?.('No se pudo obtener la ubicacion.');
      } finally {
        if (isMounted) {
          setIsLocating(false);
        }
      }
    };

    loadUserLocation();

    return () => {
      isMounted = false;
      subscription?.remove();
    };
  }, [onError]);

  return { isLocating, userLocation };
}
