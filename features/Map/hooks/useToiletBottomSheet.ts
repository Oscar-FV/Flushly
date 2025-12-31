import React from 'react';
import type { Toilet } from '../types/toilet';
import { useBottomSheet } from '@/context/bottomsheet-manager';

export const useToiletBottomSheet = () => {
  const [selectedToilet, setSelectedToilet] = React.useState<Toilet | null>(null);
  const toiletSheet = useBottomSheet('toilet-sheet');

  const handleToiletPress = React.useCallback(
    (toilet: Toilet) => {
      setSelectedToilet(toilet);
      toiletSheet.open();
    },
    [toiletSheet]
  );

  return {
    selectedToilet,
    handleToiletPress,
  };
};
