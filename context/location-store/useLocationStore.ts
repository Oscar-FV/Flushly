import { create } from 'zustand';
import * as Location from 'expo-location';
import { LatLng } from '@/features/Map/types/toilet';

type PermissionStatus = Location.PermissionStatus | 'unknown';

type LocationState = {
  permissionStatus: PermissionStatus;
  isLocationAvailable: boolean;
  isLocating: boolean;
  userLocation: LatLng | null;
  error: string | null;
  askForLocationPermission: () => Promise<boolean>;
  startTracking: () => Promise<void>;
  stopTracking: () => void;
};

let subscription: Location.LocationSubscription | null = null;
let isStarting = false;

export const useLocationStore = create<LocationState>((set, get) => ({
  permissionStatus: 'unknown',
  isLocationAvailable: false,
  isLocating: false,
  userLocation: null,
  error: null,

  askForLocationPermission: async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    set({
      permissionStatus: status,
      isLocationAvailable: status === 'granted',
    });
    return status === 'granted';
  },

  startTracking: async () => {
    if (isStarting || subscription) {
      return;
    }
    isStarting = true;

    try {
      set({ isLocating: true, error: null });

      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Highest, distanceInterval: 0, timeInterval: 3000 },
        (position) => {
          const nextLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          const prevLocation = get().userLocation;
          if (
            prevLocation &&
            Math.abs(prevLocation.latitude - nextLocation.latitude) < 0.00001 &&
            Math.abs(prevLocation.longitude - nextLocation.longitude) < 0.00001
          ) {
            return;
          }
          set({ userLocation: nextLocation });
        }
      );
    } catch (err) {
      set({ error: 'Failed to obtain location.' });
    } finally {
      set({ isLocating: false });
      isStarting = false;
    }
  },

  stopTracking: () => {
    subscription?.remove();
    subscription = null;
    isStarting = false;
  },
}));
