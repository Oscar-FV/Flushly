import { View } from 'react-native';
import React from 'react';
import { ArrowLeft } from 'lucide-react-native';
import InputWithButton from '@/components/ui/input-with-button';
import { Controller } from 'react-hook-form';
import { useSearch } from '../hooks/useSearch';

export const ExploreSearchInput = React.memo(function ExploreSearchInput({
  control,
  placeholder,
  onBackPress,
  onFocus,
  onBlur,
  onSubmitEditing,
  onChangeText,
}: {
  control: ReturnType<typeof useSearch>['control'];
  placeholder: string;
  onBackPress: () => void;
  onFocus: () => void;
  onBlur: (fieldOnBlur: () => void) => () => void;
  onSubmitEditing: () => void;
  onChangeText: (fieldOnChange: (value: string) => void) => (text: string) => void;
}) {
  return (
    <View className="mt-2 px-4">
      <Controller
        control={control}
        render={({ field: { onChange, onBlur: fieldOnBlur, value } }) => (
          <InputWithButton
            autoFocus
            returnKeyType={'search'}
            className="h-14 py-4"
            placeholder={placeholder}
            icon={ArrowLeft}
            iconProps={{ size: 18 }}
            iconOnPress={onBackPress}
            onFocus={onFocus}
            onBlur={onBlur(fieldOnBlur)}
            onSubmitEditing={onSubmitEditing}
            onChangeText={onChangeText(onChange)}
            value={value}
          />
        )}
        name="search"
      />
    </View>
  );
});
