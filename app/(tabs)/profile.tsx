import { Text } from '@/components/ui/text';
import * as React from 'react';
import { View } from 'react-native';

export default function ProfileScreen() {
  return (
    <View className="flex-1 items-center justify-center p-6">
      <Text className="text-lg font-semibold">Explore</Text>
      <Text className="text-muted-foreground mt-2 text-center">
        This tab is ready for your next screen.
      </Text>
    </View>
  );
}
