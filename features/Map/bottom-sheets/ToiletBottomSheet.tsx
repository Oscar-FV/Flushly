import React from 'react';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { StyleSheet, View } from 'react-native';
import { useColorScheme } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import type { Toilet } from '../types/toilet';
import { ManagedBottomSheet } from '@/context/bottomsheet-manager';
import BottomSheetBackdropView from '@/components/bottomsheet-backdrop';
import { useReverseGeocoding } from '../hooks/geocoding/useReverseGeocoding';
import { Icon } from '@/components/ui/icon';
import { MapPin } from 'lucide-react-native';
import { ToiletBadge } from '../components/toilet-details/ToiletBadge';
interface ToiletBottomSheetProps {
  selectedToilet: Toilet | null;
}

const ToiletBottomSheet: React.FC<ToiletBottomSheetProps> = ({ selectedToilet }) => {
  const { bottom } = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const resolvedSnapPoints = React.useMemo(() => ['25%', '50%'], []);

  const { data: address, isFetching } = useReverseGeocoding(
    selectedToilet?.location || { latitude: 0, longitude: 0 }
  );

  const badgeVariants = selectedToilet?.badges ?? [];

  return (
    <ManagedBottomSheet
      id="toilet-sheet"
      snapPoints={resolvedSnapPoints}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: theme.background }}
      handleIndicatorStyle={{ backgroundColor: theme.foreground }}
      backdropComponent={BottomSheetBackdropView}
      style={{
        shadowColor: theme.foreground,
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
      }}
      index={1}>
      <BottomSheetView style={[styles.sheetContent, { paddingBottom: bottom + 16 }]}>
        {selectedToilet ? (
          <>
            <Text className="text-2xl font-semibold">{selectedToilet.title}</Text>
            <View className="flex flex-row gap-1">
              <Icon as={MapPin} size={20} className="text-muted-foreground" />
              <Text style={styles.address} className="text-base text-muted-foreground">
                {address ? address : 'No address available.'}
              </Text>
            </View>
            
            {badgeVariants.length > 0 && (
              <View className="flex flex-row flex-wrap gap-2">
                {badgeVariants.map((variant) => (
                  <ToiletBadge key={variant} variant={variant} />
                ))}
              </View>
            )}
          </>
        ) : (
          <Text className="text-sm text-muted-foreground">Tap a pin to see details.</Text>
        )}
      </BottomSheetView>
    </ManagedBottomSheet>
  );
};

const styles = StyleSheet.create({
  sheetContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 8,
  },
  address: {
    flexShrink: 1,
    flexWrap: 'wrap',
  },
});

export default ToiletBottomSheet;
